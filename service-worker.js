// ===============================
// VERSIONING AUTOMATICO
// ===============================
const CACHE_VERSION = new Date().toISOString().slice(0, 10);
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

console.log("[SW] Versione cache:", CACHE_NAME);

// ===============================
// FILE STATICI
// ===============================
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/firebase.config.js",
  "/manifest.json"
];

// ===============================
// INSTALL
// ===============================
self.addEventListener("install", (event) => {
  console.log("[SW] Install — scarico nuovi file…");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching assets:", ASSETS);
      return cache.addAll(ASSETS);
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
      console.log("[SW] Cache trovate:", keys);
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
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        console.log("[SW] Fetch OK:", event.request.url);

        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;
      })
      .catch(() => {
        console.warn("[SW] Offline — uso cache:", event.request.url);
        return caches.match(event.request);
      })
  );
});

// ===============================
// AUTO‑RELOAD
// ===============================
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    console.log("[SW] skipWaiting ricevuto — aggiorno subito");
    self.skipWaiting();
  }
});

// Notifica ai client che esiste una nuova versione
self.addEventListener("install", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION" });
    });
  });
});
