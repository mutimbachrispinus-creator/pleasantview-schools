import { NextResponse } from 'next/server';

export function middleware(req) {
  const p = req.nextUrl.pathname;
  // Clean routing for staff & admin console
  if (p === '/staff-portal' || p === '/admin') {
    const u = new URL('/hidden-admin', req.url);
    u.search = req.nextUrl.search;
    return NextResponse.rewrite(u);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|images|img|favicon.ico|manifest.json|sw.js|icon.png|apple-touch-icon.png|_headers|_routes.json).*)'] };

