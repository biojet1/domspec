import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Matrix, MatrixInterpolate } from 'svggeom';
import { createWriteStream, writeFileSync, WriteStream } from 'fs';
import fs from 'fs';

const parser = new DOMParser();

tap.test('transform2', function (t) {
	const doc = parser.parseFromString(
		fs.readFileSync('test/res/transform2.svg', {
			encoding: 'utf-8',
		})
	);
	const top = doc.documentElement;
	// const U1 = doc.getElementById('U1');
	// const VR1 = doc.getElementById('VR1');
	const R3 = doc.getElementById('R3');
	const R1 = doc.getElementById('R1');
	const R2 = doc.getElementById('R2');
	const G1 = doc.getElementById('G1');
	const G2 = doc.getElementById('G2');
	const G4 = doc.getElementById('G4');
	const V1 = doc.getElementById('V1');

	[
		['R0', 1, 0, 0, 1, 0, 0],
		['G1', 1, 0, 0, 1, 100, 0],
		['G2', 1, 0, 0, 1, 100, 80],
		['G3', 1, 0, 0, 1, 100, 80],
		['G4', 1, 0, 0, 1, 50, 30],
		['R1', 1, 0, 0, 1, 50, 30],
		['R2', 1, 0, 0, 1, 40, 20],
		['R3', 1, 0, 0, 1, 100, 80],
		['R4', 1, 0, 0, 1, 90, 70],
		['V1', 1, 0, 0, 1, 100, 0],
		['RA', 0.5, 0, 0, 0.5, 125, 0],
		['RX', 0.5, 0, 0, 0.5, 125, 0],
		['V2', 0.5, 0, 0, 0.5, 125, 50],
		['RB', 0.5, 0, 0, 0.5, 125, 50],
	].forEach(([id, a, b, c, d, e, f]) => {
		const v = doc.getElementById(id);
		const r = v.shapeBox(true);

		t.same(v.composeTM().toString(), Matrix.new([a, b, c, d, e, f]).toString(), `composeTM ${id}`);
	});
	t.same(R1.composeTM(G4).toString(), Matrix.identity().toString());
	t.same(R2.composeTM(G4).toString(), Matrix.parse(`translate(-10 -10)`).toString());
	t.same(R1.composeTM(G2).toString(), Matrix.parse(`translate(-50 -50)`).toString(), `R1.composeTM(G2)`);
	t.same(
		R2.composeTM(G2).toString(),
		Matrix.parse(`translate(-50 -50) translate(-10 -10)`).toString(),
		`R2.composeTM(G2)`
	);
	t.throws(
		function () {
			R1.composeTM(R2);
		},
		{ message: /not reached/ }
	);

	t.same(top.composeTM().toString(), Matrix.identity().toString());
	t.same(V1.composeTM().toString(), Matrix.parse(`translate(100)`).toString());

	t.end();
});

if (0) {
	Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
		const m = v.getScreenCTM();
		const r = v.getBBox();
		return [v.id, m.a, m.b, m.c, m.d, m.e, m.f];
	});
}
