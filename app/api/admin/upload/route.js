import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, q, qWrite, init, normalizeMediaMime, syncPhotoToPictorial } from '@/lib/db';
import { getAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function revalidatePictorial() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/pictorial');
    revalidatePath('/about');
    revalidatePath('/staff-portal', 'page');
  } catch {}
}

export async function POST(req) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: 'Your staff portal session has expired. Please refresh /staff-portal and sign in again.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'single';

    if (mode === 'single') {
      const rawMime = searchParams.get('mime') || req.headers.get('x-media-mime') || '';
      const fileName = searchParams.get('name') || req.headers.get('x-media-name') || '';
      const visualHint = searchParams.get('vh') || '';
      const mime = normalizeMediaMime(rawMime, fileName);

      if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
        return NextResponse.json(
          { ok: false, error: `Unsupported media file format (${fileName || rawMime || 'unknown'}). Please choose an image or MP4/WebM/MOV video.` },
          { status: 400 }
        );
      }

      const arrayBuf = await req.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuf);
      if (!uint8.byteLength) {
        return NextResponse.json({ ok: false, error: 'Empty file uploaded.' }, { status: 400 });
      }
      if (uint8.byteLength > 2 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: 'Payload exceeds single-chunk threshold; use chunked mode.' }, { status: 413 });
      }

      const res = await qWrite(
        'INSERT INTO images(mime, data, is_chunked, total_size, chunk_size, total_chunks, filename, visual_hint) VALUES(?, ?, 0, ?, ?, 1, ?, ?)',
        [mime, uint8, uint8.byteLength, uint8.byteLength, fileName, visualHint]
      );
      let id = res?.lastInsertRowid != null ? Number(res.lastInsertRowid) : null;
      if (!id) {
        const [maxRow] = await q('SELECT MAX(id) AS id FROM images');
        id = Number(maxRow?.id || 0);
      }

      const url = `/img/${id}`;
      let detectedCategory = '';
      if (mime.startsWith('image/') && uint8.byteLength >= 32) {
        try {
          const title = searchParams.get('title') || '';
          const caption = searchParams.get('cap') || '';
          const sourceCategory = searchParams.get('cat') || '';
          const explicitCategory = searchParams.get('ecat') || '';
          const sectionHint = searchParams.get('sec') || 'upload';
          const schoolId = Number(searchParams.get('sid')) || Number(admin.scope) || 0;

          const syncRes = await syncPhotoToPictorial({
            image: url,
            schoolId,
            explicitCategory,
            fileName,
            title,
            caption,
            sourceCategory,
            sectionHint,
            visualHint,
            isInitialUpload: !title && !caption
          });
          detectedCategory = syncRes?.category || '';
          revalidatePictorial();
        } catch (syncErr) {
          console.warn('[Single Upload Pictorial Sync Notice]:', syncErr?.message);
        }
      }

      return NextResponse.json({
        ok: true,
        id,
        url,
        size: uint8.byteLength,
        category: detectedCategory
      });
    }

    if (mode === 'init') {
      const body = await req.json();
      const fileName = String(body?.fileName || '').trim();
      const visualHint = String(body?.visualHint || '').trim();
      const mime = normalizeMediaMime(body?.mime || '', fileName);
      const totalSize = Number(body?.totalSize || 0);
      const chunkSize = Number(body?.chunkSize || 524288);
      const totalChunks = Number(body?.totalChunks || Math.ceil(totalSize / chunkSize));

      if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
        return NextResponse.json(
          { ok: false, error: `Unsupported media format (${body?.fileName || body?.mime || 'unknown'}).` },
          { status: 400 }
        );
      }
      if (totalSize <= 0 || totalSize > 105 * 1024 * 1024) {
        return NextResponse.json(
          { ok: false, error: 'File size must be between 1 byte and 100 MB.' },
          { status: 400 }
        );
      }
      if (totalChunks <= 0 || totalChunks > 400) {
        return NextResponse.json({ ok: false, error: 'Invalid chunk count.' }, { status: 400 });
      }

      await init();
      const res = await qWrite(
        'INSERT INTO images(mime, data, is_chunked, total_size, chunk_size, total_chunks, filename, visual_hint) VALUES(?, NULL, 1, ?, ?, ?, ?, ?)',
        [mime, totalSize, chunkSize, totalChunks, fileName, visualHint]
      );
      let id = res?.lastInsertRowid != null ? Number(res.lastInsertRowid) : null;
      if (!id) {
        const [maxRow] = await q('SELECT MAX(id) AS id FROM images');
        id = Number(maxRow?.id || 0);
      }

      return NextResponse.json({
        ok: true,
        id,
        url: `/img/${id}`
      });
    }

    if (mode === 'chunk') {
      const id = Number(searchParams.get('id') || 0);
      const index = Number(searchParams.get('index'));
      if (!id || !Number.isInteger(index) || index < 0) {
        return NextResponse.json({ ok: false, error: 'Invalid chunk target id or index.' }, { status: 400 });
      }

      const uint8 = new Uint8Array(await req.arrayBuffer());
      if (!uint8.byteLength) {
        return NextResponse.json({ ok: false, error: 'Empty chunk payload.' }, { status: 400 });
      }

      try {
        await db.execute({
          sql: 'INSERT OR REPLACE INTO media_chunks(media_id, chunk_index, data) VALUES(?, ?, ?)',
          args: [id, index, uint8]
        });
      } catch {
        await qWrite(
          'INSERT OR REPLACE INTO media_chunks(media_id, chunk_index, data) VALUES(?, ?, ?)',
          [id, index, uint8]
        );
      }

      return NextResponse.json({
        ok: true,
        id,
        index,
        bytes: uint8.byteLength
      });
    }

    if (mode === 'complete') {
      const id = Number(searchParams.get('id') || 0);
      if (!id) {
        return NextResponse.json({ ok: false, error: 'Missing media id.' }, { status: 400 });
      }

      const [meta] = await q('SELECT id, mime, filename, visual_hint, total_size, total_chunks FROM images WHERE id=?', [id]);
      if (!meta) {
        return NextResponse.json({ ok: false, error: 'Media record not found.' }, { status: 404 });
      }

      const [stats] = await q(
        'SELECT COUNT(*) AS cnt, COALESCE(SUM(LENGTH(data)), 0) AS stored_bytes FROM media_chunks WHERE media_id=?',
        [id]
      );
      const expectedChunks = Number(meta.total_chunks || 0);
      const expectedSize = Number(meta.total_size || 0);
      const actualChunks = Number(stats?.cnt || 0);
      const actualSize = Number(stats?.stored_bytes || 0);

      if (actualChunks !== expectedChunks || actualSize !== expectedSize) {
        const presentRows = await q('SELECT chunk_index FROM media_chunks WHERE media_id=? ORDER BY chunk_index ASC', [id]);
        const presentSet = new Set(presentRows.map(r => Number(r.chunk_index)));
        const missingChunks = [];
        for (let i = 0; i < expectedChunks; i++) {
          if (!presentSet.has(i)) missingChunks.push(i);
        }
        return NextResponse.json(
          {
            ok: false,
            error: `Upload verification mismatch (${actualChunks}/${expectedChunks} chunks, ${actualSize}/${expectedSize} bytes).`,
            missingChunks
          },
          { status: 409 }
        );
      }

      const url = `/img/${id}`;
      let detectedCategory = '';
      if (String(meta.mime || '').toLowerCase().startsWith('image/') && actualSize >= 32) {
        try {
          const title = searchParams.get('title') || '';
          const caption = searchParams.get('cap') || '';
          const sourceCategory = searchParams.get('cat') || '';
          const explicitCategory = searchParams.get('ecat') || '';
          const sectionHint = searchParams.get('sec') || 'upload';
          const schoolId = Number(searchParams.get('sid')) || Number(admin.scope) || 0;

          const syncRes = await syncPhotoToPictorial({
            image: url,
            schoolId,
            explicitCategory,
            fileName: meta.filename || '',
            title,
            caption,
            sourceCategory,
            sectionHint,
            visualHint: meta.visual_hint || searchParams.get('vh') || '',
            isInitialUpload: !title && !caption
          });
          detectedCategory = syncRes?.category || '';
          revalidatePictorial();
        } catch (syncErr) {
          console.warn('[Chunked Upload Pictorial Sync Notice]:', syncErr?.message);
        }
      }

      return NextResponse.json({
        ok: true,
        verified: true,
        id,
        url,
        size: actualSize,
        category: detectedCategory
      });
    }

    return NextResponse.json({ ok: false, error: `Unknown upload mode: ${mode}` }, { status: 400 });
  } catch (err) {
    console.error('[Admin Media Upload Error]:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Media upload encountered a server error.' },
      { status: 500 }
    );
  }
}
