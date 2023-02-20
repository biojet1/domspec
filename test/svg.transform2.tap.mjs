import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Box, Matrix } from "svggeom";
import { createWriteStream, writeFileSync, WriteStream } from "fs";
import fs from "fs";
const trsubs = [
	[
		"G1",
		["G2", 1, 0, 0, 1, 0, 80],
		["G3", 1, 0, 0, 1, 0, 80],
		["G4", 1, 0, 0, 1, -50, 30],
		["R1", 1, 0, 0, 1, -50, 30],
		["R2", 1, 0, 0, 1, -60, 20],
		["R3", 1, 0, 0, 1, 0, 80],
		["R4", 1, 0, 0, 1, -10, 70],
	],
	[
		"G2",
		["G3", 1, 0, 0, 1, 0, 0],
		["G4", 1, 0, 0, 1, -50, -50],
		["R1", 1, 0, 0, 1, -50, -50],
		["R2", 1, 0, 0, 1, -60, -60],
		["R3", 1, 0, 0, 1, 0, 0],
		["R4", 1, 0, 0, 1, -10, -10],
	],
	[
		"G3",
		["G4", 1, 0, 0, 1, -50, -50],
		["R1", 1, 0, 0, 1, -50, -50],
		["R2", 1, 0, 0, 1, -60, -60],
		["R3", 1, 0, 0, 1, 0, 0],
		["R4", 1, 0, 0, 1, -10, -10],
	],
	["G4", ["R1", 1, 0, 0, 1, 0, 0], ["R2", 1, 0, 0, 1, -10, -10]],
	[
		"V1",
		["RA", 1, 0, 0, 1, 0, 0],
		["RX", 1, 0, 0, 1, 0, 0],
		["G5", 1, 0, 0, 1, 0, 0],
		["RY", 1, 0, 0, 1, 0, 0],
		["V2", 1, 0, 0, 1, 0, 100],
		["RB", 1, 0, 0, 1, 0, 100],
	],
	["G5", ["RY", 1, 0, 0, 1, 0, 0]],
	["V2", ["RB", 1, 0, 0, 1, 0, 0]],
	[
		"VPA",
		["defs19", 1, 0, 0, 1, 0, 0],
		["R0", 1, 0, 0, 1, 0, 0],
		["G1", 1, 0, 0, 1, 100, 0],
		["G2", 1, 0, 0, 1, 100, 80],
		["G3", 1, 0, 0, 1, 100, 80],
		["G4", 1, 0, 0, 1, 50, 30],
		["R1", 1, 0, 0, 1, 50, 30],
		["R2", 1, 0, 0, 1, 40, 20],
		["R3", 1, 0, 0, 1, 100, 80],
		["R4", 1, 0, 0, 1, 90, 70],
		["V1", 1, 0, 0, 1, 100, 0],
		["RA", 0.5, 0, 0, 0.5, 125, 0],
		["RX", 0.5, 0, 0, 0.5, 125, 0],
		["G5", 0.5, 0, 0, 0.5, 125, 0],
		["RY", 0.5, 0, 0, 0.5, 125, 0],
		["V2", 0.5, 0, 0, 0.5, 125, 50],
		["RB", 0.5, 0, 0, 0.5, 125, 50],
	],
];
const parser = new DOMParser();

