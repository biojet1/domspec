const madge = require('madge');

madge('dist/css/index.js')
	.then((res) => res.image('/tmp/madge.svg'))
	.then((writtenImagePath) => {
		console.log('Image written to ' + writtenImagePath);
	});