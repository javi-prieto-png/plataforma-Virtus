"use server";

import prisma from "@/lib/prisma";

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) return { error: "El correo es obligatorio." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Por seguridad, siempre devolvemos éxito incluso si el usuario no existe
    if (user) {
      console.log(`[AUTH_RECOVERY] Simulando envío de correo de recuperación a: ${email}`);
      console.log(`[AUTH_RECOVERY] Token generado (simulado): recovery_${Math.random().toString(36).substr(2, 9)}`);
    }

    return { 
      success: true, 
      message: "Si el correo está registrado, recibirás instrucciones en breve." 
    };
  } catch (error) {
    console.error("Error in password reset request:", error);
    return { error: "Hubo un problema al procesar tu solicitud." };
  }
}
