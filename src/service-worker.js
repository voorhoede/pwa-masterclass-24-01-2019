'use strict';

// NOTE: rev hashed core assets from build will be included as global `var serviceworkerOption = { assets: [...] }` see https://www.npmjs.com/package/serviceworker-webpack-plugin

const CORE_CACHE_NAME = 'core-cache';
const CORE_ASSETS = [
	'/offline/'
].concat(serviceWorkerOption.assets);

self.addEventListener('install', event => {
	console.log('Installing service worker');
	event.waitUntil(caches.open(CORE_CACHE_NAME)
		.then(cache => cache.addAll(CORE_ASSETS))
		.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	console.log('Activating service worker');
	event.waitUntil(
		caches.open(CORE_CACHE_NAME).then(cache => {
			return cache.keys().then(requests => {
					return Promise.all(
						requests.filter(request => {
							return !CORE_ASSETS.includes(getPathName(request.url));
						}).map(cacheName => {
							return cache.delete(cacheName)
						})
					)
				}
			).then(() => self.clients.claim())
		})
	)
});

self.addEventListener('fetch', event => {
	console.log('Fetch event for:', event.request.url);
	const request = event.request;
	if (isCoreGetRequest(request)) {
		console.info('Core get request: ', request.url);
		event.respondWith(caches.open(CORE_CACHE_NAME)
			.then(cache => cache.match(request.url))
		)
	} else if (isHtmlGetRequest(request)) {
		console.info('HTML get request', request.url);
		event.respondWith(
			fetch(request).catch((error) => {
				console.info('HTML fetch failed. Return offline fallback', error);
				return caches.open(CORE_CACHE_NAME).then(cache => cache.match('/offline/'))
			})
		)
	}
	// TODO: add runtime caching for images(you can use the isImageGetRequest helper)
	// TODO: add runtime caching for html pages(you can use the isHtmlGetRequest helper)
	// TODO: add runtime caching for messages API requests(you can use the isApiGetRequest helper)
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
 * Checks if a request is a GET and API request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is a GET and API request
 */
function isApiGetRequest(request) {
	return request.method === 'GET' && request.url.indexOf('?ajax=true') > -1;
}

/**
 * Checks if a request is a GET and image request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is a GET and image request
 */
function isImageGetRequest(request) {
	return request.method === 'GET' && request.headers.get('accept').indexOf('image/*') > -1;
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
