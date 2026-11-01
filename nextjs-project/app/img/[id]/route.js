import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET(_, { params }) {
  const [r] = await q('SELECT mime,data FROM images WHERE id=?', [(await params).id]);
  if (!r) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(r.data), { headers: { 'Content-Type': r.mime, 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
