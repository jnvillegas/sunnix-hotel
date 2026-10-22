import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user } = await updateSession(request);

  const isDemo = request.cookies.get('sunnix_demo_session')?.value === 'true';
  const isAuthenticated = !!user || isDemo;

  const isAuthRoute = pathname.startsWith('/login');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isCajaRoute = pathname.startsWith('/caja');

  // Si no está autenticado e intenta acceder a rutas protegidas
  if (!isAuthenticated && (isDashboardRoute || isCajaRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si ya está autenticado e intenta ir al login, redirigir al dashboard
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
