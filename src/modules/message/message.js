import formatDate from '../../../lib/format-date';
import {scrollToBottom} from '../message-list/message-list';

const inboundTemplate = document.getElementById('message-template-inbound');
const outboundTemplate = document.getElementById('message-template-outbound');
const messageList = document.querySelector('[data-message-list]');
const MESSAGE_ID_ATTRIBUTE = 'data-message-id';
const MESSAGE_SENDER_SELECTOR = '[data-message-sender]';
const MESSAGE_LINK_SELECTOR = '[data-message-link]';
const MESSAGE_AVATAR_SELECTOR = '[data-message-avatar]';
const MESSAGE_BODY_SELECTOR = '[data-message-body]';
const MESSAGE_TIME_SELECTOR = '[data-message-time]';
const MESSAGE_STATUS_SELECTOR = '[data-message-status]';

export function appendMessage({message, inbound, shouldCache}) {
	const template = inbound ? inboundTemplate : outboundTemplate;
	let clone = document.importNode(template.content, true);
	const messageEl = clone.querySelector(`[${MESSAGE_ID_ATTRIBUTE}]`);
	const bodyEl = clone.querySelector(MESSAGE_BODY_SELECTOR);
	const senderEl = clone.querySelector(MESSAGE_SENDER_SELECTOR);
	const avatarEl = clone.querySelector(MESSAGE_AVATAR_SELECTOR);
	const linkEl = clone.querySelector(MESSAGE_LINK_SELECTOR);
	const statusEl = clone.querySelector(MESSAGE_STATUS_SELECTOR);
	const timeEl = clone.querySelector(MESSAGE_TIME_SELECTOR);

	messageEl.setAttribute(MESSAGE_ID_ATTRIBUTE, message.id);
	bodyEl.textContent = message.body;
	statusEl.textContent = message.status;
	timeEl.setAttribute('datetime', message.date);
	timeEl.textContent = formatDate(message.date);

	if (inbound) {
		messageEl.classList.add('message--inbound');
		avatarEl.alt = message.username;
		avatarEl.src = message.avatar;
		senderEl.textContent = message.username;
		linkEl.href = '/user/' + message.username;
	}

	if ('serviceWorker' in navigator && navigator.serviceWorker.controller && shouldCache) {
		navigator.serviceWorker.controller.postMessage(JSON.stringify(message));
	}

	messageList.appendChild(clone);

	window.requestAnimationFrame(setAnimation);

	function setAnimation() {
		messageList.querySelector(`[${MESSAGE_ID_ATTRIBUTE}="${message.id}"]`).classList.add('animate-in')
	}

	scrollToBottom();
}
