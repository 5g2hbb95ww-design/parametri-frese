// =========================
// SERVICE WORKER STABILE E COMPATIBILE
// =========================

const CACHE_NAME = "pwa-cache-v2"; // version bump

// FILE DA METTERE IN CACHE
const FILES_TO_CACHE = [
  "/index.html?v=" + Date.now(),
  "/style.css?v=" + Date.now(),
  "/app.js?v=" + Date.now(),
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting(); // aggiorna subito
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // elimina cache vecchie
          }
        })
      )
    )
  );
  self.clients.claim(); // attiva subito
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(response => {
          // aggiorna solo file locali (non API, non immagini remote)
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
      );
    })
  );
});
