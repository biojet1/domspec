import fs from 'fs';
import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Box } from 'svggeom';

const parser = new DOMParser();
function closeEnough(t, a, b, threshold = 1e-6) {
	t.ok(Math.abs(b - a) <= threshold, `${a} ${b} ${threshold}`);
}
function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

tap.test('Use+Symbol', function (t) {
	const document = parser.parseFromString(fs.readFileSync('test/res/viewport.svg', { encoding: 'utf-8' }));
	const svg = document.documentElement;
	const V1 = document.getElementById('V1');
	const C1 = document.getElementById('C1');
	const C2 = document.getElementById('C2');
	const C3 = document.getElementById('C3');
	const C4 = document.getElementById('C4');
	const R1 = document.getElementById('R1');
	const R2 = document.getElementById('R2');
	const R3 = document.getElementById('R3');

	t.same(V1.x.baseVal.value, 200, `V1.x`);
	t.same(V1.y.baseVal.value, 0, `V1.y`);
	t.same(V1.width.baseVal.value, 100, `V1.width`);
	t.same(V1.height.baseVal.value, 400, `V1.height`);

	closeEnough(t, C1.r.baseVal.value, Math.sqrt((300 * 300 + 400 * 400) / 2) * 0.1, 1e-2);
	t.same(C4.r.baseVal.value, 0);
	t.same(C2.r.baseVal.value, 40);

	t.same(V1._shapeBox().toArray(), [200, 0, 100, 400]);

	t.same(R3.x.baseVal.value, 5);
	t.same(R3.y.baseVal.value, 0);
	t.same(R3.width.baseVal.value, 5);
	t.same(R3.height.baseVal.value, 4);

	t.same(R1.x.baseVal.value, 0);
	t.same(R1.y.baseVal.value, 0);
	t.same(R1.width.baseVal.value, 5);
	t.same(R1.height.baseVal.value, 4);

	// // t.same(R1._shapeBox().toArray(), [200, 175, 50, 40]);
	// // t.same(R3._shapeBox().toArray(), [250, 175, 50, 40]);

	[
		// ['C4', 0, 0, 0, 0],
		// ['C1', 114.61666870117188, 34.633331298828125, 70.76666259765625, 70.75],
		// ['C2', 15, 30, 80, 80],
		// ['V1', 200, 0, 100, 400],
		// ['C3', 204.6666717529297, 154.6666717529297, 90.66665649414062, 90.66665649414062],
		['R1', 200, 160, 50, 40],
		['R3', 250, 160, 50, 40],
		['R4', 200, 200, 50, 40],
	].forEach(([id, x, y, w, h]) => {
		const v = document.getElementById(id);
		const b = Box.new(x, y, w, h);
		eqBox(t, b, v._shapeBox(), 1e-9, id);
	});

	t.end();
});

if (0) {
	Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
		const r = v.getBoundingClientRect();
		v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
		return [v.id, r.x, r.y, r.width, r.height];
	});
}
