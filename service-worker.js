const CACHE_NAME = 'pwa-cache-v1';

// Install: aggiorna subito
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: pulizia totale cache + reset SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: niente cache, sempre file freschi
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
