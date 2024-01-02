importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V2";
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const ICON_CACHE_NAME = `${CACHE_PREFIX}-icon-${CACHE_VERSION}`;


// Function to show periodic notifications
function showPeriodicNotification() {
  const title = "Periodic Notification";
  const options = {
    body: "This is a periodic notification for testing.",
    icon: "/path/to/your/icon.png",
  };

  self.registration.showNotification(title, options);
}

// Schedule periodic notifications every 10 seconds
setInterval(() => {
  showPeriodicNotification();
}, 10000);



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

// Cache icons based on their unique URLs
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/icon/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: ICON_CACHE_NAME,
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
    Promise.all([
      cleanupCaches([CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC]),
      cleanupIconCache(),
    ])
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
            caches.open(ICON_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
        );
      })
    );
  }
});

// Utility function to cleanup old caches
async function cleanupCaches(keepCaches) {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter(
        (cache) => cache.startsWith(CACHE_PREFIX) && !keepCaches.some((keepCache) => cache.includes(keepCache))
      )
      .map((cache) => caches.delete(cache))
  );
}

// Utility function to cleanup old icon cache entries
async function cleanupIconCache() {
  const iconCache = await caches.open(ICON_CACHE_NAME);
  const requests = await iconCache.keys();
  const uniqueURLs = new Set(requests.map((request) => request.url));
  return Promise.all(
    requests
      .filter((request) => !uniqueURLs.has(request.url))
      .map((request) => iconCache.delete(request))
  );
}