tap.test("transform2", function (t) {
	function eqBox(a, b, epsilon = 0, tag) {
		t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
	}
	const doc = parser.parseFromString(
		fs.readFileSync("test/res/transform2.svg", {
			encoding: "utf-8",
		})
	);
	const top = doc.documentElement;
	const R0 = doc.getElementById("R0");
	const R1 = doc.getElementById("R1");
	const R2 = doc.getElementById("R2");
	const G2 = doc.getElementById("G2");
	const G4 = doc.getElementById("G4");

	[
		["R0", 1, 0, 0, 1, -50, -10],
		["G1", 1, 0, 0, 1, 50, -10],
		["G2", 1, 0, 0, 1, 50, 70],
		["G3", 1, 0, 0, 1, 50, 70],
		["G4", 1, 0, 0, 1, 0, 20],
		["R1", 1, 0, 0, 1, 0, 20],
		["R2", 1, 0, 0, 1, -10, 10],
		["R3", 1, 0, 0, 1, 50, 70],
		["R4", 1, 0, 0, 1, 40, 60],
		["V1", 1, 0, 0, 1, 50, -10],
		["RA", 0.5, 0, 0, 0.5, 75, -10],
		["RX", 0.5, 0, 0, 0.5, 75, -10],
		["V2", 0.5, 0, 0, 0.5, 75, 40],
		["RB", 0.5, 0, 0, 0.5, 75, 40],
	].forEach(([id, a, b, c, d, e, f]) => {
		const v = doc.getElementById(id);
		// const r = v.shapeBox(true);
		const m = Matrix.new([a, b, c, d, e, f]).toString();
		// t.same(v.composeTM().toString(), m, `composeTM ${id}`);
		t.same(v.getScreenCTM().toString(), m, `getScreenCTM ${id}`);
		// t.same(v._composeTM().toString(), m, `_composeTM ${id}`);
		const w = top._vboxTM;
		// const u = v._rootTM;
		const u = _rootTM(v);

		t.same(w.cat(u).toString(), m, `_rootTM ${id} ${w} ${u}`);
	});

	// t.same(
	// 	R0.composeTM(R0.farthestViewportElement).toString(),
	// 	Matrix.identity().toString()
	// );
	t.same(R1._relTM(R1._ownTM, G4).toString(), Matrix.identity().toString());
	// t.same(
	// 	R2.composeTM(G4).describe(),
	// 	Matrix.parse(`translate(-10 -10)`).describe()
	// );
	// t.same(
	// 	R1.composeTM(G2).toString(),
	// 	Matrix.parse(`translate(-50 -50)`).toString(),
	// 	`R1.composeTM(G2)`
	// );
	// t.same(
	// 	R2.composeTM(G2).toString(),
	// 	Matrix.parse(`translate(-50 -50) translate(-10 -10)`).toString(),
	// 	`R2.composeTM(G2)`
	// );
	t.same(
		R2._rootTM.toString(),
		Matrix.parse(
			`translate(100) translate(0 80) translate(-50 -50) translate(-10 -10)`
		).toString(),
		`R2._rootTM()`
	);
	// R1.composeTM(R2);
	// 	t.throws(() => R1.composeTM(R2), { message: /not reached/ });

	// t.same(top.composeTM().toString(), Matrix.identity().toString());
	// t.same(V1.composeTM().toString(), Matrix.parse(`translate(100)`).toString());

	[
		["R0", 0, 0, 300, 400],
		["R1", 10, 20, 40, 60],
		["R2", 10, 20, 40, 60],
		["R3", 10, 20, 40, 60],
		["R4", 10, 20, 40, 60],
		["RA", 50, 50, 30, 30],
		["RX", 0, 0, 300, 400],
		["RB", 50, 50, 30, 30],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v._objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});
	[
		["G1", -50, 40, 100, 120],
		["G2", -50, -40, 100, 120],
		["G3", -50, -40, 100, 120],
		["G4", 0, 10, 50, 70],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v._objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});

	[
		["V1", 0, 0, 300, 400],
		["V2", 50, 50, 30, 30],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const r = v._objectBBox();
		t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
	});
	//////////////////////
	[
		["R0", 0, 0, 300, 400],
		["R1", 60, 50, 40, 60],
		["R2", 50, 40, 40, 60],
		["R3", 110, 100, 40, 60],
		["R4", 100, 90, 40, 60],
		["RA", 150, 25, 15, 15],
		["RX", 125, 0, 150, 200],
		["RB", 150, 75, 15, 15],
	].forEach(([id, x, y, w, h]) => {
		const v = doc.getElementById(id);
		const b = Box.new(x, y, w, h);
		eqBox(b, v._shapeBox(), 0, id);
	});

	[
		["R0", 1, 0, 0, 1, 0, 0],
		["G1", 1, 0, 0, 1, 100, 0],
		["G2", 1, 0, 0, 1, 100, 80],
		["G3", 1, 0, 0, 1, 100, 80],
		["G4", 1, 0, 0, 1, 50, 30],
		["R1", 1, 0, 0, 1, 50, 30],
		["R2", 1, 0, 0, 1, 40, 20],
		["R3", 1, 0, 0, 1, 100, 80],
		["R4", 1, 0, 0, 1, 90, 70],
		["V1", 1, 0, 0, 1, 100, 0],
		["RA", 0.5, 0, 0, 0.5, 125, 0],
		["RX", 0.5, 0, 0, 0.5, 125, 0],
		["V2", 0.5, 0, 0, 0.5, 125, 50],
		["RB", 0.5, 0, 0, 0.5, 125, 50],
	].forEach(([id, a, b, c, d, e, f]) => {
		const v = doc.getElementById(id);
		const m = Matrix.new([a, b, c, d, e, f]);
		// t.same(v.composeTM(top).describe(), m.describe(), `composeTM(top) ${id}`);
		t.same(v._rootTM.describe(), m.describe(), `_composeTM() ${id}`);
		t.same(_rootTM(v).describe(), m.describe(), `_composeTM() ${id}`);
		// t.same(v._relTM(v._ownTM, top).describe(), m.describe(), `_composeTM(top) ${id}`);
	});
	trsubs.forEach(([rootId, ...subs]) => {
		const root = doc.getElementById(rootId);
		const lay = root._layout();
		subs.forEach(([subId, a, b, c, d, e, f]) => {
			const m = Matrix.new([a, b, c, d, e, f]);
			const sub = doc.getElementById(subId);
			// t.same(v.composeTM(top).describe(), m.describe(), `composeTM(top) ${id}`);
			// t.same(v._composeTM().describe(), m.describe(), `_composeTM() ${id}`);
			const [p, o] = lay._pairTM(sub);
			const r = lay._rootTM(sub);
			// t.same(
			// 	sub._relTM(sub._ownTM, root).describe(),
			// 	m.describe(),
			// 	`${subId}._composeTM(${rootId})`
			// );
			t.same(
				p.cat(o).describe(),
				m.describe(),
				`${subId}.p.cat(o) <-- ${rootId}`
			);
			t.same(r.describe(), m.describe(), `${subId}._rootTM(o) <-- ${rootId}`);
		});
	});
	t.end();
});

import {  SVGGraphicsElement } from "../dist/svg/_element.js";

	function _relTM(parent, tm, root) {
		while (parent != root) {
			const grand = parent.parentElement;
			if (grand instanceof SVGGraphicsElement) {
				tm = tm.postCat(parent._vboxTM);
				parent = grand;
			} else if (root) {
				if (grand) {
					throw new Error(`root not reached`);
				} else {
					const p = root._rootTM.inverse();
					return p.cat(tm);
				}
			} else {
				break;
			}
		}
		return tm;


	}


	function _rootTM(node) {
		// const { parentNode: parent, _ownTM } = node;
		// if (parent instanceof SVGGraphicsElement) {
		// 	return _relTM(parent, _ownTM);
		// } else {
		// 	return _ownTM;
		// }
		let { parentElement: parent, _ownTM: tm } = node;
		while (parent instanceof SVGGraphicsElement) {
			const { _vboxTM } = parent;
			if ((parent = parent.parentElement) == null) {
				break;
			}
			tm = tm.postCat(_vboxTM);
		}
		return tm;
	}
