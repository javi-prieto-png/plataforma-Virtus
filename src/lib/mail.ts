import nodemailer from "nodemailer";

/**
 * Servicio centralizado de envío de correos electrónicos.
 * Utiliza variables de entorno para la configuración SMTP.
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true para 465, false para otros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html, text }: { to: string; subject: string; html?: string; text?: string }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"VIRTUS" <noreply@virtus.sys>',
      to,
      subject,
      text,
      html,
    });
    console.log(`[MAIL-SYSTEM] Correo enviado: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[MAIL-SYSTEM] Error al enviar correo:", error);
    return { success: false, error };
  }
}

/**
 * Plantilla de correo de Bienvenida (Sleek Minimalist 4)
 */
export function getWelcomeEmailTemplate(name: string, password: string) {
  return `
    <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border: 1px solid #333;">
      <h1 style="color: #22d3ee; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 300;">
        VIRTUS <span style="font-weight: bold;">SYSTEM</span>
      </h1>
      <p style="color: #888; text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; border-bottom: 1px solid #222; padding-bottom: 20px;">
        PROTOCOLO DE ACCESO: ACTIVADO
      </p>
      
      <p style="font-size: 16px; font-weight: 300; margin-top: 30px;">
        Hola <span style="color: #22d3ee; font-weight: bold;">${name}</span>,
      </p>
      <p style="color: #ccc; line-height: 1.6;">
        Bienvenido a la élite del entrenamiento y la salud integral. Tu cuenta en <b>VIRTUS</b> ha sido creada con éxito.
      </p>
      
      <div style="background-color: #0c0c0c; border: 1px solid #22d3ee44; padding: 20px; margin: 30px 0;">
        <p style="color: #555; font-size: 10px; text-transform: uppercase; margin: 0 0 10px 0;">Contraseña Temporal</p>
        <p style="font-family: monospace; font-size: 24px; color: #22d3ee; letter-spacing: 5px; margin: 0;">${password}</p>
      </div>
      
      <p style="color: #666; font-size: 12px;">
        * Por seguridad, el sistema te obligará a cambiar esta contraseña en tu primer inicio de sesión.
      </p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
         style="display: inline-block; background-color: #22d3ee; color: #000; text-decoration: none; padding: 15px 30px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; margin-top: 20px;">
        INGRESAR AL SISTEMA
      </a>
    </div>
  `;
}

/**
 * Plantilla de correo de Recuperación de Contraseña
 */
export function getPasswordResetEmailTemplate(token: string) {
  return `
    <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border: 1px solid #333;">
      <h1 style="color: #22d3ee; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 300;">
        VIRTUS <span style="font-weight: bold;">SECURITY</span>
      </h1>
      <p style="color: #888; text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; border-bottom: 1px solid #222; padding-bottom: 20px;">
        SOLICITUD DE RESTABLECIMIENTO DE CLAVE
      </p>
      
      <p style="font-size: 16px; font-weight: 300; margin-top: 30px;">
        Has solicitado restablecer tu contraseña en VIRTUS.
      </p>
      
      <div style="background-color: #0c0c0c; border: 1px solid #22d3ee44; padding: 20px; margin: 30px 0;">
        <p style="color: #555; font-size: 10px; text-transform: uppercase; margin: 0 0 10px 0;">Código de Verificación</p>
        <p style="font-family: monospace; font-size: 24px; color: #22d3ee; letter-spacing: 5px; margin: 0;">${token}</p>
      </div>
      
      <p style="color: #666; font-size: 12px;">
        Introduce este código en la página de recuperación para elegir una nueva contraseña. 
        Si no has solicitado este cambio, puedes ignorar este correo.
      </p>
    </div>
  `;
}
/**
 * Plantilla de correo para Nuevos Mensajes
 */
export function getNewMessageEmailTemplate(senderName: string, message: string) {
  return `
    <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border: 1px solid #333;">
      <h1 style="color: #22d3ee; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 300;">
        VIRTUS <span style="font-weight: bold;">MESSAGING</span>
      </h1>
      <p style="color: #888; text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; border-bottom: 1px solid #222; padding-bottom: 20px;">
        NOTIFICACIÓN DE NUEVO MENSAJE
      </p>
      
      <p style="font-size: 16px; font-weight: 300; margin-top: 30px;">
        Has recibido un nuevo mensaje de <span style="color: #22d3ee; font-weight: bold;">${senderName}</span>:
      </p>
      
      <div style="background-color: #0c0c0c; border-left: 3px solid #22d3ee; padding: 20px; margin: 30px 0; color: #ccc; font-style: italic;">
        "${message}"
      </div>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
         style="display: inline-block; background-color: #22d3ee; color: #000; text-decoration: none; padding: 15px 30px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; margin-top: 20px;">
        RESPONDER AHORA
      </a>
    </div>
  `;
}
