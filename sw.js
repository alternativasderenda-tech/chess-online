// PWA Cache
const CACHE_NAME = 'xadrez-v5';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png', '/privacidade', '/termos'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: tenta buscar atualizado, se falhar usa cache (offline)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }).catch(() => caches.match(e.request))
  );
});

// Monetag (depois do PWA para não interferir)
try {
  self.options = { "domain": "5gvci.com", "zoneId": 10873443 };
  self.lary = "";
  importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
} catch(e) {}
