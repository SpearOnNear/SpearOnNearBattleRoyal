const buildVersion = "2.5"; // Change this for each new build
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
