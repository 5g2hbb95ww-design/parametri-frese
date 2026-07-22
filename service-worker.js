// Nome cache (sempre nuova ad ogni deploy)
const CACHE_NAME = "pwa-cache-v1";

// File da mettere in cache (solo quelli statici)
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/firebase-config.js"
];

// INSTALL — aggiorna subito
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ACTIVATE — elimina TUTTE le cache vecchie
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
        // Aggiorna la cache con la versione nuova
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Se offline → prova dalla cache
        return caches.match(event.request);
      })
  );
});
