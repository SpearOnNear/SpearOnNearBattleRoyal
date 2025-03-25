const buildVersion = "2.6"; // Change this for each new build
const cachedVersion = localStorage.getItem("webgl_build_version");

console.log("Cached version:", cachedVersion);
console.log("Build version:", buildVersion);

// Create a loading screen
const loaderDiv = document.createElement("div");
loaderDiv.innerHTML = `
    <style>
        #updateLoader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #121212; color: #fff; display: flex; 
            align-items: center; justify-content: center; font-size: 24px;
            z-index: 9999;
        }
    </style>
    <div id="updateLoader">🔄 Checking for updates...</div>
`;
document.body.appendChild(loaderDiv);

async function clearOldCache() {
    console.log("Clearing old cache...");
    const cacheKeys = await caches.keys();
    for (let key of cacheKeys) {
        await caches.delete(key);
    }
}

(async () => {
    if (cachedVersion !== buildVersion) {
        console.log("New build detected!");

        // Show "Updating..." message
        document.getElementById("updateLoader").innerHTML = "🚀 Updating to latest version...";

        // Clear old cache and update version
        await clearOldCache();
        localStorage.setItem("webgl_build_version", buildVersion);

        // Force reload to get the new files
        location.reload();
    } else {
        console.log("Build is up to date!");
    }

    // Remove loading screen after checking
    document.getElementById("updateLoader").remove();
})();



const cacheName = "Spear-Spear On Near-2.6";
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
