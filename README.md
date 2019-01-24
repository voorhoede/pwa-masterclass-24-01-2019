# Precaching

## Exercise

In your [service worker](src/service-worker.js):

- Precache static assets on install. See [MDN - Cache Storage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) for more info.
- Precache `/offline/` on install.
- Serve your precached static assets on fetch. See [MDN - respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith).
- Serve cached offline fallback when an HTML request fails.
- Invalidate outdated caches on activate.

## Solution

See [03-precaching-solution](https://github.com/voorhoede/pwa-masterclass-24-01-2019/tree/03-precaching-solution)
