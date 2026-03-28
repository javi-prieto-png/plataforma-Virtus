import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando Seed de la Base de Datos...");

  // Hashear contraseña por defecto
  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  // 1. Crear Usuario Administrador (Gatekeeper by-passed)
  const admin = await prisma.user.upsert({
    where: { email: "admin@antigravity.sys" },
    update: {},
    create: {
      name: "Sudo Amin",
      email: "admin@antigravity.sys",
      phone: "+34 600 000 000",
      password: adminPassword,
      role: "ADMIN",
      isFirstLogin: false,
      isProfileComplete: true,
    },
  });

  console.log(`✅ Creado ADMIN: ${admin.email} / admin123`);

  // 2. Crear Alumno de Prueba 1 (Gatekeeper Activo)
  const student1 = await prisma.user.upsert({
    where: { email: "alumno@test.com" },
    update: {},
    create: {
      name: "Alumno de Prueba",
      email: "alumno@test.com",
      phone: "+34 611 111 111",
      password: studentPassword,
      role: "STUDENT",
      isFirstLogin: true,      // Pendiente de cambiar pass
      isProfileComplete: false, // Pendiente foto y datos
    },
  });

  console.log(`✅ Creado STUDENT: ${student1.email} / student123 (Requiere Onboarding)`);

  // 3. Crear Alumno de Prueba 2 (Gatekeeper Superado)
  const student2 = await prisma.user.upsert({
    where: { email: "veterano@test.com" },
    update: {},
    create: {
      name: "Alumno Veterano",
      email: "veterano@test.com",
      phone: "+34 622 222 222",
      password: studentPassword,
      role: "STUDENT",
      isFirstLogin: false,
      isProfileComplete: true,
    },
  });

  console.log(`✅ Creado STUDENT: ${student2.email} / student123 (Onboarding Superado)`);

  // 4. Crear Categorías base
  const catFitness = await prisma.category.upsert({
    where: { name: "FITNESS" },
    update: {},
    create: { name: "FITNESS" }
  });

  const catNutrition = await prisma.category.upsert({
    where: { name: "NUTRITION" },
    update: {},
    create: { name: "NUTRITION" }
  });

  const catMindfulness = await prisma.category.upsert({
    where: { name: "MINDFULNESS" },
    update: {},
    create: { name: "MINDFULNESS" }
  });

  console.log(`✅ Categorías base inyectadas.`);

  // 5. Crear Contenidos VOD de ejemplo
  const video1 = await prisma.video.upsert({
    where: { id: "seed-vid-1" },
    update: {},
    create: {
      id: "seed-vid-1",
      title: "Biomecánica del Peso Muerto",
      youtubeLink: "https://www.youtube.com/watch?v=op9kVnSso6Q",
      categoryId: catFitness.id
    }
  });

  const video2 = await prisma.video.upsert({
    where: { id: "seed-vid-2" },
    update: {},
    create: {
      id: "seed-vid-2",
      title: "Pautas Nutricionales: Déficit Calórico",
      youtubeLink: "https://www.youtube.com/watch?v=0_u_SUnPezE",
      categoryId: catNutrition.id
    }
  });

  console.log(`✅ Videos de prueba inyectados.`);

  // 6. Crear Feedbacks de prueba
  await prisma.feedback.createMany({
    data: [
      {
        userId: student1.id,
        content: "¿Cómo puedo ajustar los macros si entreno por la mañana?",
        isPrivate: true,
        isResolved: false
      },
      {
        userId: student2.id,
        videoId: video1.id,
        content: "No entiendo bien la posición de la cadera en el minuto 2:30. ¿Puedes revisarlo?",
        isPrivate: true,
        isResolved: false
      },
      {
        userId: student2.id,
        videoId: video2.id,
        content: "Dislike: La explicación de las grasas me parece confusa.",
        isPrivate: true,
        isResolved: false
      }
    ]
  });

  console.log(`✅ Feedbacks de prueba inyectados.`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seed completado.");
  });
