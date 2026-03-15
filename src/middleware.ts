import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

// Rutas estrictamente públicas (Excepciones)
const publicRoutes = ['/login', '/api/seed', '/', '/forgot-password'];
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Ignorar assets estáticos y API interna
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  const user = await decrypt(session);

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // 2. Bloqueo a invitados
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Redirección si usuario logueado va a login or home public
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Si estamos en una ruta de validación pública y hay usuario, pasamos a procesar.
  // Si no hay usuario y es pública, todo ok.
  if(!user) return NextResponse.next();

  // -------------------------------------------------------------
  // SISTEMA GATEKEEPER - REGLAS DE ONBOARDING OBLIGATORIO
  // -------------------------------------------------------------

  // Guardián 1: Usuario Admin (Aislamiento de Panel)
  if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Rutas exentas de bloqueos de gatekeeper
  const isPasswordChangeRoute = pathname === '/onboarding/cambiar-password';
  const isProfileCompleteRoute = pathname === '/onboarding/completar-perfil';
  const isApiRoute = pathname.startsWith('/api/');

  if (!isApiRoute) {
    // Guardián 2: Primer Login (Cambio de contraseña FORZADO)
    if (user.isFirstLogin && !isPasswordChangeRoute) {
      if (pathname === '/login') return NextResponse.next(); // no loop
      return NextResponse.redirect(new URL('/onboarding/cambiar-password', request.url));
    }
  
    // Guardián 3: Perfil Incompleto (Completar Datos FORZADO)
    if (!user.isFirstLogin && !user.isProfileComplete && !isProfileCompleteRoute) {
      if (pathname === '/login') return NextResponse.next(); // no loop
      return NextResponse.redirect(new URL('/onboarding/completar-perfil', request.url));
    }
  
    // Protección del Área de Cursos
    if (pathname.startsWith('/cursos') && (!user.isProfileComplete || user.isFirstLogin)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'], // Aplicar a todas las rutas UI
};
