// =========================
// SERVICE WORKER STABILE
// =========================

// Incrementa la versione quando aggiorni app.js
const CACHE_NAME = "pwa-cache-v3";

// File da mettere in cache
const FILES_TO_CACHE = [
  "/index.html?v=" + Date.now(),
  "/style.css?v=" + Date.now(),
  "/app.js?v=" + Date.now(),
  "/manifest.json"
];

// Installazione SW
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Attivazione SW (cancella cache vecchie)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Gestione fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Se esiste in cache → usa cache
      if (cached) return cached;

      // Altrimenti scarica e salva in cache
      return fetch(event.request).then(response => {
        // Salva solo file del dominio
        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});
