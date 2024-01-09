importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// Cache your HTML pages using a cache-first strategy with versioning
workbox.routing.registerRoute(
  /\.(html)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'NostrNet-html-pages-v1', // Update the cache name with versioning
  })
);

workbox.routing.registerRoute(
  /\.(css|js|png|jpg|jpeg|gif|svg|ico)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'NostrNet-static-assets-v1', // Update the cache name with versioning
  })
);

workbox.routing.registerRoute(
  /https:\/\/icon\.horse\/icon\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'IconHorse-api-v1', // Update the cache name with versioning
  })
);

workbox.precaching.precacheAndRoute([
  // Precache your HTML pages with versioning
  { url: '/index.html', revision: 'v1' },
  { url: '/assets/pages/wallet/wallet.html', revision: 'v1' },
  { url: '/assets/pages/backup/backup.html', revision: 'v1' },
  { url: '/assets/pages/control/control.html', revision: 'v1' },
  // Update revision numbers for other assets
]);

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('NostrNet') && !cacheName.includes('v1.1')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Your fetchIcon function remains unchanged
function fetchIcon(url) {
  const urlWithoutProtocol = url.replace(/^https?:\/\//, "");
  const iconURL = `https://icon.horse/icon/${urlWithoutProtocol}`;
  return Promise.resolve(iconURL);
}
