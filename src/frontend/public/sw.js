// Service Worker para Sentinela Londrina PWA
// Este arquivo gerencia cache, offline e sincronização de dados

const CACHE_NAME = 'sentinela-londrina-v1';
const RUNTIME_CACHE = 'sentinela-runtime-v1';
const DATA_CACHE = 'sentinela-data-v1';

// Assets que devem ser cacheados na instalação
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Padrões de URLs que devem ser cacheados
const CACHE_PATTERNS = {
  static: /\.(js|css|woff2?|ttf|eot|svg)$/,
  images: /\.(png|jpg|jpeg|gif|webp|svg)$/,
  api: /\/api\//,
};

// ============================================
// 1. INSTALAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets iniciais...');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Alguns assets não puderam ser cacheados:', err);
      });
    })
  );
  
  // Força o SW a assumir o controle imediatamente
  self.skipWaiting();
});

// ============================================
// 2. ATIVAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== DATA_CACHE) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Assume o controle de todas as abas abertas
  self.clients.claim();
});

// ============================================
// 3. ESTRATÉGIA DE CACHE: FETCH
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora requisições para o próprio SW
  if (url.pathname === '/sw.js') {
    return;
  }

  // ---- Estratégia para APIs (Network First, com fallback para cache)
  if (CACHE_PATTERNS.api.test(url.pathname)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // ---- Estratégia para assets estáticos (Cache First)
  if (CACHE_PATTERNS.static.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // ---- Estratégia para imagens (Stale While Revalidate)
  if (CACHE_PATTERNS.images.test(url.pathname)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // ---- Estratégia padrão para HTML (Network First)
  event.respondWith(networkFirstStrategy(request));
});

// ============================================
// 4. ESTRATÉGIAS DE CACHE
// ============================================

/**
 * Cache First: Tenta o cache primeiro, depois a rede
 * Ideal para: assets estáticos (JS, CSS, fonts)
 */
function cacheFirstStrategy(request) {
  return caches.match(request).then((response) => {
    if (response) {
      console.log('[SW] Cache hit:', request.url);
      return response;
    }

    return fetch(request).then((response) => {
      // Não cacheia respostas inválidas
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clona a resposta antes de cacheá-la
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    }).catch(() => {
      console.warn('[SW] Falha ao buscar:', request.url);
      // Retorna um fallback se necessário
      return new Response('Recurso não disponível offline', {
        status: 503,
        statusText: 'Service Unavailable',
      });
    });
  });
}

/**
 * Network First: Tenta a rede primeiro, depois o cache
 * Ideal para: conteúdo dinâmico (HTML, APIs)
 */
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Não cacheia respostas inválidas
      if (!response || response.status !== 200) {
        return response;
      }

      // Clona e cacheia a resposta bem-sucedida
      const responseToCache = response.clone();
      const cacheToUse = CACHE_PATTERNS.api.test(request.url) ? DATA_CACHE : RUNTIME_CACHE;
      
      caches.open(cacheToUse).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    })
    .catch(() => {
      console.log('[SW] Rede indisponível, tentando cache:', request.url);
      return caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        // Retorna página offline se disponível
        return caches.match('/offline.html');
      });
    });
}

/**
 * Stale While Revalidate: Retorna cache imediatamente, atualiza em background
 * Ideal para: imagens, conteúdo que pode estar levemente desatualizado
 */
function staleWhileRevalidateStrategy(request) {
  return caches.match(request).then((cachedResponse) => {
    const fetchPromise = fetch(request).then((response) => {
      // Atualiza o cache em background
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      // Se a rede falhar, retorna o cache ou um fallback
      return cachedResponse || new Response('Imagem não disponível', { status: 404 });
    });

    return cachedResponse || fetchPromise;
  });
}

// ============================================
// 5. SINCRONIZAÇÃO EM BACKGROUND
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Sincronização em background:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Sincroniza dados com o backend
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      console.log('[SW] Sincronização bem-sucedida');
      const data = await response.json();
      // Notifica o cliente sobre a sincronização
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            data: data,
          });
        });
      });
    }
  } catch (error) {
    console.error('[SW] Erro na sincronização:', error);
  }
}

// ============================================
// 6. PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification recebida');

  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nova notificação do Sentinela Londrina',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'sentinela-notification',
    requireInteraction: data.requireInteraction || false,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
      },
      {
        action: 'close',
        title: 'Fechar',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Sentinela Londrina', options)
  );
});

// Trata cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Se uma janela já está aberta, foca nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Caso contrário, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('[SW] Service Worker carregado e pronto!');
