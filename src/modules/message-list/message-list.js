import {appendMessage} from '../message/message';

const MESSAGE_LIST_SELECTOR = '[data-message-list]';
const messageList = document.querySelector(MESSAGE_LIST_SELECTOR);

export function initMessageList() {
	if (messageList) {
		messageList.classList.add('is-enhanced');
		const username = document.querySelector('[data-username]').getAttribute('data-username');
		fetch('/messages?ajax=true', {
			method: 'GET',
			headers: new Headers({'content-type': 'application/json'}),
			credentials: 'include'
		})
			.then(response => response.ok ? response.json() : onError)
			.then(messages => messages.slice(Math.max(messages.length - 50, 0))) // last 50 results
			.then(messages => {
				messages.forEach(message => {
					appendMessage({message, inbound: message.username !== username, shouldCache: false});
				})
			})
			.catch(err => onError(err));
	}
}

export function scrollToBottom() {
	return messageList.scrollTo(0, messageList.scrollHeight);
}

function onError(err) {
	throw err;
}
