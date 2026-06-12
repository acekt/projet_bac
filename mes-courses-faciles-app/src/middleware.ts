import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('mcf_jwt_session')?.value;
  const { pathname, search } = request.nextUrl;

  const PROTECTED_ROUTES = [
    '/profile',
    '/checkout',
    '/favorites',
    '/admin',
    '/orders',
    '/store',
    '/product',
    '/search'
  ];
  const ADMIN_ROUTES = ['/admin'];

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  // Determine callback url with search query preserved
  const callbackUrl = `${pathname}${search}`;

  if (isProtectedRoute && !token) {
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'login');
    url.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(url);
  }

  let decodedToken = null;
  if (token) {
      decodedToken = await verifyJWT(token);
  }

  if (isProtectedRoute && !decodedToken) {
     const url = new URL('/', request.url);
     url.searchParams.set('auth', 'login');
     url.searchParams.set('callbackUrl', callbackUrl);
     
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
    '/store/:path*',
    '/product/:path*',
    '/search/:path*'
  ],
};
