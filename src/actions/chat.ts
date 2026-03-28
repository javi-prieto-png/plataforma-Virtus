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
 * Vincula el mensaje al ID del usuario y dispara notificaciones.
 */
export async function sendMessageAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: "Acceso denegado." };

    const contentInput = formData.get("content") as string;
    const receiverIdInput = formData.get("receiverId") as string;

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

    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId: session.userId,
        receiverId: receiverId,
      },
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
      }
    });

    // 📧 Sistema de Alertas por Correo
    // Notificar al receptor sobre el nuevo mensaje
    await sendMail({
      to: newMessage.receiver.email,
      subject: `Nuevo mensaje en VIRTUS de ${newMessage.sender.name}`,
      html: getNewMessageEmailTemplate(newMessage.sender.name, content),
      text: `Has recibido un nuevo mensaje de ${newMessage.sender.name}: ${content}`
    });

    revalidatePath("/dashboard/chat");
    revalidatePath(`/admin/chat/${receiverId}`);
    revalidatePath(`/admin/chat/${session.userId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[CHAT-ACTION] Error:", error);
    return { error: "Error al procesar el mensaje." };
  }
}

/**
 * Recupera el historial de chat entre el usuario actual y su contraparte.
 */
export async function getConversationAction(otherUserId?: string) {
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

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, receiverId: targetId },
          { senderId: targetId, receiverId: session.userId },
        ]
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true, role: true } }
      }
    });

    return { messages };
  } catch (error) {
    return { error: "Error al recuperar mensajes." };
  }
}

/**
 * Recupera la lista de conversaciones recientes para el Administrador.
 * Ordenada por el mensaje más reciente de cada usuario.
 */
export async function getAdminInboxAction() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return { error: "No autorizado." };

    // Agrupamos por estudiantes que han tenido interacción
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        receivedMessages: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        sentMessages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    // Filtramos solo los que tienen mensajes y ordenamos
    const inbox = students
      .map(s => {
        const lastIn = s.sentMessages[0]?.createdAt || new Date(0);
        const lastOut = s.receivedMessages[0]?.createdAt || new Date(0);
        return {
          ...s,
          lastMessageAt: lastIn > lastOut ? lastIn : lastOut
        };
      })
      .filter(s => s.lastMessageAt.getTime() > 0)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return { inbox };
  } catch (error) {
    return { error: "Error al cargar la bandeja de entrada." };
  }
}
