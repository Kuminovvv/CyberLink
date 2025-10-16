const CACHE = 'cyberlingo-cache-v1';
const ASSETS = [
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './src/main.js',
  './src/router.js',
  './src/api.js',
  './src/models.js',
  './src/utils/storage.js',
  './src/logic/gamification.js',
  './src/logic/adaptive.js',
  './src/data/seed.js'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=> c.addAll(ASSETS)).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  const { request } = e;
  if (request.method !== 'GET') return; // pass through for mutations
  e.respondWith(
    caches.match(request).then(resp=> resp || fetch(request).catch(()=> caches.match('./index.html')))
  );
});

