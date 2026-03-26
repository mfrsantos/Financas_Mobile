// ERP Finanças MS Informática - Service Worker
// Versão: 3.1 (Atualizado para Novo Repositório - Março/2026)
// Suporte para: Abas, Dashboard e PWA no GitHub Pages

const CACHE_NAME = 'erp-ms-financas-v2.1.0';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. Instalação: Salva os arquivos essenciais no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW MS: Cache atualizado para v2.1.0');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa versões antigas para liberar espaço e evitar bugs
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW MS: Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Estratégia: Network-First (Garante que você veja as atualizações se tiver internet)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
