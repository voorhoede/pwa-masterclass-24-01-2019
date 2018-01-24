'use strict';

// NOTE: rev hashed core assets from build will be included as global `var serviceworkerOption = { assets: [...] }` see https://www.npmjs.com/package/serviceworker-webpack-plugin

self.addEventListener('install', event => {
	console.log('Installing service worker');
	return self.skipWaiting();
});

self.addEventListener('activate', event => {
	console.log('Activating service worker');
	return self.clients.claim();
});

self.addEventListener('fetch', event => {
	console.log('Fetch event for:', event.request.url);
	// TODO: hijack fetch events
});
