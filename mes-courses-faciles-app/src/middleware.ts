import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('mcf_jwt_session')?.value;
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

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  let decodedToken = null;
  if (token) {
      decodedToken = await verifyJWT(token);
  }

  if (isProtectedRoute && !decodedToken) {
     const url = request.nextUrl.clone();
     url.pathname = '/auth/login';
     url.searchParams.set('callbackUrl', pathname);
     // remove invalid cookie
     const response = NextResponse.redirect(url);
     response.cookies.delete('mcf_jwt_session');
     return response;
  }

  if (isAdminRoute && decodedToken) {
    if (decodedToken.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
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
