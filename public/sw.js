
const CACHE_NAME = 'coffelipe-brew-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

const staticAssets = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
  '/lovable-uploads/dc58db2b-85bb-421b-bfd2-4c1634090f2b.png'
];

const dynamicAssets = [
  '/api/recipes',
  '/api/user-recipes',
  '/api/brew-history'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(staticAssets);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Service Worker: Preparing dynamic cache');
        return Promise.resolve();
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle static assets - Cache First strategy
  if (staticAssets.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request);
      })
    );
    return;
  }

  // Handle API requests - Network First strategy
  if (url.pathname.startsWith('/api/') || url.hostname !== location.hostname) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle navigation - Stale While Revalidate strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default strategy - Cache First with Network Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((response) => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'brew-sync') {
    event.waitUntil(syncBrewData());
  }
  
  if (event.tag === 'recipe-sync') {
    event.waitUntil(syncRecipeData());
  }
});

// Enhanced notification handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();
  
  const action = event.action;
  const notification = event.notification;
  
  if (action === 'view') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Hora de preparar seu café!',
    icon: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
    badge: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      {
        action: 'view',
        title: 'Ver Receita',
        icon: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ],
    tag: 'coffee-timer',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'TimerCoffee', options)
  );
});

// Helper functions for background sync
async function syncBrewData() {
  try {
    console.log('Service Worker: Syncing brew data...');
    // Implementar sincronização de dados de preparo
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Error syncing brew data:', error);
    throw error;
  }
}

async function syncRecipeData() {
  try {
    console.log('Service Worker: Syncing recipe data...');
    // Implementar sincronização de dados de receitas
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Error syncing recipe data:', error);
    throw error;
  }
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'coffee-data-sync') {
    event.waitUntil(
      Promise.all([
        syncBrewData(),
        syncRecipeData()
      ])
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
});
