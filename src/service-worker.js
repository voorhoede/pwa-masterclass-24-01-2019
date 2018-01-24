'use strict';

// NOTE: rev hashed core assets from build will be included as global `var serviceworkerOption = { assets: [...] }` see https://www.npmjs.com/package/serviceworker-webpack-plugin

const CORE_CACHE_NAME = 'core-cache';
const CORE_ASSETS = [
	'/offline/'
].concat(serviceWorkerOption.assets);

self.addEventListener('install', event => {
	console.log('Installing service worker');
	// TODO: precache static assets and offline fallback
	event.waitUntil(caches.open(CORE_CACHE_NAME)
		.then(cache => cache.addAll(CORE_ASSETS))
		.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	console.log('Activating service worker');
	// TODO: invalidate outdated caches
	return self.clients.claim();
});

self.addEventListener('fetch', event => {
	console.log('Fetch event for:', event.request.url);
	// TODO: serve precached static assets(you can use the isCoreGetRequest helper)
	const request = event.request;
	if (isCoreGetRequest(request)) {
		console.info('Core get request: ', request.url);
		event.respondWith(caches.open(CORE_CACHE_NAME)
			.then(cache => cache.match(request.url))
		)
	}
	// TODO: serve cached offline fallback when an HTML request fails(you can use the isHtmlGetRequest helper)
});

/**
 * Checks if a request is a core GET request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is in the core mapping
 */
function isCoreGetRequest(request) {
	return request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url));
}

/**
 * Checks if a request is a GET and HTML request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is a GET and HTML request
 */
function isHtmlGetRequest(request) {
	return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

/**
 * Get a pathname from a full URL by stripping off domain
 *
 * @param {Object} requestUrl        The request object, e.g. https://www.mydomain.com/index.css
 * @returns {String}                Relative url to the domain, e.g. index.css
 */
function getPathName(requestUrl) {
	const url = new URL(requestUrl);
	return url.pathname;
}
