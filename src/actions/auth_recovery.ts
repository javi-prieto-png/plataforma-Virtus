"use server";

import prisma from "@/lib/prisma";
import { sendMail, getPasswordResetEmailTemplate } from "@/lib/mail";

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) return { error: "El correo es obligatorio." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Por seguridad, siempre devolvemos éxito incluso si el usuario no existe (previene user enumeration)
    if (user) {
      const token = `recovery_${Math.random().toString(36).substr(2, 9)}`;
      
      await sendMail({
        to: email,
        subject: "Restablecer Contraseña - VIRTUS",
        html: getPasswordResetEmailTemplate(token),
        text: `Has solicitado restablecer tu contraseña en VIRTUS. Tu código es: ${token}`
      });
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
