// =========================
// SERVICE WORKER SEMPLICE E STABILE
// =========================

// Nome della cache
const CACHE_NAME = "pwa-cache-v2"; // version bump

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/index.html?v=" + Date.now(),
        "/style.css?v=" + Date.now(),
        "/app.js?v=" + Date.now(),
        "/manifest.json"
      ]);
    })
  );
});

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting(); // forza aggiornamento immediato
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // elimina cache vecchia
          }
        })
      )
    )
  );
  self.clients.claim(); // aggiorna subito tutte le schede aperte
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // aggiorna cache con file nuovi
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
