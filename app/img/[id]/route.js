import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

const MAX_RANGE_WINDOW = 2 * 1024 * 1024; // 2 MB per HTTP 206 Range slice

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const [r] = await q(
      'SELECT mime, data, is_chunked, total_size, chunk_size, total_chunks FROM images WHERE id=?',
      [id]
    );
    if (!r) return new Response('Not found', { status: 404 });

    const mime = r.mime || 'application/octet-stream';
    const rangeHeader = req.headers.get('range');

    // 1. Chunked Media (Large Photos & Direct MP4/WebM/MOV Videos)
    if (Number(r.is_chunked) === 1) {
      const total = Number(r.total_size) || 0;
      const chunkSize = Number(r.chunk_size) || 524288;
      const totalChunks = Number(r.total_chunks) || Math.ceil(total / chunkSize);
      if (total <= 0) return new Response('Not found', { status: 404 });

      if (rangeHeader && rangeHeader.startsWith('bytes=')) {
        const spec = rangeHeader.replace(/bytes=/, '').split(',')[0].trim();
        const parts = spec.split('-');
        let start = 0;
        let end = total - 1;

        if (parts[0] === '' && parts[1]) {
          // Suffix byte range: bytes=-N
          const suffixLen = parseInt(parts[1], 10) || 0;
          start = Math.max(0, total - Math.min(suffixLen, MAX_RANGE_WINDOW));
          end = total - 1;
        } else {
          start = parseInt(parts[0], 10) || 0;
          const requestedEnd = parts[1]
            ? parseInt(parts[1], 10)
            : Math.min(total - 1, start + MAX_RANGE_WINDOW - 1);
          end = Math.min(total - 1, requestedEnd, start + MAX_RANGE_WINDOW - 1);
        }

        if (start < 0 || start >= total || end >= total || start > end) {
          return new Response('Requested Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${total}` }
          });
        }

        const firstChunk = Math.floor(start / chunkSize);
        const lastChunk = Math.floor(end / chunkSize);
        const rows = await q(
          'SELECT chunk_index, data FROM media_chunks WHERE media_id=? AND chunk_index >= ? AND chunk_index <= ? ORDER BY chunk_index ASC',
          [id, firstChunk, lastChunk]
        );
        if (!rows.length) return new Response('Not found', { status: 404 });

        const combined = Buffer.concat(rows.map(row => Buffer.from(row.data)));
        const offsetInFirst = start - firstChunk * chunkSize;
        const sliceLen = Math.min(combined.length - offsetInFirst, end - start + 1);
        if (sliceLen <= 0) return new Response('Not found', { status: 404 });

        const chunkBuf = combined.subarray(offsetInFirst, offsetInFirst + sliceLen);
        const actualEnd = start + chunkBuf.length - 1;

        return new Response(chunkBuf, {
          status: 206,
          headers: {
            'Content-Type': mime,
            'Content-Range': `bytes ${start}-${actualEnd}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunkBuf.length),
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }

      // Full stream without Range header (pulls 2 chunks = 1 MB at a time to keep Worker RAM tiny)
      let nextChunkIdx = 0;
      const stream = new ReadableStream({
        async pull(controller) {
          try {
            if (nextChunkIdx >= totalChunks) {
              controller.close();
              return;
            }
            const batchEnd = Math.min(totalChunks - 1, nextChunkIdx + 1);
            const rows = await q(
              'SELECT chunk_index, data FROM media_chunks WHERE media_id=? AND chunk_index >= ? AND chunk_index <= ? ORDER BY chunk_index ASC',
              [id, nextChunkIdx, batchEnd]
            );
            if (!rows.length) {
              controller.close();
              return;
            }
            for (const row of rows) {
              controller.enqueue(new Uint8Array(Buffer.from(row.data)));
            }
            nextChunkIdx = batchEnd + 1;
          } catch (streamErr) {
            controller.error(streamErr);
          }
        }
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Content-Length': String(total),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // 2. Single-row Media (<= 512 KB & Legacy Rows)
    if (!r.data) return new Response('Not found', { status: 404 });

    const buf = Buffer.from(r.data);
    const total = buf.length;

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? Math.min(total - 1, parseInt(parts[1], 10)) : total - 1;

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
