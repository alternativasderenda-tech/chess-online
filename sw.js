// PWA Cache
// >>> gerado por aprenda/gerador/gerar.js (D-APR-08) — não editar entre as marcas
const CACHE_NAME = 'xadrez-v16-4b80f799';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/privacidade',
  '/termos',
  '/torneios',
  '/en/tournaments',
  '/aprenda',
  '/en/learn',
  '/aprenda/post.css?v=3bff02f431',
  '/aprenda/aprenda.js?v=e4740bb5a7',
  '/aprenda/motor.js?v=7658f30a44'
];
// <<< fim do trecho gerado

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
  // API, login e tempo real agora ficam no mesmo domínio: nunca passam pelo cache
  if (/^\/(rest|auth|functions)\/|^\/xrt/.test(new URL(req.url).pathname)) return;
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
