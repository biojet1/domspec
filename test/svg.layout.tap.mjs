import fs from 'fs';
import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Box, Matrix } from 'svggeom';
import { SVGLayout } from '../dist/svg/layout.js';

class Lay extends SVGLayout {
	trans(m, node) {
		const [P, M] = this.pairTM(node);
		if (M.isIdentity) {
			node._ownTM = P.inverse().cat(m);
		} else {
			const T = P.cat(M);
			const R = P.cat(M);
			// node._ownTM =P.inverse().cat(m).cat(M)
			// node._ownTM = R.inverse().cat(m).cat(P).inverse();
			if (P.isIdentity) {
				// node._ownTM = M.cat(P.inverse().cat(m));
				// 	// node._ownTM = m.cat(M);
				node._ownTM = M.cat(m);
			} else {
				// 	node._ownTM = P.cat(M).inverse().cat(m).cat(P.inverse());
				node._ownTM = P.cat(M).inverse().cat(m).cat(P).inverse();
			}
			// node._ownTM = P.inverse().cat(m).cat(M); // OK
		}
		// console.log('trans', node.id, `[${P.describe()}] ${m.describe()} [${M.describe()}] -> ${node._ownTM.describe()}`);
	}
}

const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
	t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

tap.test('Geoms 1', function (t) {
	const document = parser.parseFromString(
		fs.readFileSync('test/res/viewport.svg', {
			encoding: 'utf-8',
		})
	);
	const svg = document.documentElement;
	const V1 = document.getElementById('V1');
	const V3 = document.getElementById('V3');
	const C1 = document.getElementById('C1');
	const C2 = document.getElementById('C2');
	const C3 = document.getElementById('C3');
	const C4 = document.getElementById('C4');
	const R1 = document.getElementById('R1');
	const R2 = document.getElementById('R2');
	const R3 = document.getElementById('R3');
	const R5 = document.getElementById('R5');
	const R6 = document.getElementById('R6');

	let lay = new Lay(svg);
	[
		['C4', 0, 0, 0, 0],
		['C1', 114.61666870117188, 34.633331298828125, 70.76666259765625, 70.75],
		['C2', 15, 30, 80, 80],
		['V1', 200, 0, 100, 400],
		['C3', 204.6666717529297, 154.6666717529297, 90.66665649414062, 90.66665649414062],
		['R1', 200, 160, 50, 40],
		['R3', 250, 160, 50, 40],
		['R4', 200, 200, 50, 40],
		['V2', 0, 200, 300, 100],
		['C5', 100, 200, 100, 100],
		['V3', 100, 200, 100, 100],
		['L1', 100, 225, 50, 50],
		['C6', 140, 240, 20, 20],
		['R5', 200, 160, 50, 40],
		['R6', 250, 200, 50, 40],
	].forEach(([id, x, y, w, h]) => {
		const v = document.getElementById(id);
		const b = Box.new(x, y, w, h);
		const r = lay.boundingBox(v);
		eqBox(t, b, r.isValid() ? r : Box.empty(), x - ~~x === 0 ? 1e-9 : 1, id);
	});
	// lay.transform(Matrix.translate(0, -40), R5);
	// console.log(Matrix.translate(50).describe())
	// lay.transform(Matrix.translate(-50), R6);
	// console.log(Matrix.translate(-50));
	// t.same(R5._ownTM.describe(), 'translate(0 -40)');
	// t.same(R6._ownTM.describe(), 'translate(0 40)');
	// lay.saveTM('A', R5, R6);
	// console.log(R6.outerHTML);
	// lay.align({ hGap: 5 });
	{
		const LV3 = new Lay(V3);

		[
			['C6', 4, 4, 2, 2],
			['L1', 0, 2.5, 5, 5],
		].forEach(([id, x, y, w, h]) => {
			const v = document.getElementById(id);
			const b = Box.new(x, y, w, h);
			const r = LV3.boundingBox(v);
			eqBox(t, b, r.isValid() ? r : Box.empty(), x - ~~x === 0 ? 1e-9 : 1, id);
		});
	}

	t.end();
});
