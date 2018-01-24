'use strict';

// NOTE: rev hashed core assets from build will be included as global `var serviceworkerOption = { assets: [...] }` see https://www.npmjs.com/package/serviceworker-webpack-plugin

self.addEventListener('install', event => {
	console.log('Installing service worasasddker');
	return self.skipWaiting();
});

self.addEventListener('activate', event => {
	console.log('Activating service worker');
	return self.clients.claim();
});

self.addEventListener('fetch', event => {
	console.log('Fetch event for:', event.request.url);
	event.respondWith(new Response('Hijacked'));
});
