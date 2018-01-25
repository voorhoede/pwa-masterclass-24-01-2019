# Push notifications

## Exercise

In [push-message.js](src/modules/push-message.js):

- Request permission for notifications. See [MDN - requestPermission](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission) for more info.
- If granted send the push subscription to the back-end(use the `subscribeUserToPush()` helper function).

In your [service worker](src/service-worker.js):

- Add a `push` event listener and test it with Chrome dev tools.
- Add an actual notification on a push event. See [MDN - showNotification](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification) for more info.
  - Note that the service worker registration can be found in your service worker as `self.registration`.
- Test with different browsers that you actually get notifications. You can use `npm run proxy` to expose localhost and test on your phone(even when the app is not open!).

For extensive information on web push messages in general see [Google Developers](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications)

## Solution

See [06-push-notifications-solution](https://github.com/voorhoede/pwa-masterclass-26-01-2018/tree/06-push-notifications-solution)

## Bonus

See [06-push-notifications-solution-bonus](https://github.com/voorhoede/pwa-masterclass-26-01-2018/tree/06-push-notifications-solution-bonus)

