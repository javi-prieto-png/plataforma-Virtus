"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Credenciales inválidas." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Credenciales inválidas." };
  }

  // Generamos la Payload según los requerimientos del Gatekeeper
  const payload = {
    userId: user.id,
    role: user.role,
    isFirstLogin: user.isFirstLogin,
    isProfileComplete: user.isProfileComplete,
  };

  // Encriptamos y seteamos Cookie Edge
  await createSession(payload);

  // Redirigir siempre a /dashboard y dejar que el middleware decida
  redirect("/dashboard");
}
