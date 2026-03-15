---
description: Sistema de Acceso y Onboarding (Gatekeeper)
---

# 🔐 Workflow: Sistema de Acceso y Onboarding "Gatekeeper"

**Objetivo:** Garantizar que el 100% de los usuarios sigan el protocolo estricto de seguridad, verificando su identidad y completando su perfil antes de poder acceder al contenido privado de los cursos de nutrición y fitness.

---

## Paso 1: Creación del Usuario y Notificación (Panel Admin)

1. **Acción del Administrador:** Desde el Portal de Administrador, se crea un nuevo registro ingresando únicamente: `Nombre`, `Email` y `Teléfono`.
2. **Lógica Interna del Servidor:**
   - Se genera una contraseña aleatoria temporal y segura.
   - En la Base de Datos, se establecen por defecto los guardianes: `isFirstLogin: true` y `isProfileComplete: false`.
3. **Notificación Automática:** Se ejecuta un servicio (ej. API de Resend/SendGrid) que envía un correo de bienvenida al alumno con el enlace de la plataforma y sus credenciales temporales.

```typescript
// Ejemplo de lógica en el controlador de creación de usuario (Backend)
import { generateRandomPassword, hashPassword, sendWelcomeEmail } from '@/lib/utils';
import prisma from '@/lib/prisma';

export async function createUser(data: { name: string, email: string, phone: string }) {
  const tempPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(tempPassword);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      isFirstLogin: true,         // Bloqueo 1 activado
      isProfileComplete: false,   // Bloqueo 2 activado
    }
  });

  await sendWelcomeEmail(newUser.email, tempPassword);
  return newUser;
}
```

---

## Paso 2: Primer Login y Cambio Obligatorio de Seguridad

1. **Validación de Sesión Inicial:** El usuario recibe el correo y hace login con su contraseña temporal.
2. **Intervención de Seguridad:** El Middleware detecta la sesión activa pero lee el flag `isFirstLogin === true`. Inmediatamente bloquea cualquier intento de explorar la web y fuerza la redirección a `/onboarding/cambiar-password`.
3. **Actualización:** El usuario introduce su nueva clave. El sistema la encripta, actualiza el registro en la DB seteando `isFirstLogin = false` y avanza al siguiente paso.

---

## Paso 3: Completado de Perfil Obligatorio

1. **Bloqueo Restante:** Finalizado el paso anterior, el Middleware permite avanzar, pero se encuentra con el flag `isProfileComplete === false`. El sistema bloquea las rutas de contenido y redirige obligatoriamente a `/onboarding/completar-perfil`.
2. **Requisitos de la UI de Perfil:** El usuario está forzado a proporcionar la siguiente información antes de continuar:
   - Subir una Foto de Perfil válida.
   - Confirmar o editar: Nombre, Apellidos, Correo electrónico y Teléfono.
3. **Activación y Acceso Total:** Al guardar exitosamente, la DB actualiza `isProfileComplete = true`. Recién en este instante, el sistema de ruteo libera los candados y otorga acceso integro a `/cursos-nutricion` y `/cursos-fitness`.

```typescript
// middleware.ts actualizado con el "Gatekeeper"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('app_session');
  
  // 1. Si no hay sesión, bloquear todo excepto login
  if (!session && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session) {
    const user = decodeToken(session.value);
    
    // 2. Guardián 1: Cambio de Contraseña Inicial
    if (user.isFirstLogin && pathname !== '/onboarding/cambiar-password') {
      return NextResponse.redirect(new URL('/onboarding/cambiar-password', req.url));
    }
    
    // 3. Guardián 2: Perfil Incompleto
    if (!user.isFirstLogin && !user.isProfileComplete && pathname !== '/onboarding/completar-perfil') {
      return NextResponse.redirect(new URL('/onboarding/completar-perfil', req.url));
    }
    
    // 4. Protección del Área de Cursos (Redundancia)
    if (pathname.startsWith('/cursos-') && (!user.isProfileComplete || user.isFirstLogin)) {
      return NextResponse.redirect(new URL('/onboarding/completar-perfil', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Aplicar a todas las rutas UI
};
```
