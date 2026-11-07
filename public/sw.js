const CACHE_NAME = 'pleasantview-v11';
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico?v=20261107b',
  '/icon.png?v=20261107b',
  '/images/pwa_icon_192.png?v=20261107b',
  '/images/pwa_icon_512.png?v=20261107b',
  '/images/pwa_maskable_192.png?v=20261107b',
  '/images/pwa_maskable_512.png?v=20261107b',
  '/images/pvs_crest.png?v=20261107b'
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

  // Bypass API routes, Staff Portal, Admin console, Next.js internal chunks, and page navigation
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/staff-portal') ||
    url.pathname.startsWith('/hidden-admin') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_next/') ||
    !url.protocol.startsWith('http') ||
    event.request.mode === 'navigate'
  ) {
    return;
  }

  // Network-first for logo and crest to ensure never stale
  if (url.pathname.includes('pvs_crest') || url.pathname.includes('logo') || url.pathname.includes('icon')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for general images
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        });
      })
    );
  }
});
