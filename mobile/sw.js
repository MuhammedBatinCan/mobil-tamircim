// MOBİL TAMİRCİM - PWA SERVICE WORKER (SW.JS - MOBİL UYGULAMA)
const CACHE_NAME = 'mobil-tamircim-mobile-v3';
const STATIC_ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/css/style.css',
  '/app/js/data.js',
  '/app/js/forum.js',
  '/app/js/ai-assistant.js',
  '/app/js/app.js',
  '/app/manifest.json',
  '/icons/icon.svg'
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

  // API istekleri daima ağ üzerinden yapılır (çevrimdışıysa yakalanır)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ success: false, offline: true, error: 'Şu anda çevrimdışısınız. Bağlantınızı kontrol edin.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Statik dosyalar için Stale-While-Revalidate stratejisi
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
        // Ağ yoksa ve cache'de varsa cache döner, yoksa index.html
        return cachedResponse || caches.match('/index.html');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
