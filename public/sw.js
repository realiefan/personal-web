importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Constants
const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V7"; // Increment the version when making changes to cache logic
const CACHE_NAME_DYNAMIC = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;

// Register the service worker
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Cache everything with CacheFirst strategy
  workbox.routing.setDefaultHandler(
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME_DYNAMIC,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        }),
      ],
    })
  );

  // Cleanup old caches on activate
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) &&
                cacheName !== CACHE_NAME_DYNAMIC
            )
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  });

  // Periodic Notifications every 1 minute
  function showPeriodicNotification() {
    const title = "WebCore Backup Reminder";
    const options = {
      body: "Don't forget to back up your Nostr data regularly for a seamless experience.",
      icon: "/assets/icons/icon.png",
      vibrate: [200, 100, 200],
      badge: "/assets/icons/badge.png",
      data: { openUrl: "/assets/pages/backup/backup.html" },
      actions: [{ action: "backupAction", title: "Backup Now" }],
    };

    return showNotification(title, options);
  }

  // Show notification
  function showNotification(title, options) {
    return self.registration.showNotification(title, options);
  }

  // Handle notification click to open specified URL or perform backup action
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
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
