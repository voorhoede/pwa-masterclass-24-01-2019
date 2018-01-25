import {appendMessage} from '../message/message';
import idb from '../../assets/idb.js';

const MESSAGE_ID_ATTRIBUTE = 'data-message-id';
const MESSAGE_STATUS_SELECTOR = '[data-message-status]';
const MESSAGE_FORM_SELECTOR = '[data-message-form]';
const backgroundSyncIsSupported = 'serviceWorker' in navigator && 'SyncManager' in window;
let chatDb;

if (backgroundSyncIsSupported) {
	chatDb = idb.open('chatDb', 1, upgradeDB => { // eslint-disable-line no-undef
		upgradeDB.createObjectStore('messages', {keyPath: 'key'});
	});
}

const initMessageForm = () => {
	const form = document.querySelector(MESSAGE_FORM_SELECTOR);

	if (form) {
		form.addEventListener('submit', onFormSubmit);

		if (backgroundSyncIsSupported) {
			navigator.serviceWorker.addEventListener('message', event => {
				event.data.messages.forEach(message => {
					document
						.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${message.id}"]`)
						.querySelector(MESSAGE_STATUS_SELECTOR).textContent = message.status;
				})
			})
		}
	}
};

function onFormSubmit(e) {
	e.preventDefault();

	const form = document.querySelector(MESSAGE_FORM_SELECTOR);
	const username = form.username.value;
	const date = new Date();

	getRegistrationEndpoint().then(endpoint => {
		const message = {
			id: `${date.getTime()}-${username}`,
			username,
			date,
			body: form.body.value,
			status: 'Sending...',
			endpoint
		};

		appendMessage({message, inbound: false, shouldCache: true});

		if (backgroundSyncIsSupported) {
			storeChat(message).then(() => {
				return navigator.serviceWorker.ready.then(registration => {
					return registration.sync.register('syncChats');
				});
			})
		} else {
			fetch('/messages/send?ajax=true', {
				method: 'POST',
				headers: new Headers({'content-type': 'application/json'}),
				body: JSON.stringify(message),
				credentials: 'include'
			})
				.then(response => response.ok ? response.json() : onError(message.id))
				.then(message => {
					document
						.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${message.id}"]`)
						.querySelector(MESSAGE_STATUS_SELECTOR).textContent = message.status;

					return message;
				})
				.catch(() => onError(message.id))
		}
		form.body.value = '';
	})
}

function getRegistrationEndpoint() {
	return navigator.serviceWorker.getRegistration()
		.then(registration => registration.pushManager.getSubscription()
			.then(subscription => subscription ? subscription.endpoint : null)
		)

}

/**
 * Store a chat message in IndexedDb
 *
 * @param {Object} message      The message object
 * @returns {Promise}
 */
function storeChat(message) {
	return chatDb.then(db => db.transaction('messages', 'readwrite').objectStore('messages').put({
		key: message.id,
		data: message
	}).complete);
}

function onError(messageId) {
	document
		.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${messageId}"]`)
		.querySelector(MESSAGE_STATUS_SELECTOR).textContent = 'Failed';
}

export default initMessageForm;
