
const CACHE_NAME = 'timercoffee-v3.0';
const STATIC_CACHE = 'static-v3.0';
const DYNAMIC_CACHE = 'dynamic-v3.0';

// Cache crítico - apenas o essencial
const staticAssets = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png'
];

// Estratégia de cache inteligente
const cacheStrategies = {
  // Estratégia para assets estáticos
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'CacheFirst'
  },
  // Estratégia para dados dinâmicos
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'NetworkFirst',
    networkTimeoutSeconds: 3
  }
};

// Instalar service worker com cache otimizado
self.addEventListener('install', (event) => {
  console.log('SW: Installing optimized version...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching essential assets only');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('SW: Activating and cleaning old caches...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estratégia de fetch otimizada
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Pular requisições não-GET
  if (request.method !== 'GET') return;

  // Cache-First para recursos estáticos
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-First para APIs com timeout rápido
  if (isApiRequest(url)) {
    event.respondWith(networkFirstFast(request));
    return;
  }

  // Stale-While-Revalidate para navegação
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Cache-First com fallback para outros recursos
  event.respondWith(cacheFirst(request));
});

// Funções helper otimizadas
function isStaticAsset(url) {
  return staticAssets.some(asset => url.pathname.endsWith(asset.split('/').pop()));
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || url.hostname !== location.hostname;
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('SW: Network failed for:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstFast(request) {
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);

    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  });

  return cachedResponse || fetchPromise;
}

// Otimização de notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Background sync otimizado
self.addEventListener('sync', (event) => {
  if (event.tag === 'coffee-sync') {
    event.waitUntil(syncCriticalData());
  }
});

async function syncCriticalData() {
  try {
    // Sincronizar apenas dados críticos
    console.log('SW: Syncing critical data only...');
    return Promise.resolve();
  } catch (error) {
    console.error('SW: Sync failed:', error);
    throw error;
  }
}
