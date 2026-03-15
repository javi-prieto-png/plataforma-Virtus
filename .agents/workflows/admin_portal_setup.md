---
description: Configuración del Portal de Administrador (CRUD, Base de Datos y UI)
---

# 🛡️ Workflow: Configuración del Portal de Administrador

Este workflow documenta los pasos para construir e implementar el Portal de Administración de la plataforma de Nutrición y Fitness. Cumple con las normativas relativas a seguridad de rutas, estética Sleek Minimalist 4 y segregación de usuarios.

## Paso 1: Configurar Esquema de Base de Datos (Prisma ORM)

Ejecuta el siguiente esquema para preparar las tablas en PostgreSQL/MySQL. Este esquema incluye la bandera `primer_login` de Seguridad y el modelo de interacciones.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o mysql
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  STUDENT
}

enum Category {
  NUTRITION
  FITNESS
}

enum Emotion {
  LIKE
  DISLIKE
}

// 👤 MODELO: Usuarios
model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  phone        String?
  password     String        // Hasheado con bcrypt
  profilePic   String?
  role         Role          @default(STUDENT)
  isFirstLogin Boolean       @default(true) // Guardián de onboarding
  interactions Interaction[]
  feedbacks    Feedback[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// 🎥 MODELO: Videos
model Video {
  id           String        @id @default(uuid())
  title        String
  youtubeLink  String
  category     Category
  uploadDate   DateTime      @default(now())
  interactions Interaction[]
}

// ✅ MODELO: Interacciones (Checks y Likes)
model Interaction {
  id         String   @id @default(uuid())
  userId     String
  videoId    String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  video      Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  isWatched  Boolean  @default(false)   // Autocompletado al finalizar el vídeo
  likeStatus Emotion?                     // LIKE / DISLIKE
  createdAt  DateTime @default(now())

  @@unique([userId, videoId]) // Un usuario solo puede tener un registro por vídeo
}

// 📬 MODELO: Buzón de Feedback
model Feedback {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content    String   // Motivo de dislike o comentario al entrenador
  isPrivate  Boolean  @default(true)
  isResolved Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

## Paso 2: Middlewares de Seguridad (Onboarding Obligatorio)

Implementar el middleware para interceptar cualquier petición o navegación en la plataforma si el usuario no ha completado el cambio de contraseña.

```typescript
// middleware.ts (Ejemplo en Next.js)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const url = request.nextUrl.clone();

  if (!session) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const user = checkSessionContext(session); // Lógica de decodificación JWT

  // Bloquear rutas a usuarios no-admin que intenten entrar al panel
  if (url.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Guardián del Onboarding: Cambio de contraseña obligatorio
  if (user.isFirstLogin && url.pathname !== '/onboarding/change-password') {
    url.pathname = '/onboarding/change-password';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/cursos/:path*'],
};
```

## Paso 3: Interfaz UI del Portal Administrador (Sleek Minimalist 4)

Los componentes UI deben programarse sobre fondo negro con acentos cian neón.

```tsx
// components/Admin/Layout.tsx
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* Sidebar de Navegación Administrador */}
      <aside className="w-64 fixed h-full border-r border-gray-800 bg-black p-6">
        <h1 className="text-2xl font-bold mb-10 tracking-widest">
          SYS<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">ADMIN</span>
        </h1>
        <nav className="space-y-4">
          <a href="#users" className="block text-gray-400 hover:text-cyan-400 transition-colors">Usuarios</a>
          <a href="#videos" className="block text-gray-400 hover:text-cyan-400 transition-colors">Contenido VOD</a>
          <a href="#feedback" className="block text-gray-400 hover:text-cyan-400 transition-colors">Buzón de Feedback</a>
        </nav>
      </aside>
      
      {/* Contenido Dinámico */}
      <main className="ml-64 p-10">
        {children}
      </main>
    </div>
  );
}

// components/Admin/DashboardStats.tsx
// Ejemplo de Tarjeta de Estadística Sleek
export function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="p-6 bg-black border border-gray-800 rounded-lg hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
      <h3 className="text-sm text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-light text-white mt-2">{value}</p>
    </div>
  );
}
```
