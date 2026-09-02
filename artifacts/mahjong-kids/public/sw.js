/*
 * Offline support for Tile Match.
 *
 * Vite gives every built JS/CSS file a hashed name, so instead of a fixed
 * precache list this worker fetches the app's index.html at install time,
 * reads the asset URLs out of it, and caches those. After that:
 *   - page loads are network-first, falling back to the cached shell offline
 *   - hashed assets are cache-first (their names change when content changes)
 *   - Google Fonts are served from cache and refreshed in the background
 */
const CACHE_NAME = "tile-match-v1";
const BASE = new URL("./", self.location).href;
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

function sameOriginAssetUrls(html) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    let url;
    try { url = new URL(match[1], BASE); } catch { continue; }
    if (url.origin === self.location.origin) urls.add(url.href);
  }
  return urls;
}

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(BASE, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not fetch app shell: ${response.status}`);
  const html = await response.clone().text();
  await cache.put(BASE, response);

  const urls = sameOriginAssetUrls(html);
  urls.add(new URL("manifest.webmanifest", BASE).href);
  urls.add(new URL("icons/icon-192.png", BASE).href);
  urls.add(new URL("icons/icon-512.png", BASE).href);
  urls.add(new URL("icons/apple-touch-icon.png", BASE).href);

  // Cache each file independently so one miss doesn't abort the whole install.
  await Promise.all(
    [...urls].map(url => cache.add(url).catch(() => undefined)),
  );
}

// Drop hashed assets that the newest index.html no longer references.
async function pruneStaleAssets(cache, html) {
  const live = sameOriginAssetUrls(html);
  const assetsPrefix = new URL("assets/", BASE).href;
  for (const request of await cache.keys()) {
    if (request.url.startsWith(assetsPrefix) && !live.has(request.url)) {
      await cache.delete(request);
    }
  }
}

self.addEventListener("install", event => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("tile-match-") && key !== CACHE_NAME)
            .map(key => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

async function handleNavigation() {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(BASE, { cache: "no-cache" });
    if (response.ok) {
      const html = await response.clone().text();
      await cache.put(BASE, response.clone());
      pruneStaleAssets(cache, html).catch(() => undefined);
    }
    return response;
  } catch {
    const cached = await cache.match(BASE);
    if (cached) return cached;
    throw new Error("Offline and no cached app shell");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then(response => {
      if (response.ok || response.type === "opaque") cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached ?? (await refresh) ?? Response.error();
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation());
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
