const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
  "./home.html",
  "./contact.html",
  "./aboutus2.html",
  "./staff.html",
  "./main.js",
  "./aboutus2.css",
  "./staff.css",
  "./normalize.css",
  "./homepage.css",
  "https://placekitten.com/200/200"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(CACHE_NAME => {
      return Promise.all(
        CACHE_NAME.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
