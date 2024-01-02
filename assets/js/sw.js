importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V0.9";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

workbox.routing.registerRoute(
  /\.(html|js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache.startsWith(CACHE_PREFIX) && cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
