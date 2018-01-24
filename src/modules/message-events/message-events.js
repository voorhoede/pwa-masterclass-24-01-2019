import {appendMessage} from '../message/message';

export function initMessageEvents() {
	const evtSource = new EventSource('/messages/subscribe', {withCredentials: true});

	evtSource.addEventListener('update', event => {
		const currentUser = document.querySelector('[data-username]').getAttribute('data-username');
		const message = JSON.parse(event.data);
		if (message.username !== currentUser) {
			appendMessage({message, inbound: true, shouldCache: true});
		}
	});
	evtSource.onerror = () => {
		console.error('You are disconnected from the event stream :(\nPlease refresh the page or wait until network picks up');
	}
}
