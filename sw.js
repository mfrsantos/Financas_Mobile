//Versão 4.8 - Banco de Dados limpo
const CACHE_NAME = 'ms-financas-v3.2';

// Lista de ativos com o caminho do repositório
const ASSETS = [
  '/Financas_Mobile/',
  '/Financas_Mobile/index.html',
  '/Financas_Mobile/manifest.json',
  'https://cdn-icons-png.flaticon.com/512/5501/5501375.png'
];

// Instalação e Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: A criar cache de ativos');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('SW: A remover cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Interceção de pedidos (Fetch)
self.addEventListener('fetch', (e) => {
  // Ignorar pedidos do Firebase para não bloquear o Login
  if (e.request.url.includes('googleapis') || e.request.url.includes('firebase')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
