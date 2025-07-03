const CACHE_NAME = "tv-mp3-cache-v1";
const MP3_FILES = [
  "/music/song1.mp3",
  "/music/song2.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(MP3_FILES);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith(".mp3")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchRes) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        });
      }).catch(() => {
        return new Response("MP3 unavailable offline", { status: 503 });
      })
    );
  }
});
