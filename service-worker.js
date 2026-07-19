// =========================
// SERVICE WORKER STABILE
// =========================

const CACHE_NAME = "pwa-cache-v2";

const FILES_TO_CACHE = [
  "/index.html?v=" + Date.now(),
  "/style.css?v=" + Date.now(),
  "/app.js?v=" + Date.now(),
  "/manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(response => {
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache =>
              cache.put(event.request, response.clone())
            );
          }
          return response;
        })
      );
    })
  );
});
