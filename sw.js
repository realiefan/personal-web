importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Constants
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
  plugins: [
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_EXTERNAL_LIBRARIES,
    }),
  ],
};

// Cache settings for API responses
const apiResponsesCacheSettings = {
  cacheName: CACHE_NAME_API_RESPONSES,
  plugins: [
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAME_API_RESPONSES,
    }),
  ],
};

// Cache settings for HTML pages
const htmlPagesCacheSettings = {
  cacheName: CACHE_NAME_PAGES,
  plugins: [
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_PAGES,
      plugins: [
        new workbox.backgroundSync.BackgroundSyncPlugin("bgSyncQueue", {
          maxRetentionTime: 24 * 60, // Retry for up to 24 hours
        }),
      ],
    }),
  ],
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



// Activate event listener
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");

  // Clean up outdated caches using Workbox method
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(CACHE_PREFIX) &&
              key !== CACHE_NAME_STATIC &&
              key !== CACHE_NAME_EXTERNAL_LIBRARIES &&
              key !== CACHE_NAME_API_RESPONSES &&
              key !== CACHE_NAME_PAGES &&
              key !== ICON_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );
    })
  );

  // Claim clients to become active
  return self.clients.claim();
});

// Workbox routing for static assets
workbox.routing.registerRoute(
  /\.(html|css|js|png|jpg|jpeg|gif|svg)$/,
  new workbox.strategies.CacheFirst(staticCacheSettings)
);

// Workbox routing for external libraries
workbox.routing.registerRoute(
  /^https:\/\/cdnjs\.cloudflare\.com\//,
  new workbox.strategies.StaleWhileRevalidate(externalLibrariesCacheSettings)
);

// Workbox routing for API responses
workbox.routing.registerRoute(
  /^https:\/\/api\.example\.com\//,
  new workbox.strategies.NetworkFirst(apiResponsesCacheSettings)
);

// Workbox routing for HTML pages
workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.StaleWhileRevalidate(htmlPagesCacheSettings)
);

// Workbox routing for icons
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://icon.horse/icon/"),
  new workbox.strategies.CacheFirst(iconCacheSettings)
);

// Default handler for other routes
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

// Cleanup outdated caches using Workbox method
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    precaching.cleanupOutdatedCaches();
  }
});
