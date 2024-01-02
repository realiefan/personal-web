importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const CACHE_PREFIX = "NostrNet";
const CACHE_VERSION = "V0.5";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const { registerRoute, NavigationRoute, setDefaultHandler, setCatchHandler } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;

const offlineFallbackPage = "/offline.html";

// Set up Workbox to use precaching
workbox.precaching.precacheAndRoute([
  offlineFallbackPage,
  "/",
  "/index.html",
  "/app.css",
  "/assets/js/lists.js",
  "/assets/js/buttons.js",
  "/assets/js/search.js",
  "/assets/pages/control/control.js",
  "/assets/pages/control/control.html",
  "/assets/pages/control/control.css",
  "/assets/pages/wallet/wallet.html",
  "/assets/pages/wallet/wallet.css",
  "/assets/pages/wallet/wallet.js",
]);

// Use a stale-while-revalidate strategy for all files
registerRoute(
  new RegExp(".*"),
  new StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

// Navigation routes (fallback to offline.html)
const navigationRoute = new NavigationRoute(
  new StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);
registerRoute(navigationRoute);

// Catch handler for responding with the offline page
setCatchHandler(({ event }) => {
  if (event.request.mode === "navigate") {
    return caches.match(offlineFallbackPage);
  }
  return Response.error();
});

// Default handler for responding with cached resources
setDefaultHandler(
  new StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

// Clean up old caches during activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache.startsWith(CACHE_PREFIX) && cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});
