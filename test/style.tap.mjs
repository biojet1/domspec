import tap from 'tap';
import { Document } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { CSSStyleDeclaration } from '../dist/attr-style.js';
const parser = new DOMParser();
const document = parser.parseFromString('<html/>', 'text/html');

function assert(a, b, msg) {
	tap.strictSame(a, b, msg);
}
console.log(CSSStyleDeclaration.constructor);
let node = document.createElement('div');
{
	assert(node.style.cssText, '', 'empty style');
	node.style.cssText = 'background-color: blue';
	assert(node.style.backgroundColor, 'blue', 'style getter');
	assert(node.style.toString(), 'background-color: blue;', 'cssText setter');
	assert([...node.style].join(','), 'background-color', 'iterable');
	assert(node.style.length, 1, 'style.length');
	assert(node.style[0], 'background-color', 'style[0]');
	node.getAttributeNode('style').value = 'color: red';
	assert(node.style.toString(), 'color: red;', 'cssText indirect setter');
	let style = document.createAttribute('style');
	node.setAttributeNode(style);
	assert(node.toString(), '<div></div>', 'cssText cleanup');
	node.style.backgroundColor = 'green';
	// console.dir(style, {depth:0});
	assert(
		node.attributeStyleMap.get('background-color').toString(),
		'green',
		'attributeStyleMap get',
	);
	assert(
		node.toString(),
		'<div style="background-color: green;"></div>',
		'cssText indirect property',
	);
	node.removeAttributeNode(style);
	node.style.color = 'green';
	assert(node.toString(), '<div style="color: green;"></div>', 'cssText indirect setter again');
	node.style.color = null;
	assert(node.toString(), '<div></div>', 'setter as null');
	node.attributeStyleMap.set('color', 'red');
	assert(node.style.color, 'red', 'attributeStyleMap set');
	assert(node.attributeStyleMap.get('color').toString(), 'red', 'attributeStyleMap get');
	node.attributeStyleMap.delete('color');
	// assert(node.style.color, '', 'attributeStyleMap set');
	node.style.display = 'none';
	assert(node.toString(), `<div style="display: none;"></div>`, 'display=none');
	assert(node.style[0], `display`, '.style[0]');
	assert(node.style[-1], undefined, '.style[-1]');
	assert(node.style.constructor.name, 'CSSStyleDeclaration', 'style.constructor');
	node.style.display = '';
	assert(node.toString(), '<div></div>', "setter as ''");
}
// node.id = "";
// node.className = "";
// assert(node.toString(), "<div></div>", "setter as null");
tap.test('invalid values', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	t.throws(() => asm.set('color', null), TypeError);
	t.throws(() => asm.set('color', undefined), TypeError);
	t.throws(() => asm.set('color', ''), TypeError);
	t.end();
});
tap.test('toString', function (t) {
	let div = document.createElement('div');
	t.strictSame(node.getAttributeNode('style').value, '');
	const asm = div.attributeStyleMap;
	asm.set('color', 'pink');
	t.match(asm.toString(), /color: pink;?/);
	t.match(div.getAttributeNode('style').value, asm.toString());
	asm.delete('color');
	t.match(asm.toString(), '');
	div.style.setProperty('background-color', 'green', 'important');
	t.match(asm.toString(), /^background-color: green !important;?$/);
	t.end();
});
tap.test('parsing', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	div.style = 'background-color: blue !important';
	t.match(asm.toString(), /^background-color: blue !important;?$/);
	t.strictSame(asm.get('background-color').toString(), 'blue');
	t.same(div.style.getPropertyPriority('background-color'), 'important');
	div.style.setProperty('background-color', 'blue');
	t.same(div.style.getPropertyPriority('background-color'), '');
	div.style.setProperty('background-color', 'blue', 'important');
	t.same(div.style.getPropertyPriority('background-color'), 'important');
	div.style.setProperty('background-color', 'red', 'important');
	t.same(div.style.getPropertyPriority('background-color'), 'important');
	t.strictSame(asm.get('background-color').toString(), 'red');
	div.style.setProperty('background-color', 'green');
	t.same(div.style.getPropertyPriority('background-color'), '');
	t.strictSame(asm.get('background-color').toString(), 'green');
	div.style.setProperty('background-color', null);
	t.same(asm.get('background-color'), null);
	div.style.color = 'orange';
	div.style.setProperty('color', 'orange', 'important');
	t.same(div.style.getPropertyPriority('color'), 'important');
	t.strictSame(asm.get('color').toString(), 'orange');
	t.end();
});
tap.test('shorthand', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	t.same([...div.style], []);
	div.style.setProperty('margin', '2px 1em 0 auto', 'important');
	t.same(asm.get('margin-top') + '', '2px');
	t.same(asm.get('margin-right') + '', '1em');
	t.same(asm.get('margin-bottom') + '', '0');
	t.same(asm.get('margin-left') + '', 'auto');
	t.match(asm.toString(), /^margin: 2px 1em 0 auto !important;?$/);

	// console.log(div.getAttribute('style'));
	// console.log(asm);
	t.same(div.style.getPropertyPriority('margin-left'), 'important');
	div.style.setProperty('padding', '1em auto 2em');
	t.same(asm.get('padding-top') + '', '1em');
	t.same(asm.get('padding-right') + '', 'auto');
	t.same(asm.get('padding-bottom') + '', '2em');
	t.same(asm.get('padding-left') + '', 'auto');
	div.style.padding = '';
	t.same(div.style.paddingLeft, '');
	t.same(div.style.paddingRight, '');
	t.same(div.style.paddingTop, '');
	t.same(div.style.paddingBottom, '');
	t.end();
});
tap.test('delete', function (t) {
	let div = document.createElement('div');
	const asm = div.attributeStyleMap;
	t.same(div.style.removeProperty('color'), '');
	div.style = 'background-color: blue !important';
	div.style.setProperty('background-color', undefined);
	t.same(div.style.getPropertyValue('background-color'), 'blue');
	div.style.setProperty('background-color', null);
	t.same(div.style.getPropertyValue('background-color'), '');
	div.style.setProperty('background-color', 'magenta');
	t.same(div.style.getPropertyValue('background-color'), 'magenta');
	t.same(div.style.removeProperty('background-color'), 'magenta');
	t.same(div.style.getPropertyValue('background-color'), '');
	t.end();
});

