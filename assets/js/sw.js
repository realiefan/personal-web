const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V0.4";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const offlineFallbackPage = "/offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        offlineFallbackPage,
        "/",
        "/index.html",
        "/app.css",
        "/assets/js/lists.js",
        "/assets/js/buttons.js",
        "/assets/js/search.js",
        "/assets/pages/control/control.js",
        "/assets/pages/control/control.html",
        "/assets/pages/control/control.css",
        "/assets/pages/wallet/wallet.html",
        "/assets/pages/wallet/wallet.css",
        "/assets/pages/wallet/wallet.js",
      ]);
    })
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);

          // Cache HTML, CSS, and JS files
          if (
            event.request.url.endsWith(".html") ||
            event.request.url.endsWith(".css") ||
            event.request.url.endsWith(".js")
          ) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResp.clone());
          }

          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});

// Cache Management
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache.startsWith(CACHE_PREFIX) && cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
