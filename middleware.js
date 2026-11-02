import { NextResponse } from 'next/server';

export function middleware(req) {
  const p = req.nextUrl.pathname;
  // Clean routing for staff & admin console
  if (p === '/staff-portal' || p === '/admin') {
    const u = new URL('/hidden-admin', req.url);
    u.search = req.nextUrl.search;
    return NextResponse.rewrite(u);
  }
}

export const config = { matcher: ['/((?!_next|images|img|favicon.ico).*)'] };

