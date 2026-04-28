const CACHE_NAME = "conference-online-first-v1";
const APP_SHELL = ["/", "/index.html", "/CUKLogo.png", "/logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      )
    ),
  );
  self.clients.claim();
});

async function onlineFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200 && request.method === "GET") {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // For SPA route navigations, fallback to cached app shell.
    if (request.mode === "navigate") {
      const indexFallback = await cache.match("/index.html");
      if (indexFallback) return indexFallback;
    }

    return new Response("Offline and not cached yet.", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Only handle same-origin requests to avoid third-party noise.
  if (url.origin !== self.location.origin) return;

  event.respondWith(onlineFirst(request));
});
