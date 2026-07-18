// ===============================
// SERVICE WORKER ANTI-CACHE DEFINITIVO
// ===============================

// Cambia automaticamente versione ad ogni installazione
const VERSION = Date.now().toString();
const CACHE_NAME = "frese-cache-" + VERSION;

// File da mettere in cache
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./materials.json",
  "./manifest.json"
];

// INSTALL: scarica SEMPRE i file nuovi
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting(); // forza aggiornamento immediato
});

// ACTIVATE: cancella TUTTE le cache vecchie
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // elimina tutto il vecchio
          }
        })
      )
    )
  );
  self.clients.claim(); // attiva subito
});

// FETCH: sempre rete → fallback cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // aggiorna cache con file nuovo
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline fallback
  );
});
