module.exports = {
	globDirectory: 'out/',
	globPatterns: [
		'**/*.{js,css,html,png,ico,json}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'out/sw.js'
};