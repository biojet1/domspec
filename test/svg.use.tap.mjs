import tap from 'tap';
import { DOMParser } from '../dist/dom-parse.js';

const parser = new DOMParser();

tap.test('Use', function (t) {
	const document = parser.parseFromString(`
<svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle" cx="5" cy="5" r="4" stroke="blue"/>
  <use id="use1" href="#myCircle" x="10" fill="blue"/>
  <use id="use2" href="#myCircle" x="20" fill="white" stroke="red"/>
  <!--
stroke="red" will be ignored here, as stroke was already set on myCircle.
Most attributes (except for x, y, width, height and (xlink:)href)
do not override those set in the ancestor.
That's why the circles have different x positions, but the same stroke value.
  -->
</svg>
		`);
	const { myCircle, use1, use2 } = document.all;

	t.same(use1.hrefElement.id, 'myCircle');
	t.same(use2.hrefElement.id, 'myCircle');
	t.same(use2.hrefElement.id, 'myCircle');

	t.same(myCircle.shapeBox().toArray(), [5 - 4, 5 - 4, 4 * 2, 4 * 2]);
	t.same(use1.shapeBox().toArray(), [11, 1, 8, 8]);
	t.same(use2.shapeBox().toArray(), [21, 1, 8, 8]);

	t.end();
});

tap.test('size', function (t) {
	const doc = parser.parseFromString(
		`<svg xmlns="http://www.w3.org/2000/svg" width="2in" height="3in"/>`,
	);
	const top = doc.documentElement;
	t.same(top.shapeBox().toArray(), [0, 0, 2 * 96, 3 * 96]);
	t.end();
});

tap.test('Use+Symbol', async function (t) {
	const document = await parser.parseFile(new URL('res/symbol.svg', import.meta.url));
	const { U1, U2, U3, U4, U5, G1, G2 } = document.all;
	t.same(U1.hrefElement.id, 'myDot');
	t.same(U5.hrefElement.id, 'myDot');
	t.same(U1._shapeBox().toArray(), [5, 5, 10, 10]);
	t.same(U2._shapeBox().toArray(), [20, 5, 10, 10]);
	t.same(U3._shapeBox().toArray(), [35, 5, 10, 10]);
	t.same(U4._shapeBox().toArray(), [50, 5, 10, 10]);
	t.same(U5._shapeBox().toArray(), [65, 5, 10, 10]);
	t.same(G1._shapeBox().toArray(), [35, 5, 10, 10]);
	t.same(G2._shapeBox().toArray(), [50, 5, 25, 10]);
	t.end();
});
