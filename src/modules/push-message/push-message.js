export function initPushMessage() {
	if ('PushManager' in window) {
		// show subscription button
		const subscriptionButton = document.querySelector('[data-push-message]');
		if (subscriptionButton) {
			subscriptionButton.classList.add('is-enhanced');
			subscriptionButton.addEventListener('click', getPermission);
		}
	}
}

export function getPermission() {
	return navigator.permissions.query({name: 'notifications'})
		.then(status => {
			switch (status.state) {
				case 'prompt':
					console.info('Notifications prompt');
					// TODO: ask permission for push notifications
					// TODO: if the result is granted, call subscribeUserToPush
					break;
				case 'granted':
					console.info('Notifications granted');
					break;
				case 'denied':
					console.info('Notifications denied');
					break;
				default:
					console.info('Could not get notification status');
			}
		});
}

function subscribeUserToPush() {
	return navigator.serviceWorker.getRegistration()
		.then((registration) => {
			const vapidPublicKey = 'BEug9xni294YURu5ogJiCRebe1SDTpTLS2P3nf-SLlHDDModaoSlRconTTc17AQy4-M_ykprV79Kbdaa8uH6BXY\n';
			const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

			registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: convertedVapidKey
			}).then(pushSubscription => {
				console.info('Received PushSubscription: ', JSON.stringify(pushSubscription));
				sendSubscriptionToBackEnd(pushSubscription);
			});
		});
}

function sendSubscriptionToBackEnd(subscription) {
	return fetch('/api/save-subscription/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(subscription)
	}).then(response => {
		if (!response.ok) {
			throw new Error('Bad status code from server.');
		}

		return response.json();
	}).then(responseData => {
		if (!(responseData.data && responseData.data.success)) {
			throw new Error('Bad response from server.');
		}
	});
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
