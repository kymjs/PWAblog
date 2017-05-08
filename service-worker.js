var cacheName = 'pwa-devlab-v1.44';
var filesToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/ic_about_white.svg',
  '/images/ic_back_white.svg',
  '/images/offline.jpg',
  '/images/woodwall.jpg',
  '/images/woodwall2.jpg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {  
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

  //如果是 API 请求，先网络后缓存
  for (count in extendDataUrl){
    if (e.request.url.indexOf(extendDataUrl[count]) > -1 ) {
      requestIsDataApi = true;
      e.respondWith(
        fetch(e.request)
        .then(function(response) {
          return caches.open(cacheName).then(function(cache){
            cache.put(e.request.url, response.clone()); 
            return response;
          });
        })
        .catch(function(){
          return caches.match(e.request.url);
        })
      );
      break;
    }
  }

  //一般资源请求，先缓存再网络再默认
  if (!requestIsDataApi){
    e.respondWith(
      caches.match(e.request).then(function(respond){
        return respond || fetch(e.request)
          .then(function(res){
            return caches.open(cacheName).then(function(cache){
              cache.put(e.request.url, res.clone()); 
              return res;
            });
          })
          .catch(function(){
            return caches.match('offline.html');
          });
      })
    )
  }

});

