import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Box, Matrix, MatrixInterpolate } from 'svggeom';
import { createWriteStream, writeFileSync, WriteStream } from 'fs';
import fs from 'fs';

const parser = new DOMParser();

tap.test('transform2', function (t) {
	function eqBox(a, b, epsilon = 0, tag) {
		t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
	}
	const doc = parser.parseFromString(
		fs.readFileSync('test/res/transform2.svg', {
			encoding: 'utf-8',
		})
	);
	const top = doc.documentElement;
	const R0 = doc.getElementById('R0');
	const R1 = doc.getElementById('R1');
	const R2 = doc.getElementById('R2');
	const R3 = doc.getElementById('R3');
	const G1 = doc.getElementById('G1');
	const G2 = doc.getElementById('G2');
	const G4 = doc.getElementById('G4');
	const V1 = doc.getElementById('V1');

	[
		['R0', 1, 0, 0, 1, -50, -10],
		['G1', 1, 0, 0, 1, 50, -10],
		['G2', 1, 0, 0, 1, 50, 70],
		['G3', 1, 0, 0, 1, 50, 70],
		['G4', 1, 0, 0, 1, 0, 20],
		['R1', 1, 0, 0, 1, 0, 20],
		['R2', 1, 0, 0, 1, -10, 10],
		['R3', 1, 0, 0, 1, 50, 70],
		['R4', 1, 0, 0, 1, 40, 60],
		['V1', 1, 0, 0, 1, 50, -10],
		['RA', 0.5, 0, 0, 0.5, 75, -10],
		['RX', 0.5, 0, 0, 0.5, 75, -10],
		['V2', 0.5, 0, 0, 0.5, 75, 40],
		['RB', 0.5, 0, 0, 0.5, 75, 40],
	].forEach(([id, a, b, c, d, e, f]) => {
		const v = doc.getElementById(id);
		// const r = v.shapeBox(true);
		const m = Matrix.new([a, b, c, d, e, f]).toString();
		t.same(v.composeTM().toString(), m, `composeTM ${id}`);
		const w = top.innerTM;
		const u = v.rootTM;

		t.same(w.multiply(u).toString(), m, `rootTM ${id} ${w} ${u}`);
	});

	t.same(R0.composeTM(R0.farthestViewportElement).toString(), Matrix.identity().toString());
	t.same(R1.composeTM(G4).toString(), Matrix.identity().toString());
	t.same(R2.composeTM(G4).toString(), Matrix.parse(`translate(-10 -10)`).toString());
	t.same(R1.composeTM(G2).toString(), Matrix.parse(`translate(-50 -50)`).toString(), `R1.composeTM(G2)`);
	t.same(
		R2.composeTM(G2).toString(),
		Matrix.parse(`translate(-50 -50) translate(-10 -10)`).toString(),
		`R2.composeTM(G2)`
	);
	t.same(
		R2.rootTM.toString(),
		Matrix.parse(`translate(100) translate(0 80) translate(-50 -50) translate(-10 -10)`).toString(),
		`R2.rootTM()`
	);

	t.throws(() => R1.composeTM(R2), { message: /not reached/ });

	t.same(top.composeTM().toString(), Matrix.identity().toString());
	// t.same(V1.composeTM().toString(), Matrix.parse(`translate(100)`).toString());

	[
		['R0', 0, 0, 300, 400],
		['R1', 10, 20, 40, 60],
		['R2', 10, 20, 40, 60],
		['R3', 10, 20, 40, 60],
		['R4', 10, 20, 40, 60],
		['RA', 50, 50, 30, 30],
		['RX', 0, 0, 300, 400],
		['RB', 50, 50, 30, 30],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v.objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});
	[
		['G1', -50, 40, 100, 120],
		['G2', -50, -40, 100, 120],
		['G3', -50, -40, 100, 120],
		['G4', 0, 10, 50, 70],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v.objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});

	[
		['V1', 0, 0, 300, 400],
		['V2', 50, 50, 30, 30],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v.objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});
	//////////////////////
	[
		['R0', 0, 0, 300, 400],
		['R1', 60, 50, 40, 60],
		['R2', 50, 40, 40, 60],
		['R3', 110, 100, 40, 60],
		['R4', 100, 90, 40, 60],
		['RA', 150, 25, 15, 15],
		['RX', 125, 0, 150, 200],
		['RB', 150, 75, 15, 15],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const b = Box.new(x, y, w, h);
		eqBox(b, v._shapeBox(), 0, id);
	});
	t.end();
});

if (0) {
	Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
		const m = v.getScreenCTM();
		const r = v.getBBox();
		return [v.id, m.a, m.b, m.c, m.d, m.e, m.f];
	});
	Array.from(document.documentElement.querySelectorAll(`*[id]`))
		.map((v) => {
			if (v.getBBox) {
				const r = v.getBBox();
				return [v.id, r.x, r.y, r.width, r.height];
			}
		})
		.filter((v) => !!v);
	document.documentElement.querySelectorAll(`rect`).forEach((v) => {
		v.style.fill = 'grey';
		v.style.stroke = 'none';
	});

	Array.from(document.documentElement.querySelectorAll(`rect[id]`)).map((v) => {
		const r = v.getBBox();
		return [v.id, r.x, r.y, r.width, r.height];
	});

	Array.from(document.documentElement.querySelectorAll(`rect[id]`)).map((v) => {
		const r = v.getBoundingClientRect();
		return [v.id, r.x + 50, r.y + 10, r.width, r.height];
	});
	Array.from(document.documentElement.querySelectorAll(`g[id]`)).map((v) => {
		const r = v.getBBox();
		return [v.id, r.x, r.y, r.width, r.height];
	});
	Array.from(document.documentElement.querySelectorAll(`svg[id]`)).map((v) => {
		const r = v.getBBox();
		return [v.id, r.x, r.y, r.width, r.height];
	});
}