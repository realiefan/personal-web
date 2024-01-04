importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V3.4.17";
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const ICON_CACHE_NAME = `${CACHE_PREFIX}-icon-${CACHE_VERSION}`;

// Function to handle cache cleanup on activate
const cleanupOldCaches = async () => {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (
        cacheName.startsWith(CACHE_PREFIX) &&
        ![CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, ICON_CACHE_NAME].includes(
          cacheName
        )
      ) {
        return caches.delete(cacheName);
      }
    })
  );
};

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([cleanupOldCaches(), scheduleNotifications()]));
});

// Cache static files (HTML, JS, CSS, SVG, PNG) with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.(html|js|css|svg|png|jpg|jpeg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
        headers: { "Cache-Control": "public, max-age=31536000" }, // Cache for 1 year
      }),
    ],
  })
);

// Cache images using the StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.(png|jpg|jpeg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_PREFIX}-images`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Cache icons based on their unique URLs with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://icon.horse/icon/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: ICON_CACHE_NAME,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Background sync to update the cache for dynamic content
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  "bgSyncQueue",
  {
    maxRetentionTime: 24 * 60, // Retry for up to 24 hours
  }
);

// Cache dynamic content (HTML, JS) with StaleWhileRevalidate strategy and background sync
workbox.routing.registerRoute(
  /\.(html|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_DYNAMIC,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
        headers: { "Cache-Control": "public, max-age=600" }, // Cache for 10 minutes
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Adjust as needed
      }),
      bgSyncPlugin,
    ],
  })
);

// Cache navigation requests using StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  ({ event }) => event.request.mode === "navigate",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_STATIC,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Adjust as needed
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
        maxEntries: 50, // Adjust as needed
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);



// Periodic Notifications every 1 minute
const showPeriodicNotification = async () => {
  const title = "WebCore Backup Reminder";
  const options = {
    body: "Click here to backup your nostr data",
    icon: "/assets/icons/icon.png", // Replace with the correct path
  };

  // Use Workbox background sync to ensure reliability
  await bgSyncPlugin._saveNotification({ title, options });

  // Display the notification
  self.registration.showNotification(title, options);
};

// Schedule periodic notifications
const scheduleNotifications = () => {
  setInterval(showPeriodicNotification, 60 * 1000); // Every 1 minute
};

// Handle notification click to open /list.html
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Open /list.html when notification is clicked
  const openListPage = clients.openWindow("/assets/pages/backup/backup.html");

  event.waitUntil(openListPage);
});
