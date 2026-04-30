// src/middleware.ts
// Runs at the Edge — protects dashboard routes before they render

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = new Set(['/login', '/register', '/forgot-password']);
const API_ROUTES = /^\/api\//;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes and static assets
  if (API_ROUTES.test(pathname) || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Allow public auth pages
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Check for session token in cookies (set by login handler in production)
  // In this demo we rely on client-side Zustand store with localStorage.
  // For production: use an httpOnly cookie set by your auth API route.
  const token = request.cookies.get('nexadmin_session')?.value;

  // Redirect root → dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // In production, uncomment this block to enforce server-side auth:
  // if (!token && !PUBLIC_ROUTES.has(pathname)) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
