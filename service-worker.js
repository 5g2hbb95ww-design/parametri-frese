const CACHE_NAME = "parametri-frese-v3";   // cambia versione quando aggiorni
const FILES_TO_CACHE = [
  "/parametri-frese/",
  "/parametri-frese/index.html",
  "/parametri-frese/style.css",
  "/parametri-frese/app.js",
  "/parametri-frese/manifest.json",
  "/parametri-frese/icons/icon-192.png",
  "/parametri-frese/icons/icon-512.png"
];

// Install SW → cache dei file statici
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // attiva subito
});

// Attivazione → elimina vecchie versioni
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
  self.clients.claim(); // prende controllo immediato
});

// Fetch → offline mode
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/parametri-frese/index.html")
        )
      );
    })
  );
});
