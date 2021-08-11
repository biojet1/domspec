const madge = require('madge');

madge('dist/interface/dom-parse.js')
	.then((res) => res.image('/tmp/madge.svg'))
	.then((writtenImagePath) => {
		console.log('Image written to ' + writtenImagePath);
	});