"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendMail, getNewMessageEmailTemplate } from "@/lib/mail";

/**
 * Filtro de seguridad básico para contenidos de mensajería.
 * <security_layer>
 * - Escapa caracteres HTML básicos para prevenir inyecciones.
 * - Filtra lenguaje inapropiado (lista básica expandible).
 * </security_layer>
 */
function filterContent(content: string): string {
  let filtered = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const forbiddenWords = ["spam", "ofensa", "palabrota"]; // Lista básica
  forbiddenWords.forEach(word => {
    const regex = new RegExp(word, "gi");
    filtered = filtered.replace(regex, "****");
  });

  return filtered;
}

/**
 * Acción para enviar un mensaje en el Buzón.
 * Vincula el mensaje al ID del usuario, opcionalmente a un vídeo, y dispara notificaciones.
 */
export async function sendMessageAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: "Acceso denegado." };

    const contentInput = formData.get("content") as string;
    const receiverIdInput = formData.get("receiverId") as string;
    const videoId = formData.get("videoId") as string || null;

    if (!contentInput || contentInput.trim() === "") {
      return { error: "El mensaje no puede estar vacío." };
    }

    const content = filterContent(contentInput);
    let receiverId = receiverIdInput;

    // Si el remitente es un ESTUDIANTE, el receptor por defecto es el ADMIN.
    if (session.role === "STUDENT" && !receiverId) {
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      if (!admin) return { error: "Sistema de administración no disponible." };
      receiverId = admin.id;
    }

    const newMessage = await (prisma.message as any).create({
      data: {
        content,
        senderId: session.userId,
        receiverId: receiverId,
        videoId: videoId,
      },
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
      }
    }) as any;

    // \ud83d\udce7 Sistema de Alertas por Correo
    await sendMail({
      to: newMessage.receiver.email,
      subject: `Nuevo mensaje en VIRTUS de ${newMessage.sender.name}`,
      html: getNewMessageEmailTemplate(newMessage.sender.name, content),
      text: `Has recibido un nuevo mensaje de ${newMessage.sender.name}: ${content}`
    });

    revalidatePath("/dashboard/chat");
    revalidatePath("/dashboard/chat/inbox");
    revalidatePath(`/admin/chat`);
    revalidatePath(`/admin/chat/${receiverId}`);
    revalidatePath(`/admin/chat/${session.userId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[CHAT-ACTION] Error:", error);
    return { error: "Error al procesar el mensaje." };
  }
}

/**
 * Recupera el historial de chat entre el usuario actual y su contraparte,
 * filtrado opcionalmente por un vídeo específico.
 */
export async function getConversationAction(otherUserId?: string, videoId?: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "No autorizado." };

    let targetId = otherUserId;

    if (session.role === "STUDENT") {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!admin) return { error: "Admin no encontrado." };
      targetId = admin.id;
    }

    if (!targetId) return { error: "Interlocutor no definido." };

    if (session.userId === targetId || session.role === "ADMIN") {
      await (prisma.message as any).updateMany({
        where: {
          senderId: targetId,
          receiver: { role: "ADMIN" }, // Cualquier admin que haya recibido consulta
          videoId: (videoId as any) || null,
          isRead: false
        },
        data: { isRead: true }
      });
    }

    const messages = await (prisma.message as any).findMany({
      where: {
        AND: [
          session.role === "ADMIN" 
          ? {
              OR: [
                { senderId: targetId },
                { receiverId: targetId },
              ]
            }
          : {
              OR: [
                { senderId: session.userId, receiverId: targetId },
                { senderId: targetId, receiverId: session.userId },
              ]
            },
          { videoId: (videoId as any) || null }
        ]
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true, role: true } },
        video: { select: { title: true } }
      }
    }) as any[];

    return { messages };
  } catch (error) {
    return { error: "Error al recuperar mensajes." };
  }
}

/**
 * Recupera la lista de conversaciones recientes para el Administrador.
 * Segmentado por Alumno y V\u00eddeo. Calcula mensajes pendientes por hilo.
 */
export async function getAdminInboxAction() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return { error: "No autorizado." };

    // Fetch global para evitar fallos de relación en Prisma con tipos stale
    const messages = await (prisma.message as any).findMany({
      orderBy: { createdAt: "desc" },
      take: 200, // Tomamos suficiente histórico para cubrir todos los hilos activos
      include: {
        sender: { select: { id: true, name: true, role: true, email: true } },
        receiver: { select: { id: true, name: true, role: true, email: true } },
        video: { select: { id: true, title: true } }
      }
    }) as any[];

    const threadsMap = new Map();

    messages.forEach(msg => {
      // Identificar al interlocutor (prioridad Estudiante > Otros)
      let interlocutor = null;
      if (msg.sender && msg.sender.role === "STUDENT") {
        interlocutor = msg.sender;
      } else if (msg.receiver && msg.receiver.role === "STUDENT") {
        interlocutor = msg.receiver;
      } else {
        // Para pruebas Admin-Admin o mensajes de sistema
        interlocutor = (msg.senderId !== session.userId) ? msg.sender : msg.receiver;
      }

      if (!interlocutor) return;
      
      const threadKey = `${interlocutor.id}-${msg.videoId || 'general'}`;
      const existingThread = threadsMap.get(threadKey);
      
      if (!existingThread) {
        threadsMap.set(threadKey, {
          id: interlocutor.id,
          name: interlocutor.name,
          email: interlocutor.email,
          videoId: msg.videoId,
          videoTitle: msg.video?.title || "CONSULTA GENERAL",
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: (msg.receiverId === session.userId && !msg.isRead) ? 1 : 0
        });
      } else {
        // Sumar al contador si el mensaje es para el admin actual y no est\u00e1 le\u00eddo
        if (msg.receiverId === session.userId && !msg.isRead) {
          existingThread.unreadCount += 1;
        }
      }
    });

    return { inbox: Array.from(threadsMap.values()) };
  } catch (error) {
    console.error("[INBOX-ACTION-ERROR]:", error);
    return { error: "Error al cargar la bandeja de entrada." };
  }
}

/**
 * Recupera la bandeja de entrada personalizada para el Estudiante.
 * Permite ver sus hilos abiertos por vídeo.
 */
export async function getStudentInboxAction() {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") return { error: "No autorizado." };

    const messages = await (prisma.message as any).findMany({
      where: {
        OR: [
          { senderId: session.userId },
          { receiverId: session.userId }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        video: { select: { id: true, title: true } }
      }
    }) as any[];

    const threadsMap = new Map();

    messages.forEach(msg => {
      const threadKey = msg.videoId || 'general';
      
      if (!threadsMap.has(threadKey)) {
        threadsMap.set(threadKey, {
          videoId: msg.videoId,
          videoTitle: msg.video?.title || "SOPORTE GENERAL",
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt
        });
      }
    });

    return { inbox: Array.from(threadsMap.values()) };
  } catch (error) {
    return { error: "Error al cargar tu buzón." };
  }
}
