<<<<<<< HEAD
// Nombre de la versión en caché (sincronizado con v1.3)
=======
// Actualizado a v1.3
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
const CACHE_NAME = 'dale-play-v1.3';

// Archivos vitales para funcionamiento offline y carga instantánea
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './songs.js',
  './manifest.json',

<<<<<<< HEAD
  // Iconos PWA en raíz
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',

  // Assets gráficos del juego
=======
  // Iconos PWA en la raíz (junto a index.html)
  './icon-192.png',
  './apple-touch-icon.png',

  // Imágenes en carpeta assets
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
  './assets/fondo.jpg',
  './assets/splash-portada.jpg',
  './assets/dale-play.png',
  './assets/ludyco.png',
  './assets/icono-cara-a.png',
  './assets/icono-animados.png'
];

<<<<<<< HEAD
// 1. INSTALACIÓN: Guardar assets iniciales en caché
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar activación inmediata
=======
// 1. Instalación
self.addEventListener('install', (event) => {
  self.skipWaiting();
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

<<<<<<< HEAD
// 2. ACTIVACIÓN: Eliminar versiones antiguas de caché automáticamente
=======
// 2. Activación y purga de cachés anteriores
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
<<<<<<< HEAD
            console.log('[SW] Eliminando caché obsoleta:', cache);
=======
            console.log('Eliminando caché antigua:', cache);
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

<<<<<<< HEAD
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
=======
// 3. Fetch (estrategia Cache-First con Network Fallback, excluyendo YouTube y EmailJS)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin.includes('youtube.com') || 
      url.origin.includes('googlevideo.com') || 
      url.origin.includes('emailjs.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
<<<<<<< HEAD
      }).catch(() => {
        // En caso de estar sin conexión
=======
>>>>>>> 1e439774cfa277bdc1543df9f711643c5c8e3a29
      });
    })
  );
});