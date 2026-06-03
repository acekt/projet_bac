import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('mcf_user_session')?.value;
  const { pathname } = request.nextUrl;

  const PROTECTED_ROUTES = [
    '/profile',
    '/checkout',
    '/favorites',
    '/admin',
    '/orders',
    '/cart',
    '/store',
    '/product',
    '/search'
  ];
  const ADMIN_ROUTES = ['/admin'];

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && user) {
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/favorites/:path*',
    '/admin/:path*',
    '/orders/:path*',
    '/cart/:path*',
    '/store/:path*',
    '/product/:path*',
    '/search/:path*'
  ],
};
