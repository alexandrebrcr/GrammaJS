const CACHE_NAME = 'grammajs-v5';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './dictionary.json',
    './manifest.json'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames
                .filter((cacheName) => cacheName !== CACHE_NAME)
                .map((cacheName) => caches.delete(cacheName))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});