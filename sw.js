// PWA Cache
const CACHE_NAME = 'xadrez-v11';
const ASSETS = [
  '/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png',
  '/privacidade', '/termos',
  '/aprenda', '/aprenda/post.css',
  '/aprenda/como-jogar-xadrez-do-zero',
  '/aprenda/aberturas-de-xadrez-para-iniciantes',
  '/aprenda/regras-do-xadrez',
  '/aprenda/xeque-mate-em-4-lances',
  '/aprenda/como-o-cavalo-se-move',
  '/aprenda/xadrez-classico-blitz-bullet'
];

self.addEventListener('install', e => {
  // Cacheia cada asset individualmente: se um falhar, a instalacao do SW
  // continua mesmo assim. (c.addAll e' atomico — 1 falha derrubava tudo,
  // e SW sem instalar = Chrome nao consegue gerar o app instalavel.)
  e.waitUntil(
    caches.open(CACHE_NAME).then(c =>
      Promise.allSettled(ASSETS.map(u => c.add(u)))
    )
  );
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
  const req = e.request;
  // Cache.put() so' aceita GET. POST (RPC do Supabase) vai direto pra rede.
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(resp => {
      // So' cacheia respostas OK do proprio dominio (nao cacheia ads,
      // Supabase, nem respostas de erro).
      try {
        if (resp && resp.ok && new URL(req.url).origin === self.location.origin) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
      } catch (err) {}
      return resp;
    }).catch(() => caches.match(req))
  );
});

// Monetag (depois do PWA para não interferir)
try {
  self.options = { "domain": "5gvci.com", "zoneId": 10873443 };
  self.lary = "";
  importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
} catch(e) {}
