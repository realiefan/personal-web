// Import the Workbox library
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// Set up Workbox with stale-while-revalidate strategy for static assets
workbox.routing.registerRoute(
  /\.(css|js|png|jpg|jpeg|gif|svg|ico)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'NostrNet-static-assets',
  })
);

// Precache specific assets during installation
workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '123456' },
  // Add other assets you want to precache
]);

// Delete all previous caches during activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('NostrNet') && cacheName !== 'NostrNet-static-assets') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
