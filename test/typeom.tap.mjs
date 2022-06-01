import tap from 'tap';
import { CSS, CSSUnitValue } from '../dist/all.js';
import { DOMParser } from '../dist/dom-parse.js';
const parser = new DOMParser();
const document = parser.parseFromString('<html/>', 'text/html');

tap.test('CSS', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	// console.info('asm', asm);
	// console.info('div.style', div.style);
	// console.info('div.style', div.style.constructor);
	// console.info('div.style.asm', typeof div.style.asm);
	asm.set('padding-top', CSS.px(42));
	t.same(`${asm.get('padding-top')}`, '42px');
	t.same(div.style.paddingTop, '42px');
	const px = CSS.px(9);
	asm.set('padding-left', px);
	t.same(div.style.paddingLeft, '9px');
	px.value++;
	t.same(div.style.paddingLeft, '10px');
	px.unit = 'em';
	t.same(div.style.getPropertyValue('padding-left'), '10em');
	t.end();
});

tap.test('CSS', function (t) {
	let div = document.createElement('div');
	t.same(div.style.length, 0);
	div.style['padding'] = '';
	t.same(div.style.length, 0);
	div.style['padding'] = '1px 2px 3px 4px';
	t.end();
});

tap.test('CSSUnitValue', function (t) {
	t.match(CSSUnitValue.parse('2px'), { value: 2, unit: 'px' });
	t.match(CSSUnitValue.parse('2.4'), { value: 2.4, unit: 'number' });
	t.match(CSSUnitValue.parse('9%'), { value: 9, unit: 'percent' });
	t.match(CSSUnitValue.parse('1'), { value: 1, unit: 'number' });
	t.notOk(CSSUnitValue.parse('lemon'));
	t.notOk(CSSUnitValue.parse('2km'));
	t.end();
});

// var div = document.getElementById('target') || document.createElement('div');
// div.style[property] = "";
// try {
//     const expectedLength = div.style.length;
//     div.style[property] = value;
//     assert_true(CSS.supports(property, value));
//     for (let longhand of Object.keys(longhands).sort()) {
//         div.style[longhand] = "";
//     }
//     assert_equals(div.style.length, expectedLength);
// } finally {
//     div.style[property] = "";
// }
