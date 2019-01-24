# Background sync

## Exercise

In your [service worker](src/service-worker.js):

- Add an event listener for the `sync` event(and test with sync event from dev tools). See [Google developers](https://developers.google.com/web/updates/2015/12/background-sync) for more info.
- Add a tag to filter different sync events.

In [message-form.js](src/components/message-form.js):

- Instantiate indexedDB. See line 9 in message-form.js.
  - Note that we use an [IndexedDB helper](https://github.com/jakearchibald/idb), that is imported.
- When sending a chat message store the message(using `storeChat` helper) and register a sync event.

In your [service worker](src/service-worker.js):

- Note that we use an IndexedDB helper and import it using `importScripts('./assets/idb.js')`.
- In your sync event handler send queued chats(use `sendChats` helper)
- When done sending queued chat messages send a post message to the client(use the `postMessage` helper)

In [message-form.js](src/components/message-form.js):

- Add an event listener for post message from the service worker.
- Update UI message status from `Sending` to `Sent` when receiving a postMessage.
  - You can identify the message in the HTML by the data attribute `data-message-id` where the value of the attribute is the id of the message.

## Exercise

See [05-background-sync-solution](https://github.com/voorhoede/pwa-masterclass-24-01-2019/tree/05-background-sync-solution)
