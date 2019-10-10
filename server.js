const cacheControlImmutable = require('./lib/cache-control-immutable');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const path = require('path');
const revConfig = require('./lib/rev-config');
const revUrl = require('./lib/rev-url');
const urlParser = require('url');
const formatDate = require('./lib/format-date');
const renderAvatar = require('./lib/render-avatar');
const webpush = require('web-push');

const vapidKeys = {
	publicKey: 'BEug9xni294YURu5ogJiCRebe1SDTpTLS2P3nf-SLlHDDModaoSlRconTTc17AQy4-M_ykprV79Kbdaa8uH6BXY\n',
	privateKey: 'aGMOdL6tDTjJW9nAH-0PBIHOY5qFsEK7HmWuDyp2Wb8'
};

webpush.setVapidDetails(
	'mailto:declan@voorhoede.nl',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

const app = express();
const config = {
	baseDir: 'src/',
	cacheDir: 'cache/',
	port: process.env.PORT || 7924
};

// SSE route should be handled before perf & 'auth' middleware
// make things harder
app.get('/messages/subscribe', (req, res, next) => {
	res.set({
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
	});
	app.on('update', data => {
		res.write(`event: update\n`);
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

/**
 * Pretty URLs:
 * - redirect URLs with pattern `path/to/page/index.html` to `path/to/page/` and maintain search parameters (`?param=value` etc)
 */
app.use('*/index.html', (req, res) => res.redirect(301, `${path.dirname(req.originalUrl)}/${urlParser.parse(req.originalUrl).search}`));

/**
 * Performance tuning for entire app:
 * - Enable validating cached responses using `etag`s: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating_cached_responses_with_etags
 * - Remove unneeded headers ('X-Powered-By' (done by Helmet), 'lastMofied') to safe bytes
 * - Set immutable headers on revisioned files with `revConfig.pattern`: https://bitsup.blogspot.nl/2016/05/cache-control-immutable.html
 * - Serve (revisioned) files from `cacheDir` when available.
 */
app.set('etag', true);
app.use(helmet());
app.use(revConfig.pattern, cacheControlImmutable);
app.use(express.static(path.join(__dirname, config.cacheDir), {index: false, lastModified: false}));

/**
 * Static files:
 * - Try source files from `baseDir`.
 * - Don't try to use `index.html` in case URL is a directory as we render pages dynamically.
 */
app.use(express.static(path.join(__dirname, config.baseDir), {index: false, lastModified: false}));

/**
 * Dynamic pages:
 * - Uses Nunjucks for dynamic rendering: https://mozilla.github.io/nunjucks/api.html#express
 * - Adds a `revUrl` helper to inject URLs to revisioned files.
 * - Render page if there's a matching template (`index.html`) for the URL.
 * - Return 500 page if something goes wrong while rendering.
 * - Return 404 page if no matching template is found.
 */
const renderer = nunjucks.configure(config.baseDir, {
	autoescape: true,
	express: app,
	watch: true
});
renderer.addGlobal('revUrl', revUrl);
renderer.addGlobal('formatDate', formatDate);
renderer.addGlobal('renderAvatar', renderAvatar);

let users = [{
	name: 'bot',
	avatar: 'https://robohash.org/68.186.255.198.png',
}];

let messages = [{
	id: '12345',
	username: 'bot',
	avatar: 'https://robohash.org/68.186.255.198.png',
	date: new Date(),
	body: 'Welcome to the chat!',
	status: 'Sent'
}];

// Unauthenticated routes

// offline
app.get('/offline/', (req, res, next) => {
	res.render(`./offline/index.html`, {}, (err, html) => {
		if (err) {
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
		res.send(html);
	});
});

// login
app.get('/login/', (req, res, next) => {
	res.render(`./login/index.html`, {}, (err, html) => {
		if (err) {
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
		res.send(html);
	});
});

// Authenticated routes

// redirect to login if no username
app.get('*', (req, res, next) => {
	if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
		req.cookies.username ? next() : res.status(401).redirect('/login/');
	} else {
		next();
	}
});

// html pages
app.get('*', (req, res, next) => {
	const filename = path.join(req.path, 'index.html');
	const loggedInUserName = req.cookies.username;
	const user = users.find(user => user.name === loggedInUserName);

	fs.stat(`${config.baseDir}${filename}`, (err, stats) => {
		if (err || !stats.isFile()) {
			next();
		} else {
			if (!user) {
				res.render('./login/index.html')
			} else {
				res.render(`./${filename}`, {
					user,
					messages
				}, (err, html) => {
					if (err) {
						console.log(err);
						res.status(500).send('Internal Server Error')
					}
					res.send(html);
				});
			}
		}
	});
});

// user profile pages
app.get('/user/:username', (req, res, next) => {
	const filename = path.join('user', 'index.html');
	const userParam = req.params.username;
	const user = users.find(user => user.name === userParam);

	if (!user) {
		res.status(404).render('./404.html');
	} else {
		res.render(`./${filename}`, {
			user
		}, (err, html) => {
			if (err) {
				console.log(err);
				res.status(500).send('Internal Server Error')
			}
			res.send(html);
		});
	}
});

app.get('/logout', (req, res, next) => {
	// remove user, clear cookie and redirect to login
	const user = users.find(user => user.name === req.cookies.username);
	const index = users.indexOf(user);
	users.splice(index);
	res.clearCookie('username');
	res.redirect('/login');
});

// 404
app.get('*', (req, res, next) => {
	if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
		res.status(404).render('./404.html');
	} else {
		next();
	}
});

app.post('/login', (req, res, next) => {
	const userExists = users.find(user => user.name === req.body.username);

	if (userExists) {
		res.render(`./login/index.html`, {
			errorMessage: 'Sorry but this username is already taken',
		}, (err, html) => {
			if (err) {
				console.log(err);
				res.status(500).send('Internal Server Error')
			}
			res.send(html);
		});
	} else {
		users.push({
			name: req.body.username,
			avatar: req.body.avatar
		});
		res.cookie('username', req.body.username);
		res.redirect('/');
	}
});

app.get('/messages', (req, res, next) => {
	res.json(messages);
});

app.post('/messages/send', (req, res, next) => {
	const isAsync = req.query.ajax;

	const message = req.body;
	const body = message.body;
	const date = isAsync ? message.date : new Date();
	const username = message.username;
	const id = isAsync ? message.id : `${new Date(date).getTime()}-${username}`;
	const user = users.find(user => user.name === username);
	const avatar = user ? user.avatar : '';
	const status = 'Sent';
	const pushSubscriptionEndpoint = message.endpoint;

	const responseMessage = {
		id,
		username,
		avatar,
		body,
		date,
		status
	};

	messages.push(responseMessage);

	// Emit event to broadcast SSE
	app.emit('update', responseMessage);

	isAsync ? res.json(responseMessage) : res.redirect('/');

	const subscriptionsToSend = subscriptions.filter(subscription => subscription.endpoint !== pushSubscriptionEndpoint);

	for (let i = 0; i < subscriptionsToSend.length; i++) {
		const subscription = subscriptionsToSend[i];
		triggerPushMsg(subscription, JSON.stringify({body: responseMessage.body, username}));
	}
});


let subscriptions = [];

app.post('/api/save-subscription', (req, res, next) => {
	if (!isValidSaveRequest(req, res)) {
		return;
	}

	return saveSubscription(req.body)
		.then(function (subscriptionId) {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({data: {success: true}}));
		})
		.catch(function (err) {
			res.status(500);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({
				error: {
					id: 'unable-to-save-subscription',
					message: 'The subscription was received but we were unable to save it to our database.'
				}
			}));
		});
});

const triggerPushMsg = (subscription, data) => {
	return webpush.sendNotification(subscription, data).catch((err) => {
		console.log('Subscription is no longer valid: ', err);
		return subscriptions.splice(subscriptions.indexOf(subscription), 1);
	});
};

function saveSubscription(subscription) {
	return new Promise((resolve, reject) => {
		try {
			subscriptions.push(subscription);
		} catch (e) {
			reject(e);
		}
		resolve(subscription);
	});
}

const isValidSaveRequest = (req, res) => {
	// Check the request body has at least an endpoint.
	if (!req.body || !req.body.endpoint) {
		// Not a valid subscription.
		res.status(400);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({
			error: {
				id: 'no-endpoint',
				message: 'Subscription must have an endpoint.'
			}
		}));
		return false;
	}
	return true;
};

app.listen(config.port, (err) => {
	err ? console.error(err) : console.log(`app running on http://localhost:${config.port}`);
});
