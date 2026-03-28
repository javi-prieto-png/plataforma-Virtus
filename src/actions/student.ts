"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Marca un vídeo como visto por el usuario actual.
 */
export async function markVideoAsWatchedAction(videoId: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Sesión no válida." };

    await prisma.interaction.upsert({
      where: {
        userId_videoId: {
          userId: session.id,
          videoId: videoId,
        },
      },
      update: {
        isWatched: true,
      },
      create: {
        userId: session.id,
        videoId: videoId,
        isWatched: true,
      },
    });

    revalidatePath(`/cursos/${videoId}`);
    revalidatePath("/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error marking video as watched:", error);
    return { error: "Error al registrar progreso." };
  }
}

/**
 * Procesa el feedback (Like/Dislike) y las dudas privadas.
 */
export async function submitVideoFeedbackAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: "Sesión no válida." };

    const videoId = formData.get("videoId") as string;
    const content = formData.get("content") as string;
    const likeStatus = formData.get("likeStatus") as string; // "LIKE", "DISLIKE", o null
    const isQuestion = formData.get("isQuestion") === "true";

    if (!videoId) return { error: "ID de vídeo requerido." };

    // 1. Actualizar Interaction (Like/Dislike)
    if (likeStatus) {
      await prisma.interaction.upsert({
        where: {
          userId_videoId: {
            userId: session.id,
            videoId: videoId,
          },
        },
        update: {
          likeStatus: likeStatus,
        },
        create: {
          userId: session.id,
          videoId: videoId,
          likeStatus: likeStatus,
          isWatched: false,
        },
      });
    }

    // 2. Crear Feedback (Dudas o Motivo de Dislike)
    if (content && content.trim() !== "") {
      await prisma.feedback.create({
        data: {
          userId: session.id,
          videoId: videoId,
          content: content,
          isPrivate: true,
        },
      });
    }

    revalidatePath(`/cursos/${videoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { error: "Error al enviar feedback." };
  }
}

/**
 * Obtiene los videos disponibles para el alumno.
 */
export async function getStudentVideos() {
  try {
    const session = await getSession();
    if (!session) return [];

    const videos = await prisma.video.findMany({
      orderBy: { uploadDate: "desc" },
      include: {
        category: true,
        interactions: {
          where: { userId: session.id }
        }
      }
    });

    return videos;
  } catch (error) {
    console.error("Error fetching student videos:", error);
    return [];
  }
}

/**
 * Obtiene un video específico con el estado de interacción del usuario.
 */
export async function getStudentVideo(videoId: string) {
  try {
    const session = await getSession();
    if (!session) return null;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        category: true,
        interactions: {
          where: { userId: session.id }
        }
      }
    });

    return video;
  } catch (error) {
    console.error("Error fetching student video:", error);
    return null;
  }
}
