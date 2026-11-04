import { NextResponse } from 'next/server';

export function middleware(req) {
  const p = req.nextUrl.pathname;
  // Redirect legacy /admin to first-class /staff-portal route
  if (p === '/admin') {
    const u = new URL('/staff-portal', req.url);
    u.search = req.nextUrl.search;
    return NextResponse.redirect(u, 307);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|images|img|favicon.ico|manifest.json|sw.js|icon.png|apple-touch-icon.png|_headers|_routes.json).*)'] };
