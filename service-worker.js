var cacheName = 'pwa-devlab-v1.41';
var filesToCache = [
  '/',
  '/index.html',
  '/download.json',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/ic_about_white.svg',
  '/images/woodwall.jpg',
  '/images/woodwall2.jpg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {  
  console.log('[ServiceWorker] Activate');  
  e.waitUntil(  
    caches.keys().then(function(keyList) {  
      return Promise.all(keyList.map(function(key) {   
        if (key !== cacheName) {  
          return caches.delete(key);  
        }  
      }));  
    })  
  );  
});

self.addEventListener('fetch', function(e) {

  var extendDataUrl = [
    '/download.json'
  ];

  var allDataUrl = extendDataUrl;
  var requestIsDataApi = false;

  for (count in extendDataUrl){
    if (e.request.url.indexOf(extendDataUrl[count]) > -1 ) {
      requestIsDataApi = true;
      e.respondWith(
        caches.open(cacheName).then(function(cache) {
          return fetch(e.request).then(function(response){
            cache.put(e.request.url, response.clone());
            return response;
          });
        })
      );
      break;
    }
  }

  if (!requestIsDataApi){
    e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
  }
});

