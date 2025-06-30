const CACHE_NAME = 'dapurkreasi-cache-v2'; // Tingkatkan versi cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Pastikan CSS Anda dieksternalisasi
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png', // Tambahkan ini jika Anda membuat ikon 512x512
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Jika ada di cache, kembalikan response dari cache
        if (response) {
          return response;
        }

        // Kloning request karena stream hanya bisa dikonsumsi sekali
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Periksa apakah response valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Kloning response karena stream hanya bisa dikonsumsi sekali
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});