importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V9.1";
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_EXTERNAL_LIBRARIES = `${CACHE_PREFIX}-external-libraries-${CACHE_VERSION}`;
const CACHE_NAME_API_RESPONSES = `${CACHE_PREFIX}-api-responses-${CACHE_VERSION}`;
const CACHE_NAME_PAGES = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;
const ICON_CACHE_NAME = `${CACHE_PREFIX}-icon-${CACHE_VERSION}`;

// Cache settings for static assets
const staticCacheSettings = {
  cacheName: CACHE_NAME_STATIC,
  plugins: [
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
    }),
  ],
};

// Cache settings for external libraries
const externalLibrariesCacheSettings = {
  cacheName: CACHE_NAME_EXTERNAL_LIBRARIES,
  plugins: [new workbox.strategies.StaleWhileRevalidate()],
};

// Cache settings for API responses
const apiResponsesCacheSettings = {
  cacheName: CACHE_NAME_API_RESPONSES,
  plugins: [new workbox.strategies.NetworkFirst()],
};

// Cache settings for HTML pages
const htmlPagesCacheSettings = {
  cacheName: CACHE_NAME_PAGES,
  plugins: [new workbox.strategies.StaleWhileRevalidate()],
};

// Cache settings for icons
const iconCacheSettings = {
  cacheName: ICON_CACHE_NAME,
  plugins: [
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 20,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
    }),
  ],
};

const cleanupOutdatedCaches = () =>
  caches
    .keys()
    .then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(CACHE_PREFIX) &&
              ![
                CACHE_NAME_STATIC,
                CACHE_NAME_EXTERNAL_LIBRARIES,
                CACHE_NAME_API_RESPONSES,
                CACHE_NAME_PAGES,
                ICON_CACHE_NAME,
              ].includes(key)
          )
          .map((key) => caches.delete(key))
      )
    );

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(cleanupOutdatedCaches());
  return self.clients.claim();
});

workbox.routing.registerRoute(
  /\.(html|css|js|png|jpg|jpeg|gif|svg)$/,
  new workbox.strategies.CacheFirst(staticCacheSettings)
);
workbox.routing.registerRoute(
  /^https:\/\/cdnjs\.cloudflare\.com\//,
  new workbox.strategies.StaleWhileRevalidate(externalLibrariesCacheSettings)
);
workbox.routing.registerRoute(
  /^https:\/\/api\.example\.com\//,
  new workbox.strategies.NetworkFirst(apiResponsesCacheSettings)
);
workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.StaleWhileRevalidate(htmlPagesCacheSettings)
);
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://icon.horse/icon/"),
  new workbox.strategies.CacheFirst(iconCacheSettings)
);

workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    cleanupOutdatedCaches();
  }
});
