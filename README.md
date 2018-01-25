# Background sync

## Exercise

In your [service worker](src/service-worker.js):

- Add an event listener for the `sync` event.
- Add a tag to filter different sync events.

See [commit](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/9583a0e19f12b32c90ff1c602f362a2118db981c).

In [message-form.js](src/components/message-form.js):

- Instantiate indexedDB. See line 9 in message-form.js.
  - Note that we use an [IndexedDB helper](https://github.com/jakearchibald/idb), that is imported.
- [When sending a chat message store the message(using `storeChat` helper) and register a sync event.](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/242dcf68c7dda1f667cacd1ec4024dc3a4f781af)

In your [service worker](src/service-worker.js):

- Note that we use an IndexedDB helper and import it using `importScripts('./assets/idb.js')`.
- In your sync event handler send queued chats(use `sendChats` helper)
- When done sending queued chat messages send a post message to the client(use the `postMessage` helper)

See [commit](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/e100bfd29a42b7172f7b24697c9c0b8dda009670).

In [message-form.js](src/components/message-form.js):

- Add an event listener for post message from the service worker.
- Update UI message status from `Sending` to `Sent` when receiving a postMessage.
  - You can identify the message in the HTML by the data attribute `data-message-id` where the value of the attribute is the id of the message.

See [commit](https://github.com/voorhoede/pwa-masterclass-26-01-2018/commit/8d3891b90ca21015a6abc507c2b76f67dabb68ea).

## Exercise

See [05-background-sync-solution](https://github.com/voorhoede/pwa-masterclass-26-01-2018/tree/05-background-sync-solution)
