importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Constants
const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V8";
const CACHE_NAME_STATIC = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const ICON_CACHE_NAME = `${CACHE_PREFIX}-icon-${CACHE_VERSION}`;

const cacheSettings = {
  cacheName: CACHE_NAME_STATIC,
  plugins: [
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
    }),
  ],
};

// Activate event listener
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(CACHE_PREFIX) &&
              key !== CACHE_NAME_STATIC &&
              key !== CACHE_NAME_DYNAMIC &&
              key !== ICON_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );
    })
  );

  // Claim clients to become active
  return self.clients.claim();
});

// Workbox routing
workbox.routing.registerRoute(
  /\.(html|js|css|svg|png|jpg|jpeg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate(cacheSettings)
);

workbox.routing.registerRoute(
  /\.(png|jpg|jpeg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate(cacheSettings)
);
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("https://icon.horse/icon/"),
  new workbox.strategies.CacheFirst({
    cacheName: ICON_CACHE_NAME,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(html|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME_DYNAMIC,
    plugins: [
      ...cacheSettings.plugins,
      new workbox.backgroundSync.BackgroundSyncPlugin("bgSyncQueue", {
        maxRetentionTime: 24 * 60, // Retry for up to 24 hours
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ event }) => event.request.mode === "navigate",
  new workbox.strategies.StaleWhileRevalidate(cacheSettings)
);

workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst(cacheSettings)
);

// Check notification permission and schedule notifications on install
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");

  // Skip waiting to activate the new service worker
  event.waitUntil(self.skipWaiting());
});

// Check notification permission and schedule notifications on activate
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");

  // Claim clients to become active
  event.waitUntil(self.clients.claim());

  // Check notification permission
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    scheduleNotifications();
  } else {
    console.log("Requesting notification permission");
    event.waitUntil(
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
          scheduleNotifications();
        } else {
          console.log("Notification permission denied");
        }
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification Clicked");
  event.notification.close();
  const openUrl = "/assets/pages/backup/backup.html"; // Replace with your desired URL
  if (openUrl) {
    event.waitUntil(clients.openWindow(openUrl));
  }
});

// Inside your showPeriodicNotification function
const showPeriodicNotification = () => {
  console.log("Triggering Notification");

  const title = "WebCore Backup Reminder";
  const options = {
    body: "Don't forget to back up your Nostr data regularly for a seamless experience.",
    icon: "/assets/icons/icon.png",
    vibrate: [200, 100, 200], // Vibration pattern
    badge: "/assets/icons/icon.png", // Displayed in the notification bar
    data: {
      openUrl: "/assets/pages/backup/backup.html", // URL to open on notification click
    },
    actions: [
      {
        action: "backupAction",
        title: "Backup Now",
      },
    ],
  };

  // Show the notification directly without the extra function
  self.registration.showNotification(title, options);
};

// Inside your scheduleNotifications function
const scheduleNotifications = () => {
  console.log("Scheduling Notifications");
  try {
    setInterval(() => {
      showPeriodicNotification();
    }, 10000); // Schedule notifications every 10 seconds (10 * 1000 milliseconds)
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
};
