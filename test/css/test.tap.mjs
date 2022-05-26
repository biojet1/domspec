import tap from 'tap';
import * as CSSOM from '../../dist/css/index.js';

tap.test('MediaList: appendMedium, deleteMedium, mediaText', function (t) {
	const m = new CSSOM.MediaList();
	t.same(m.length, 0);

	m.appendMedium('handheld');
	m.appendMedium('screen');
	m.appendMedium('only screen and (max-device-width: 480px)');

	m.deleteMedium('screen');
	t.same(m[2], undefined);
	t.same(m[1], 'only screen and (max-device-width: 480px)');
	t.same(m[0], 'handheld');
	t.same(m.length, 2);
	t.same(m.mediaText, 'handheld, only screen and (max-device-width: 480px)');

	m.mediaText = ' (min-height: 680px), screen and (orientation: portrait)';
	t.same(m.length, 2);
	t.same(m[2], undefined);
	t.same(m[1], 'screen and (orientation: portrait)');
	t.same(m[0], '(min-height: 680px)');
	t.same(m.length, 2);
	t.same(m.mediaText, '(min-height: 680px), screen and (orientation: portrait)');
	t.end();
});

function button(t) {
	const rule = new CSSOM.CSSImportRule();
	rule.cssText = t.name;
	t.same(rule.href, 'button.css');
	t.same(Array.from(rule.media), []);
	t.match(rule.cssText, /^@import\s+url\("?button\.css"?\);$/);
	t.end();
}

tap.test('@import url(button.css);', button);
tap.test('@import url("button.css");', button);
tap.test("@import url('button.css'); ", button);
tap.test(' @import "button.css";', button);
tap.test("@import 'button.css';", button);

tap.test('@import url(size/medium.css) all;', function (t) {
	const rule = new CSSOM.CSSImportRule();
	rule.cssText = t.name;
	t.same(rule.href, 'size/medium.css');
	t.same(rule.media.mediaText, 'all');
	t.same(Array.from(rule.media), ['all']);
	t.match(rule.cssText, /^@import\s+url\("?size\/medium\.css"?\)\s+all;$/);
	t.end();
});

tap.test('@import url(button.css;', function (t) {
	const rule = new CSSOM.CSSImportRule();
	t.throws(() => {
		rule.cssText = t.name;
		console.log(rule.href);
	}, SyntaxError);
	t.end();
});

tap.test('@import url(old.css) screen and (color), projection and (min-color: 256);', function (t) {
	const rule = new CSSOM.CSSImportRule();
	rule.cssText = t.name;
	t.same(rule.href, 'old.css');
	t.same(rule.media.mediaText, 'screen and (color), projection and (min-color: 256)');
	t.same(Array.from(rule.media), ['screen and (color)', 'projection and (min-color: 256)']);
	t.end();
});

tap.test('color: pink; outline: 2px solid red;', function (t) {
	const rule = CSSOM.CSSStyleDeclaration.new();
	rule.cssText = t.name;
	t.same(rule.color, 'pink');
	t.same(rule.cssText, t.name);
	t.end();
});

tap.test(
	'setProperty, removeProperty, cssText, getPropertyValue, getPropertyPriority',
	function (t) {
		const d = CSSOM.CSSStyleDeclaration.new();
		d.setProperty('color', 'purple');
		t.same(d[0], 'color');
		t.same(d[1], undefined);
		t.same(d[-1], undefined);
		t.same(d.length, 1);
		t.same(d.getPropertyPriority('color'), '');
		t.same(d.getPropertyValue('color'), 'purple');

		{
			d.setProperty('width', '128px', 'important');
			t.same(d[0], 'color');
			t.same(d[1], 'width');
			t.same(d[2], undefined);
			t.same(d.getPropertyPriority('color'), '');
			t.same(d.getPropertyValue('color'), 'purple');
			t.same(d.getPropertyPriority('width'), 'important');
			t.same(d.getPropertyValue('width'), '128px');
		}
		{
			d.setProperty('opacity', 0);
			t.same(d.cssText, 'color: purple; width: 128px !important; opacity: 0;');
			t.same(d.getPropertyValue('color'), 'purple');
			t.same(d.getPropertyValue('width'), '128px');
			t.same(d.getPropertyValue('opacity'), '0');
			t.same(d.getPropertyValue('position'), '');
			t.same(d.getPropertyPriority('color'), '');
			t.same(d.getPropertyPriority('position'), '');
			t.same(d.getPropertyPriority('width'), 'important');
		}
		{
			d.setProperty('color', 'green');
			d.removeProperty('width');
			d.removeProperty('opacity');
			t.same(d.cssText, 'color: green;');
		}
		t.end();
	},
);

tap.test('CSSStyleRule', function (t) {
	const rule = new CSSOM.CSSStyleRule();
	rule.cssText = '/**/h1:first-of-type {\n\tfont-size: 3em\n;};';
	t.same(rule.cssText, 'h1:first-of-type {font-size: 3em;}');
	t.same(rule.selectorText, 'h1:first-of-type');
	rule.selectorText = 'h1.title';
	t.same(rule.cssText, 'h1.title {font-size: 3em;}');
	t.same(rule.selectorText, 'h1.title');


	rule.cssText = `h2 {font-family: 'Times New Roman', Helvetica Neue, "sans-serif"; display: inline-block !important; vertical-align: middle !important }`;
	t.same(rule.selectorText, 'h2');
	t.end();
});

tap.test('CSSStyleSheet: insertRule, deleteRule', function (t) {
	const s = new CSSOM.CSSStyleSheet();
	t.same(s.cssRules, []);
	{
		s.insertRule('a {color: blue}', 0);
		t.same(s.cssRules.length, 1);
		s.insertRule('a *:first-child, a img {border: none}', 1);
		t.same(s.cssRules.length, 2);
		s.deleteRule(1);
		t.same(s.cssRules.length, 1);
		s.deleteRule(0);
		t.same(s.cssRules, []);
	}
	t.end();
});

tap.test('should correctly set the parent stylesheet', function (t) {
	const s = new CSSOM.CSSStyleSheet();
	s.insertRule('a {color: blue}', 0);
	t.strictSame(s.cssRules[0].parentStyleSheet, s);
	t.end();
});

// tap.test('CSSFontFaceRule', function (t) {
// });

