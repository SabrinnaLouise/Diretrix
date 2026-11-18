/* Diretrix · service worker: guarda os arquivos do app para abrir sem internet */
const CACHE = 'diretrix-v6';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'js/motion.js',
  'img/trixie-ola-filme.webp', 'img/trixie-pensa-filme.webp', 'img/trixie-aponta-filme.webp', 'img/trixie-confia-filme.webp',
  'img/trixie-icone.webp', 'img/trixie-chat.webp', 'img/trixie-ola.webp', 'img/trixie-ajuda.webp',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png', 'icons/favicon-48.png',
  'img/logo-diretrix.png', 'img/logo-diretrix-claro.png',
  'app/index.html', 'app/js/base-juridica.js', 'app/js/ia-adapter.js', 'app/js/trixie.js', 'app/js/app.js',
  'app/img/trixie-icone.webp', 'app/img/logo-diretrix.png', 'app/img/logo-diretrix-claro.png', 'app/img/trixie-chat.webp', 'app/img/trixie-ola.webp', 'app/img/trixie-ajuda.webp'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; }).catch(() => caches.match(e.request)));
});
