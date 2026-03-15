"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Registra que el usuario ha aceptado el Aviso Legal y de Salud.
 */
export async function acceptLegalAction() {
  try {
    const session = await getSession();
    if (!session) return { error: "Sesión no válida." };

    await prisma.user.update({
      where: { id: session.id },
      data: { hasAcceptedLegal: true },
    });

    revalidatePath("/");
    revalidatePath("/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error accepting legal notice:", error);
    return { error: "Error al procesar la aceptación legal." };
  }
}
