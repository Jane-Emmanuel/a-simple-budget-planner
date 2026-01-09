const CACHE_NAME = "budget-planner-v2"; // bump version when you edit files

const OFFLINE_URLS = [
  ".",               // root (GitHub Pages safe)
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./screenshot-1.png",
  "./screenshot-2.png"
];

// Install: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, then network
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
