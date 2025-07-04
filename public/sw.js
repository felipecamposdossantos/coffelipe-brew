
const CACHE_NAME = 'timercoffee-v4.0';
const STATIC_CACHE = 'static-v4.0';
const DYNAMIC_CACHE = 'dynamic-v4.0';
const OFFLINE_CACHE = 'offline-v4.0';

// Cache crítico otimizado para mobile
const staticAssets = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png'
];

// Recursos offline essenciais
const offlineAssets = [
  '/offline.html',
  '/static/js/core.js'
];

// Estratégia de cache mobile-first
const cacheStrategies = {
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'CacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'NetworkFirst',
    networkTimeoutSeconds: 2,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  },
  offline: {
    cacheName: OFFLINE_CACHE,
    strategy: 'CacheOnly'
  }
};

// Instalar service worker com cache otimizado
self.addEventListener('install', (event) => {
  console.log('SW: Installing mobile-optimized version...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('SW: Caching essential assets');
          return cache.addAll(staticAssets);
        }),
      caches.open(OFFLINE_CACHE)
        .then((cache) => {
          console.log('SW: Caching offline assets');
          return cache.addAll(offlineAssets);
        })
    ]).then(() => self.skipWaiting())
  );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('SW: Activating mobile-optimized version...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE].includes(cacheName)) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Limitar tamanho dos caches
        limitCacheSize(DYNAMIC_CACHE, 50);
        return self.clients.claim();
      })
  );
});

// Estratégia de fetch mobile-optimized
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Pular requisições não-GET
  if (request.method !== 'GET') return;

  // Cache-First para recursos estáticos
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstMobile(request));
    return;
  }

  // Network-First ultra-rápido para APIs
  if (isApiRequest(url)) {
    event.respondWith(networkFirstMobile(request));
    return;
  }

  // Stale-While-Revalidate para navegação
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidateMobile(request));
    return;
  }

  // Cache-First com fallback para outros recursos
  event.respondWith(cacheFirstMobile(request));
});

// Funções helper otimizadas para mobile
function isStaticAsset(url) {
  return staticAssets.some(asset => url.pathname.endsWith(asset.split('/').pop())) ||
         url.pathname.includes('/static/') ||
         url.pathname.includes('/assets/');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname !== location.hostname ||
         url.pathname.includes('supabase');
}

async function cacheFirstMobile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetchWithTimeout(request, 3000);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('SW: Cache-first failed for:', request.url);
    return offlineFallback(request);
  }
}

async function networkFirstMobile(request) {
  try {
    const response = await fetchWithTimeout(request, 1500); // Timeout mais agressivo
    
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return offlineFallback(request);
  }
}

async function staleWhileRevalidateMobile(request) {
  const cachedResponse = await caches.match(request);
  
  // Fetch em background para atualizar cache
  const fetchPromise = fetchWithTimeout(request, 2000).then((response) => {
    if (response.status === 200) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

async function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
}

async function offlineFallback(request) {
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
  
  return new Response('Offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Limitar tamanho do cache para dispositivos móveis
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
    console.log(`SW: Cache ${cacheName} trimmed to ${maxItems} items`);
  }
}

// Background sync para mobile
self.addEventListener('sync', (event) => {
  if (event.tag === 'coffee-sync') {
    event.waitUntil(syncCoffeeData());
  }
});

async function syncCoffeeData() {
  try {
    console.log('SW: Syncing coffee data...');
    // Implementar sincronização específica de dados de café
    return Promise.resolve();
  } catch (error) {
    console.error('SW: Sync failed:', error);
    throw error;
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    console.log('SW: Performance report:', event.data.metrics);
  }
});

// Notificações otimizadas
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Procurar janela existente
      for (const client of clientList) {
        if (client.url.includes(location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Abrir nova janela se não encontrar
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
