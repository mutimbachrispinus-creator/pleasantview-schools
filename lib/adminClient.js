'use client';

const CHUNK_SIZE = 512 * 1024; // 512 KB per chunk
const CONCURRENCY = 2;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function optimizeRasterImageIfLarge(file) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return file;
  const mime = String(file.type || '').toLowerCase();
  // Only optimize large standard raster photos (> 1.2 MB); preserve GIF, SVG, AVIF, and small photos verbatim
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mime)) return file;
  if (file.size <= 1.2 * 1024 * 1024) return file;

  return new Promise((resolve) => {
    let objUrl = '';
    try {
      objUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 2048;
          let { naturalWidth: w, naturalHeight: h } = img;
          if (!w || !h) {
            URL.revokeObjectURL(objUrl);
            resolve(file);
            return;
          }
          if (w > maxDim || h > maxDim) {
            const scale = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objUrl);
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const outMime = mime === 'image/png' ? 'image/webp' : 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objUrl);
              if (blob && blob.size > 0 && blob.size < file.size) {
                const ext = outMime === 'image/webp' ? '.webp' : '.jpg';
                const baseName = String(file.name || 'photo').replace(/\.[^.]+$/, '');
                resolve(new File([blob], baseName + ext, { type: outMime }));
              } else {
                resolve(file);
              }
            },
            outMime,
            0.88
          );
        } catch {
          if (objUrl) URL.revokeObjectURL(objUrl);
          resolve(file);
        }
      };
      img.onerror = () => {
        if (objUrl) URL.revokeObjectURL(objUrl);
        resolve(file);
      };
      img.src = objUrl;
    } catch {
      if (objUrl) URL.revokeObjectURL(objUrl);
      resolve(file);
    }
  });
}

async function fetchJsonWithRetry(url, options, maxRetries = 3) {
  let lastErr = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { credentials: 'same-origin', ...options });
      if ([502, 503, 504, 520, 522, 524].includes(res.status) && attempt < maxRetries) {
        await sleep(450 * Math.pow(2, attempt));
        continue;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return data || { ok: false, error: `Server returned status ${res.status}.` };
      }
      return data || { ok: true };
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) {
        await sleep(450 * Math.pow(2, attempt));
        continue;
      }
    }
  }
  return { ok: false, error: lastErr?.message || 'Network connection interrupted. Please check your connection and try again.' };
}

export async function uploadMediaFile(rawFile, { type = 'image', onProgress } = {}) {
  try {
    if (!rawFile || !rawFile.size) {
      return { ok: false, error: 'Selected file is empty.' };
    }

    if (onProgress) onProgress(3);
    const file = type === 'image' ? await optimizeRasterImageIfLarge(rawFile) : rawFile;
    const totalSize = file.size;
    const fileName = file.name || (type === 'video' ? 'video.mp4' : 'photo.jpg');
    const mime = file.type || '';

    // Single request for small files <= 512 KB
    if (totalSize <= CHUNK_SIZE) {
      if (onProgress) onProgress(25);
      const buf = await file.arrayBuffer();
      const singleUrl = `/api/admin/upload?mode=single&mime=${encodeURIComponent(mime)}&name=${encodeURIComponent(fileName)}`;
      const res = await fetchJsonWithRetry(
        singleUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: buf
        },
        3
      );
      if (!res?.ok || !res?.url) {
        return { ok: false, error: res?.error || 'Failed to upload file.' };
      }
      if (onProgress) onProgress(100);
      return { ok: true, id: res.id, url: res.url, size: totalSize };
    }

    // Multi-chunk upload for larger photos and videos (up to 100 MB)
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
    const initRes = await fetchJsonWithRetry(
      '/api/admin/upload?mode=init',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mime,
          fileName,
          totalSize,
          chunkSize: CHUNK_SIZE,
          totalChunks
        })
      },
      3
    );

    if (!initRes?.ok || !initRes?.id) {
      return { ok: false, error: initRes?.error || 'Could not initialize media upload.' };
    }

    const mediaId = initRes.id;
    let uploadedChunksCount = 0;

    const uploadOneChunk = async (chunkIdx) => {
      const start = chunkIdx * CHUNK_SIZE;
      const end = Math.min(totalSize, start + CHUNK_SIZE);
      const sliceBuf = await file.slice(start, end).arrayBuffer();
      const chunkRes = await fetchJsonWithRetry(
        `/api/admin/upload?mode=chunk&id=${mediaId}&index=${chunkIdx}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: sliceBuf
        },
        4
      );
      if (!chunkRes?.ok) {
        throw new Error(chunkRes?.error || `Failed uploading chunk ${chunkIdx + 1}/${totalChunks}.`);
      }
      uploadedChunksCount += 1;
      if (onProgress) {
        const pct = Math.min(97, Math.max(5, Math.round((uploadedChunksCount / totalChunks) * 96)));
        onProgress(pct);
      }
    };

    const queue = Array.from({ length: totalChunks }, (_, idx) => idx);
    let cursor = 0;
    let workerError = null;

    const workers = Array.from({ length: Math.min(CONCURRENCY, totalChunks) }, async () => {
      while (cursor < queue.length && !workerError) {
        const idx = queue[cursor++];
        try {
          await uploadOneChunk(idx);
        } catch (err) {
          workerError = err;
          break;
        }
      }
    });

    await Promise.all(workers);
    if (workerError) {
      return { ok: false, error: workerError.message || 'Chunk upload failed.' };
    }

    // Verify integrity on Turso DB
    let completeRes = await fetchJsonWithRetry(
      `/api/admin/upload?mode=complete&id=${mediaId}`,
      { method: 'POST' },
      3
    );

    if (!completeRes?.ok && Array.isArray(completeRes?.missingChunks) && completeRes.missingChunks.length > 0) {
      for (const missingIdx of completeRes.missingChunks) {
        await uploadOneChunk(missingIdx);
      }
      completeRes = await fetchJsonWithRetry(
        `/api/admin/upload?mode=complete&id=${mediaId}`,
        { method: 'POST' },
        3
      );
    }

    if (!completeRes?.ok || !completeRes?.url) {
      return { ok: false, error: completeRes?.error || 'Could not verify uploaded media file.' };
    }

    if (onProgress) onProgress(100);
    return {
      ok: true,
      id: mediaId,
      url: completeRes.url,
      size: totalSize
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || 'Unexpected error during media upload.'
    };
  }
}

export async function callAdminAction(action, input = {}) {
  const fields = {};

  if (typeof FormData !== 'undefined' && input instanceof FormData) {
    for (const [k, v] of input.entries()) {
      if (typeof File !== 'undefined' && v instanceof File) continue;
      if (typeof v === 'object' && v !== null && typeof v.arrayBuffer === 'function') continue;
      if (Object.prototype.hasOwnProperty.call(fields, k)) {
        if (Array.isArray(fields[k])) fields[k].push(String(v));
        else fields[k] = [fields[k], String(v)];
      } else {
        fields[k] = String(v);
      }
    }
  } else if (input && typeof input === 'object') {
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined && v !== null) fields[k] = v;
    }
  }

  return await fetchJsonWithRetry(
    `/api/admin/action?action=${encodeURIComponent(action)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action, fields })
    },
    1
  );
}
