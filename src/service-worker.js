'use strict';

// NOTE: rev hashed core assets from build will be included as global `var serviceworkerOption = { assets: [...] }` see https://www.npmjs.com/package/serviceworker-webpack-plugin

self.addEventListener('install', event => {
	return self.skipWaiting()
});

self.addEventListener('activate', event => {
	return self.clients.claim();
});

self.addEventListener('fetch', event => {

});
