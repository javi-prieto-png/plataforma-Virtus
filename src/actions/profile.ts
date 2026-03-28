"use server";

import prisma from "@/lib/prisma";
import { getSession, updateSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Permite al usuario (Alumno o Admin) actualizar su información de perfil.
 */
export async function updateProfileAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: "No autorizado." };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const profilePic = formData.get("profilePic") as string;

    if (!name || !email) return { error: "Nombre y correo son obligatorios." };

    // Verificar si el email ya existe en otro usuario
    const existingUser = await prisma.user.findFirst({
      where: { 
        email,
        NOT: { id: session.userId }
      }
    });

    if (existingUser) return { error: "El correo electrónico ya está en uso." };

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
        phone,
        profilePic: profilePic || null
      }
    });

    // Actualizar la sesión para que los cambios se reflejen (solo campos permitidos en SessionPayload)
    await updateSession({
      isProfileComplete: true 
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/perfil");
    
    return { success: true };
  } catch (error) {
    console.error("[PROFILE-UPDATE-ERROR]:", error);
    return { error: "Error al actualizar el perfil." };
  }
}
