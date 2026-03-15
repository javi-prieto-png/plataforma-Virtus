"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { updateSession, decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function changePasswordAction(formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) return { error: "Todos los campos son obligatorios." };
  if (newPassword !== confirmPassword) return { error: "Las contraseñas no coinciden." };
  if (newPassword.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };

  // Recuperar sesión
  const cookieStore = await cookies();
  const sessionData = await decrypt(cookieStore.get("session")?.value);
  if (!sessionData) return { error: "Sesión inválida." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: sessionData.userId },
    data: { 
      password: hashedPassword,
      isFirstLogin: false // Levantamos la restricción del guardian 1
    },
  });

  await updateSession({ isFirstLogin: false });

  // Al finalizar, el middleware interceptará la redirección y enviará a completar perfil si es necesario.
  redirect("/dashboard");
}

export async function completeProfileAction(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  
  if (!name || !phone) return { error: "Todos los campos son obligatorios." };

  const cookieStore = await cookies();
  const sessionData = await decrypt(cookieStore.get("session")?.value);
  if (!sessionData) return { error: "Sesión inválida." };

  // TODO: Agregar lógica de subida de imagen para `profilePic` (S3/Cloudinary/Local) si es necesario.

  await prisma.user.update({
    where: { id: sessionData.userId },
    data: { 
      name,
      phone,
      isProfileComplete: true // Levantamos la restricción del guardian 2
    },
  });

  await updateSession({ isProfileComplete: true });

  redirect("/dashboard");
}
