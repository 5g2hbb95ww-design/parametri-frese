// ===============================
// VERSIONING AUTOMATICO
// ===============================
const CACHE_VERSION = new Date().toISOString().slice(0, 10);
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

console.log("[SW] Versione cache:", CACHE_NAME);

// ===============================
// FILE STATICI (senza "/")
// ===============================
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "firebase.config.js",
  "manifest.json"
];

// ===============================
// INSTALL
// ===============================
self.addEventListener("install", (event) => {
  console.log("[SW] Install — scarico nuovi file…");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS) {
        try {
          console.log("[SW] Caching:", asset);
          await cache.add(asset);
        } catch (err) {
          console.warn("[SW] Errore cache asset:", asset, err);
        }
      }
    })
  );
});

// ===============================
// ACTIVATE
// ===============================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate — pulizia cache vecchie…");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Eliminazione cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// ===============================
// FETCH
// ===============================
self.addEventListener("fetch", (event) => {

  // NON mettere in cache richieste POST, PUT, DELETE, ecc.
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se esiste in cache → restituisci subito
      if (cachedResponse) {
        return cachedResponse;
      }

      // Altrimenti fai fetch e metti in cache
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});


// ===============================
// AUTO‑RELOAD
// ===============================
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("install", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION" });
    });
  });
});
