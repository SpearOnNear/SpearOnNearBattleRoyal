const cacheName = "Spear-Spear On Near-3.0";
const contentToCache = [
    "Build/SpearOnNearBattleRoyal.loader.js",
    "Build/SpearOnNearBattleRoyal.framework.js",
    "Build/SpearOnNearBattleRoyal.data",
    "Build/SpearOnNearBattleRoyal.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
  e.respondWith((async function () {
    if (e.request.url.includes('Build/') || e.request.url.includes('TemplateData/')) {
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      const response = await caches.match(e.request);
      if (response) { return response; }
      else {
        let _res = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, _res.clone());
        return _res;
      }
    }
    else {
      let res = await fetch(e.request);
      console.log(`[Service Worker] Downloading new resource: ${e.request.url}`);
      return res;
    }
  })());
});
