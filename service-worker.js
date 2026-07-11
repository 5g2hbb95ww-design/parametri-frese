// ==========================================
// PARAMETRI FRESE
// Service Worker v1.0
// ==========================================

const CACHE_NAME = "parametri-frese-v1";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];



// ==============================
// INSTALLAZIONE
// ==============================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            console.log("Cache creata");

            return cache.addAll(FILES_TO_CACHE);

        })

    );

    self.skipWaiting();

});



// ==============================
// ATTIVAZIONE
// ==============================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        console.log("Elimino cache:",key);

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});



// ==============================
// FETCH
// ==============================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if(response){

                return response;

            }

            return fetch(event.request)

            .then(networkResponse => {

                return caches.open(CACHE_NAME)

                .then(cache => {

                    cache.put(

                        event.request,

                        networkResponse.clone()

                    );

                    return networkResponse;

                });

            });

        })

        .catch(() => {

            if(event.request.mode==="navigate"){

                return caches.match("./index.html");

            }

        })

    );

});