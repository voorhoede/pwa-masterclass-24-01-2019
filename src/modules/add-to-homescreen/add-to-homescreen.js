export function initAddToHomescreen() {
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		window.deferredPrompt = e;

		// show subscription button
		const a2hsButton = document.querySelector('[data-add-to-homescreen]');
		if (a2hsButton) {
			a2hsButton.classList.add('is-enhanced');
			a2hsButton.addEventListener('click', addToHomeScreen);
		}
	});
}

function addToHomeScreen() {
	let deferredPrompt = window.deferredPrompt;

	deferredPrompt.prompt();

	deferredPrompt.userChoice
		.then((choiceResult) => {
			console.log(choiceResult.outcome);
			deferredPrompt = null;
		});
}
