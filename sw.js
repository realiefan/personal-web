importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V1.5"; // Update the cache version when you make changes to the caching logic
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;

// Cache static files (HTML, CSS, JS, SVG, PNG)
workbox.routing.registerRoute(
  /\.(html|js|css|svg|png)$/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAME_STATIC,
  })
);

// Cache dynamic content (HTML) with stale-while-revalidate strategy
workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_DYNAMIC,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Cache images using the cache-first strategy
workbox.routing.registerRoute(
  /\.(png|jpg|jpeg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAME_STATIC,
  })
);

// Cache icons using the cache-first strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/icon/"),
  new workbox.strategies.CacheFirst({
    cacheName: "icon-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache.startsWith(CACHE_PREFIX) && !cache.includes(CACHE_VERSION))
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

// Background sync to update the cache
workbox.routing.registerRoute(
  /\.(html|js|css|svg|png)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_STATIC,
  }),
  "GET"
);

// Enable Navigation Preload
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate" && self.registration.navigationPreload) {
    event.respondWith(
      (async () => {
        const preloadResponse = await event.preloadResponse;

        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      })()
    );
  }
});

// Fetch and cache icons
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("https://icon.horse/icon/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((networkResponse) => {
            caches.open("icon-cache").then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
        );
      })
    );
  }
});
