"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendMail, getWelcomeEmailTemplate } from "@/lib/mail";

// ==========================================
// 1. GESTIÓN DE ALUMNOS (CRUD)
// ==========================================

export async function createStudentAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!name || !email) return { error: "Nombre y correo son obligatorios." };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "El correo ya está en uso." };

    // Generar contraseña aleatoria (6 caracteres alfanuméricos)
    const rawPassword = Math.random().toString(36).slice(-6).toUpperCase();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "STUDENT",
        isFirstLogin: true,      // Gatekeeper activo
        isProfileComplete: false // Gatekeeper activo
      }
    });

    // ENVÍO DE CORREO REAL
    await sendMail({
      to: email,
      subject: "Bienvenido a VIRTUS - Tus Credenciales de Acceso",
      html: getWelcomeEmailTemplate(name, rawPassword),
      text: `Hola ${name}, tu contraseña temporal para VIRTUS es: ${rawPassword}`
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Hubo un error al crear el usuario." };
  }
}

export async function deleteStudentAction(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/configuracion");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el usuario." };
  }
}

export async function createAdminAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) return { error: "Nombre y correo son obligatorios." };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "El correo ya está en uso." };

    const rawPassword = Math.random().toString(36).slice(-6).toUpperCase();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isFirstLogin: true,
        isProfileComplete: true
      }
    });

    await sendMail({
      to: email,
      subject: "[ACCESO_ADMIN] Bienvenido a VIRTUS",
      html: getWelcomeEmailTemplate(name, rawPassword),
      text: `Hola ${name}, se te ha concedido acceso administrativo a VIRTUS. Tu contraseña temporal es: ${rawPassword}`
    });

    revalidatePath("/admin/configuracion");
    return { success: true };
  } catch (error) {
    return { error: "Error al crear el administrador." };
  }
}

// ==========================================
// 2. GESTIÓN DE CONTENIDOS (YOUTUBE)
// ==========================================

export async function createVideoAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const youtubeLink = formData.get("youtubeLink") as string;
    const category = formData.get("category") as string;
    const uploadDateStr = formData.get("uploadDate") as string;

    if (!title || !youtubeLink || !category) return { error: "Todos los campos obligatorios." };
    if (!["NUTRITION", "FITNESS", "MINDFULNESS"].includes(category)) return { error: "Categoría inválida." };

    const uploadDate = uploadDateStr ? new Date(uploadDateStr) : new Date();

    await prisma.video.create({
      data: { 
        title, 
        youtubeLink, 
        category,
        uploadDate
      }
    });

    revalidatePath("/admin/vod");
    revalidatePath("/cursos");
    return { success: true };
  } catch (error) {
    return { error: "Error al publicar el vídeo." };
  }
}

export async function deleteVideoAction(videoId: string) {
  try {
    await prisma.video.delete({ where: { id: videoId } });
    revalidatePath("/admin/vod");
    revalidatePath("/cursos");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el vídeo." };
  }
}

// ==========================================
// 3. RECUPERAR DATOS PARA LAS TABLAS
// ==========================================

export async function getStudents() {
  return await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" }
  });
}

export async function getVideos() {
  return await prisma.video.findMany({
    orderBy: { uploadDate: "desc" }
  });
}

export async function getFeedbacks() {
  return await prisma.feedback.findMany({
    include: { 
      user: { select: { name: true, email: true } },
      video: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}
