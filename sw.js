importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V5";
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

// Cleanup old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([workbox.cacheNames.cleanupSome({ prefix: CACHE_PREFIX }), scheduleNotifications()])
  );
});

// Cache static files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(/\.(html|js|css|svg|png|jpg|jpeg|gif)$/, new workbox.strategies.StaleWhileRevalidate(cacheSettings));

// Cache images with StaleWhileRevalidate strategy
workbox.routing.registerRoute(/\.(png|jpg|jpeg|gif)$/, new workbox.strategies.StaleWhileRevalidate(cacheSettings));

// Cache icons with StaleWhileRevalidate strategy
workbox.routing.registerRoute(({ url }) => url.pathname.startsWith("https://icon.horse/icon/"), new workbox.strategies.StaleWhileRevalidate(cacheSettings));

// Cache dynamic content with StaleWhileRevalidate strategy and background sync
workbox.routing.registerRoute(/\.(html|js)$/, new workbox.strategies.StaleWhileRevalidate({
  cacheName: CACHE_NAME_DYNAMIC,
  plugins: [
    ...cacheSettings.plugins,
    new workbox.backgroundSync.BackgroundSyncPlugin("bgSyncQueue", {
      maxRetentionTime: 24 * 60, // Retry for up to 24 hours
    }),
  ],
}));

// Cache navigation requests with StaleWhileRevalidate strategy
workbox.routing.registerRoute(({ event }) => event.request.mode === "navigate", new workbox.strategies.StaleWhileRevalidate(cacheSettings));

// Cache everything else with NetworkFirst strategy
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst(cacheSettings));




// Function to show a notification
const showNotification = (title, options) => {
  return self.registration.showNotification(title, options);
};

// Periodic Notifications every 1 minute
const showPeriodicNotification = () => {
  const title = "WebCore Backup Reminder";
  const options = {
    body: "Don't forget to back up your Nostr data regularly for a seamless experience.",
    icon: "/assets/icons/icon.png",
    vibrate: [200, 100, 200], // Vibration pattern
    badge: "/assets/icons/badge.png", // Displayed in the notification bar
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

  // Show the notification
  return showNotification(title, options);
};

// Schedule periodic notifications based on permission status
const scheduleNotifications = () => {
  // Check notification permission
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Permission granted, show initial notification
      self.registration.showNotification("Permission Granted", {
        body: "You've granted notification permission.",
        tag: "notification-permission-granted",
      });

      // Set up the interval for periodic notifications
      setInterval(() => {
        showPeriodicNotification();
      }, 60 * 1000); // Every 1 minute
    } else {
      // Handle case where permission is denied
      console.log('Notification permission denied');
    }
  }).catch(error => {
    // Handle errors during permission request
    console.error('Error requesting notification permission:', error);
  });
};

// Call scheduleNotifications when the service worker is installed
self.addEventListener("install", (event) => {
  event.waitUntil(scheduleNotifications());
});

// Handle notification click to open /list.html or perform backup action
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const openUrl = event.notification.data.openUrl;
  const backupAction = event.action === "backupAction";

  if (backupAction) {
    // Perform backup action if "Backup Now" is clicked
    // Add your backup logic here
  } else if (openUrl) {
    // Open the specified URL on notification click
    event.waitUntil(clients.openWindow(openUrl));
  }
});
