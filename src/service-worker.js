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

	const request = event.request;
	if (request.headers.get('accept').indexOf('image/*') > -1) {
		console.log('Hijcaking image request', request.url);
		event.respondWith(
			fetch('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlvdvMoGYKcfaOx2ejvmlFm479Qfcdkd0AccjIYUMXWcye19EW')
		)
	}
});
