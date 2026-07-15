// Versione cache: aumenta il numero ogni volta che aggiorni la PWA
const CACHE_NAME = "parametri-frese-v4";

// File da mettere in cache (basato sulla tua repo reale)
const APP_SHELL = [
  "/parametri-frese/",
  "/parametri-frese/index.html",
  "/parametri-frese/style.css",
  "/parametri-frese/script.js",
  "/parametri-frese/manifest.json",
  "/parametri-frese/icon/icon-192.png",
  "/parametri-frese/icon/icon-512.png"
];

// INSTALL: forza subito l’attivazione del nuovo SW
self.addEventListener("install", event => {
  self.skipWaiting(); // iPhone: obbliga l’aggiornamento immediato
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});

// ACTIVATE: elimina tutte le cache vecchie
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // pulizia totale cache vecchie
          }
        })
      )
    )
  );
  self.clients.claim(); // iPhone: forza l’uso immediato del nuovo SW
});

// FETCH: network-first (iPhone non usa più file vecchi)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response; // sempre la versione più nuova
      })
      .catch(() => {
        return caches.match(event.request); // fallback offline
      })
  );
});
