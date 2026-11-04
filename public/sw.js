const CACHE_NAME = 'pleasantview-v3';
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/icon.png',
  '/images/pwa_icon_192.png',
  '/images/pwa_icon_512.png',
  '/images/pvs_crest.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Bypass API routes, non-http, and navigation requests (always fresh HTML)
  if (
    url.pathname.startsWith('/api/') ||
    !url.protocol.startsWith('http') ||
    event.request.mode === 'navigate'
  ) {
    return;
  }

  // Network first for static assets, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          (url.pathname.startsWith('/images/') || url.pathname.startsWith('/_next/static/'))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
