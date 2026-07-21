// =========================
// SERVICE WORKER NETWORK-FIRST
// =========================
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

const CACHE_NAME = "pwa-cache-v4";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app-v3.js",
  "/manifest.json"
];

// Network-first strategy
self.addEventListener("fetch", event => {

  // 🔥 NON mettere favicon.ico in cache
  if (event.request.url.endsWith("favicon.ico")) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
