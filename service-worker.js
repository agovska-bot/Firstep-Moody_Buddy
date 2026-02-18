const CACHE_NAME = 'moody-buddy-plus-v3';

// Install event: Simply skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: The core logic for PWA
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy 1: For HTML pages (Navigation) -> Network First, fall back to Cache
  // This ensures users always get the latest version from Vercel if online.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy 2: For Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  // Use cache for speed, but update in background.
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|json|woff2)$/) ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Only cache valid responses
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => console.log('Network fetch failed for asset, using cache only', err));

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
});