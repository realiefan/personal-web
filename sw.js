importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.routing.registerRoute(
  /\.(css|js|png|jpg|jpeg|gif|svg|ico)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'NostrNet-static-assets',
  })
);

// Add a new route for the Icon Horse API
workbox.routing.registerRoute(
  /https:\/\/icon\.horse\/icon\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'icon-cache',
  })
);

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '123456' },
  // Add other assets you want to precache
]);

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('NostrNet') && cacheName !== 'NostrNet-static-assets' && cacheName !== 'IconHorse-api') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

