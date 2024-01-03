importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V3.4.11";
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const ICON_CACHE_NAME = `${CACHE_PREFIX}-icon-${CACHE_VERSION}`;

// Function to show periodic notifications
function showPeriodicNotification() {
  const title = "Weekly NostrNet Backup Reminder";
  const options = {
    body: "Click here to backup all your Nostr data.",
    icon: "/assets/icons/icon.png",
  };

  self.registration.showNotification(title, options);
}

// Schedule periodic notifications every 10 minutes (600000 milliseconds)
setInterval(() => {
  showPeriodicNotification();
}, 600000); // 600000 milliseconds = 10 minutes

self.addEventListener("notificationclick", (event) => {
  console.log("Notification Clicked");
  event.notification.close();

  const path = "/assets/pages/backup/backup.html";

  event.waitUntil(
    clients.openWindow(path)
  );
});

// Cache static files (HTML, CSS, JS, SVG, PNG) with CacheFirst strategy
workbox.routing.registerRoute(
  /\.(html|js|css|svg|png)$/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
        headers: { 'Cache-Control': 'public, max-age=31536000' }, // Cache for 1 year
      }),
    ],
  })
);

// Cache dynamic content (HTML) with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_DYNAMIC,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
        headers: { 'Cache-Control': 'public, max-age=600' }, // Cache for 10 minutes
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
      }),
    ],
  })
);

// Cache images using the CacheFirst strategy
workbox.routing.registerRoute(
  /\.(png|jpg|jpeg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}-images`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Cache icons based on their unique URLs with CacheFirst strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://icon.horse/icon/"),
  new workbox.strategies.CacheFirst({
    cacheName: ICON_CACHE_NAME,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Background sync to update the cache for dynamic content
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('bgSyncQueue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
});

workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_DYNAMIC,
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

// Cache navigation requests using NetworkFirst strategy
workbox.routing.registerRoute(
  ({ event }) => event.request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
      }),
    ],
  })
);

// Cache everything else using NetworkFirst strategy
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName.startsWith(CACHE_PREFIX) &&
            cacheName !== CACHE_NAME_STATIC &&
            cacheName !== CACHE_NAME_DYNAMIC &&
            cacheName !== ICON_CACHE_NAME
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
