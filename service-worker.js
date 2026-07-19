const CACHE_NAME = "pwa-cache-v4";

const FILES_TO_CACHE = [
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json"
];

// Install SW
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Activate SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch handler con fallback su index.html
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) return response;
            // Fallback SPA
            return caches.match("/index.html");
          });
      })
  );
});
