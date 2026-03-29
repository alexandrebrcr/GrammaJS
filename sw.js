const CACHE_NAME = 'grammajs-v7';
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
    if (e.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(e.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
                return networkResponse;
            })
            .catch(() => caches.match(e.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }

                return new Response('', { status: 404, statusText: 'Not Found' });
            }))
    );
});