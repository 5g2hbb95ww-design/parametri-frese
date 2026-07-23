// ===============================
// SERVICE WORKER — VERSIONE 3.0
// ===============================

const CACHE_NAME = "parametri-frese-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./firebase.config.js"
];

// Install SW + cache base files
self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

// Activate SW + delete old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Delete old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch strategy: network first, fallback cache
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Avoid caching Firebase requests
  if (req.url.includes("firestore.googleapis.com")) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});

// ===============================
// AUTO‑UPDATE NOTIFICATION
// ===============================
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    console.log("[SW] Skip waiting requested");
    self.skipWaiting();
  }
});

// Detect new version
self.addEventListener("install", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "NEW_VERSION" });
    });
  });
});
