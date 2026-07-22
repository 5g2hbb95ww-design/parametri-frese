// Nome cache (incrementa la versione quando fai un aggiornamento)
const CACHE_NAME = "pwa-cache-v3";

// File statici da mettere in cache
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/firebase.config.js",
  "/manifest.json"
];

// INSTALL — attiva subito la nuova versione
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ACTIVATE — elimina tutte le cache vecchie
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH — sempre file freschi, fallback offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
