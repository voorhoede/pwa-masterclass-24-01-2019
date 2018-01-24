const fs = require('fs');

const revConfig = require('./rev-config');

module.exports = function revUrl(url) {
	const revManifest = JSON.parse(fs.readFileSync(`${revConfig.outputDir}${revConfig.manifestFilename}`, {encoding: 'utf-8'}));
	url = url.startsWith('/') ? url.substr(1) : url;
	if (revManifest.hasOwnProperty(url)) {
		const revUrl = revManifest[url];
		const revFile = fs.statSync(revConfig.outputDir + revUrl);
		if (revFile.isFile()) {
			return `/${revUrl}`;
		}
	}
	return `/${url}`;
};
