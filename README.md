# Push notifications

## Solution

In push-message.js:

- Request permission for notifications.
- If granted send the push subscription to the back-end.

See [commit](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/8ec3509898ffe82d2047605211b1ccb714b16bab).

In your [service worker](src/service-worker.js):

- [Add a `push` event listener.](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/be4393f40f14f3c7d2b8cc2a5a151ff3325688e5)
- [Add an actual notification on a push event.](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/0463edba104b0de4153aefff7ce26384e5dd076e)

## Exercise

See [06-push-notifications-exercise](https://github.com/voorhoede/pwa-masterclass-26-01-2018/tree/06-push-notifications-exercise)
