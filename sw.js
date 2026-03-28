const CACHE_NAME = 'ms-financas-cloud-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o cache básico
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Responde do cache, mas permite que o Firebase Auth funcione pela rede
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('googleapis') || e.request.url.includes('firebase')) {
    return; // Não cacheia chamadas do Firebase
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
