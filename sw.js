// ERP Finanças MS Informática - Service Worker
// Versão: 1.9.9 (Atualizado em Março/2026)
// Suporte para: Renda Extra em Contas Fixas e PWA Automático

const CACHE_NAME = 'erp-ms-financas-v1.9.7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Instalação: Salva os arquivos essenciais no cache do navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW MS Informática: Criando novo cache de ativos');
      return cache.addAll(ASSETS);
    })
  );
  // Força o SW a se tornar ativo imediatamente
  self.skipWaiting();
});

// 2. Ativação: Remove caches de versões anteriores para evitar conflitos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW MS Informática: Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Garante que o SW controle a página imediatamente
  return self.clients.claim();
});

// 3. Estratégia Fetch: Network-First (Tenta internet, se falhar usa o cache)
// Essencial para permitir o uso Offline no Windows 11 e Android
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