// tap.test('self', function (t) {
// 	let { style } = document.createElement('div');
// 	let { self } = style;
// 	let s;
// 	// div.style is a Proxy
// 	// div.style.self is a Proxy target
// 	style.cssText = s = 'background-color: blue !important';
// 	t.same(self.cssText, s);
// 	t.same(style.cssText, s);
	
// 	self.cssText = s = 'color: pink';
// 	t.same(self.cssText, s);
// 	t.same(style.cssText, s);
// 	t.end();
// });

{
	assert(node.className, '', 'no class name');
	assert(node.classList.contains('tap'), false, 'no tap class');
	node.classList.add('a', 'tap', 'b');
	// console.dir(node.classList, {depth:1});
	assert(node.classList.value, 'a tap b', 'correct .value');
	assert(node.classList.length, 3, 'correct .length');
	assert(node.classList.contains('tap'), true, 'tap class');
	node.classList.toggle('tap');
	assert(node.classList.contains('tap'), false, 'no tap class again');
	node.classList.toggle('tap', false);
	assert(node.classList.contains('tap'), false, 'no tap class again 2');
	node.classList.toggle('tap');
	assert(node.classList.contains('tap'), true, 'tap class in');
	node.classList.toggle('tap', true);
	assert(node.classList.contains('tap'), true, 'tap class still in');
	node.classList.toggle('tap', false);
	node.classList.toggle('tap', true);
	node.classList.remove('tap');
	assert(node.classList.contains('tap'), false, 'no tap class one more time');
	assert(node.classList.replace('b', 'c'), true, 'replace happened');
	assert(node.classList.value, 'a c', 'correct .value again');
	assert(node.classList.replace('b', 'c'), false, 'replace did not happen');
	assert(node.classList.supports('whatever'), true, 'whatever');
	node.setAttribute('class', 'a b c');
	assert(node.getAttribute('class'), 'a b c');
	node.removeAttribute('class');
	assert(node.classList.length, 0);
	assert(node.getAttribute('class'), '');
}
{
	assert(Object.keys(node.dataset).length, 0, 'empty dataset');
	assert(node.dataset.tapValue, void 0, 'no tapValue');
	node.dataset.tapValue = 123;
	assert('tapValue' in node.dataset, true, 'dataset in trap');
	assert(node.getAttribute('data-tap-value'), '123', 'dataset.tapValue');
	// console.log(Object.keys(node.dataset), Object.getOwnPropertyNames(node.dataset))
	assert(Object.keys(node.dataset).length, 1, 'not empty dataset');
	delete node.dataset.tapValue;
	assert(Object.keys(node.dataset).length, 0, 'empty dataset again');
}
