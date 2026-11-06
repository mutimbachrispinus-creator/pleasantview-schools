import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const [r] = await q('SELECT mime, data FROM images WHERE id=?', [id]);
    if (!r || !r.data) return new Response('Not found', { status: 404 });

    const buf = Buffer.from(r.data);
    const total = buf.length;
    const mime = r.mime || 'application/octet-stream';

    // Support HTTP Range requests (crucial for iOS Safari, mobile video seeking & streaming)
    const rangeHeader = req.headers.get('range');
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total || end >= total || start > end) {
        return new Response('Requested Range Not Satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${total}` }
        });
      }

      const chunk = buf.subarray(start, end + 1);
      return new Response(chunk, {
        status: 206,
        headers: {
          'Content-Type': mime,
          'Content-Range': `bytes ${start}-${end}/${total}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunk.length),
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Length': String(total),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    console.error('[Media Route Error]:', err?.message);
    return new Response('Server Error', { status: 500 });
  }
}
