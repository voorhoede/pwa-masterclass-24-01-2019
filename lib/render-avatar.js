const revUrl = require('./rev-url');

module.exports = function renderAvatar(string) {
	return !!string ? string : revUrl('/assets/images/avatar.svg');
};
