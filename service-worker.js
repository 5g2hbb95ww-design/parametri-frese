const CACHE_NAME = "parametri-frese-v4";
const FILES_TO_CACHE = [
  "/parametri-frese/",
  "/parametri-frese/index.html",
  "/parametri-frese/style.css",
  "/parametri-frese/app.js",
  "/parametri-frese/manifest.json",
  "/parametri-frese/icons/icon-192.png",
  "/parametri-frese/icons/icon-512.png",
  "/parametri-frese/icons/screen-wide.png",
  "/parametri-frese/icons/screen-mobile.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

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
