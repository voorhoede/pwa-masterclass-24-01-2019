import {appendMessage} from '../message/message';
import idb from '../../assets/idb.js';

const MESSAGE_ID_ATTRIBUTE = 'data-message-id';
const MESSAGE_STATUS_SELECTOR = '[data-message-status]';
const MESSAGE_FORM_SELECTOR = '[data-message-form]';

const initMessageForm = () => {
	const form = document.querySelector(MESSAGE_FORM_SELECTOR);

	if (form) {
		form.addEventListener('submit', onFormSubmit);
	}
};

function onFormSubmit(e) {
	e.preventDefault();

	const form = document.querySelector(MESSAGE_FORM_SELECTOR);
	const username = form.username.value;
	const date = new Date();

	const message = {
		id: `${date.getTime()}-${username}`,
		username,
		date,
		body: form.body.value,
		status: 'Sending...',
	};

	appendMessage({message, inbound: false, shouldCache: true});

	fetch('/messages/send?ajax=true', {
		method: 'POST',
		headers: new Headers({'content-type': 'application/json'}),
		body: JSON.stringify(message),
		credentials: 'include'
	})
		.then(response => response.ok ? response.json() : onError(message.id))
		.then(message => {
			form.body.value = '';
			document
				.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${message.id}"]`)
				.querySelector(MESSAGE_STATUS_SELECTOR).textContent = message.status;

			return message;
		})
		.catch(() => onError(message.id))
}


function onError(messageId) {
	document
		.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${messageId}"]`)
		.querySelector(MESSAGE_STATUS_SELECTOR).textContent = 'Failed';
}

export default initMessageForm;
