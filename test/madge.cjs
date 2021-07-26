const madge = require('madge');

madge('/mnt/META/wrx/ts/svgdom-ts/dist/interface/html/document.js')
	.then((res) => res.image('/tmp/image.svg'))
	.then((writtenImagePath) => {
		console.log('Image written to ' + writtenImagePath);
	});