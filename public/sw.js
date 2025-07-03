
const CACHE_NAME = 'coffelipe-brew-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
  '/lovable-uploads/dc58db2b-85bb-421b-bfd2-4c1634090f2b.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if there's already a window/tab open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any offline actions here
      console.log('Background sync triggered')
    );
  }
});

// Handle push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
        badge: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
        vibrate: [200, 100, 200],
        tag: 'coffee-notification'
      })
    );
  }
});
