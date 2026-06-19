import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin routes that require authentication
const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/banners',
  '/admin/offers',
  '/admin/categories',
  '/admin/brands',
  '/admin/daily-deals',
  '/admin/orders',
  '/admin/inquiries',
  '/admin/reviews',
  '/admin/settings',
  '/admin/analytics',
  '/admin/import',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if requesting an admin route (excluding login page)
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isAdminLogin = pathname === '/admin/login';

  if (isAdminRoute && !isAdminLogin) {
    // Check for Firebase Auth cookie/session
    // Firebase Auth uses IndexedDB on client, but we can check for the auth persistence cookie
    const hasAuthCookie = request.cookies.has('__firebase_auth_persist') ||
      request.cookies.has('firebase-auth-token') ||
      request.cookies.has('__session');

    // Also check for the firebase auth persistence in localStorage
    // Since middleware can't access localStorage, we add a marker cookie on login
    const hasAuthMarker = request.cookies.has('__admin_auth');

    if (!hasAuthCookie && !hasAuthMarker) {
      // No auth indicator found - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Security headers are already set in next.config.ts headers()
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run middleware on admin routes
    '/admin/:path*',
  ],
};
