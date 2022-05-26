import tap from 'tap';
import { DOMParser } from '../../dist/dom-parse.js';
const parser = new DOMParser();

tap.test('CSS', function (t) {
	parser.parseFile(`test/css/style.dom.html`, 'text/html').then((document) => {
		// let div = document.createElement('div');
		// const asm = div.attributeStyleMap;
		// console.info('styleSheets', document.styleSheets);
		const ss = document.styleSheets['0'];
		t.same(ss.cssRules[1].constructor.name, 'CSSSupportsRule');
		t.match(
			ss.cssRules[1].cssText,
			/^@supports\s*\(margin:\s*0\)\s*{\s*div\s*{\s*background-color:\s*green;\s*}\s*}$/,
		);
		t.match(ss.cssRules[1].conditionText, /^\(margin:\s*0\)$/);

		t.same(ss.cssRules[0].constructor.name, 'CSSStyleRule');
		t.same(ss.cssRules[0].selectorText, 'p');
		t.match(ss.cssRules[0].cssText, /p\s*{\s*color:\s*red;\s*}/);
		t.same(ss.cssRules[0].parentRule, null);
		t.strictSame(ss.cssRules[0].parentStyleSheet, ss);

		t.same(ss.cssRules[2].constructor.name, 'CSSKeyframesRule');

		t.same(ss.cssRules[3].constructor.name, 'CSSMediaRule');
		t.same(ss.cssRules[3].conditionText, 'screen and (min-width: 900px)');
		t.same(ss.cssRules[3].media.mediaText, 'screen and (min-width: 900px)');
		t.same(ss.cssRules[3].media[0], 'screen and (min-width: 900px)');
		t.same(ss.cssRules[3].media.length, 1);
		ss.cssRules[3].media.appendMedium('what');
		t.same(ss.cssRules[3].media[1], 'what');
		t.same(ss.cssRules[3].media.indexOf('what'), 1);

		t.same(ss.cssRules[3].media[0], 'screen and (min-width: 900px)');
		t.same(ss.cssRules[3].media.length, 2);
		t.same(ss.cssRules[3].media.mediaText, 'screen and (min-width: 900px), what');
		ss.cssRules[3].media.deleteMedium('screen and (min-width: 900px)');
		t.same(ss.cssRules[3].media[0], 'what');
		t.same(ss.cssRules[3].media.length, 1);
		t.same(ss.cssRules[3].media.mediaText, 'what');

		// MediaList {0: 'screen and (min-width: 900px)', 1: 'what', length: 2, mediaText: 'screen and (min-width: 900px), what'}
		// MediaList {0: 'screen and (min-width: 900px)', length: 1, mediaText: 'screen and (min-width: 900px)'}
		// CSSMediaRule {media: MediaList, conditionText: 'screen and (min-width: 900px)',

		t.end();
	});
});
