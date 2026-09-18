// MOBİL TAMİRCİM ADMIN - PWA SERVICE WORKER (ADMIN/SW.JS)
const CACHE_NAME = 'mobil-admin-v1';
const STATIC_ASSETS = [
  '/admin/',
  '/admin/index.html',
  '/admin/css/admin.css',
  '/admin/js/admin-app.js',
  '/admin/manifest.json',
  '/admin/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Admin API istekleri daima ağ üzerinden yapılır
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ success: false, offline: true, error: 'Yönetici konsolu çevrimdışı. Bağlantınızı kontrol edin.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Statik dosyalar için Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse || caches.match('/admin/index.html');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
