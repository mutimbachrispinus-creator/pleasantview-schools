import { NextResponse } from 'next/server';
export function middleware(req) {
  const p = req.nextUrl.pathname, a = '/' + (process.env.ADMIN_PATH || 'staff-portal-change-me');
  if (p.startsWith('/hidden-admin')) return new NextResponse('Not found', { status: 404 });
  if (p === a) { const u = new URL('/hidden-admin', req.url); u.search = req.nextUrl.search; return NextResponse.rewrite(u); }
}
export const config = { matcher: ['/((?!_next|img|favicon.ico).*)'] };
