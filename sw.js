// Nombre de la versión en caché (sincronizado con v1.3)
const CACHE_NAME = 'dale-play-v1.3';

// Archivos vitales para funcionamiento offline y carga instantánea
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './songs.js',
  './manifest.json',

  // Iconos PWA en raíz
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',

  // Assets gráficos del juego
  './assets/fondo.jpg',
  './assets/splash-portada.jpg',
  './assets/dale-play.png',
  './assets/ludyco.png',
  './assets/icono-cara-a.png',
  './assets/icono-animados.png'
];

// 1. INSTALACIÓN: Guardar assets iniciales en caché
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVACIÓN: Eliminar versiones antiguas de caché automáticamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Network-first para archivos de código, Cache-first para assets pesados
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Excluir solicitudes externas de YouTube y APIs de terceros del cache local
  if (url.origin !== location.origin) {
    return;
  }

  // Para index.html y sw.js siempre intentar red primero para no quedarse atrapado
  if (event.request.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para el resto de archivos (assets, imágenes, scripts): Cache primero con respaldo de red
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // En caso de estar sin conexión
      });
    })
  );
});