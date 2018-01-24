module.exports = function formatDate(date) {
	const dateObject = new Date(date);
	const monthNames = [
		"Januari", "Februari", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December",
	];
	const dayNames = [
		"Monday", "Tuesday", "Wednesday",
		"Thursday", "Friday", "Saturday", "Sunday",
	];
	const day = dayNames[dateObject.getDay()];
	const dateNumber = dateObject.getDate();
	const month = monthNames[dateObject.getMonth()];
	const hours = dateObject.getHours();
	const minutes = dateObject.getMinutes();
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

	return `${day} ${month} ${dateNumber} at ${hours}:${formattedMinutes}`;
};
