import fs from "fs";
import tap from "tap";
import glob from "glob";

import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { BoundingBox, Matrix } from "svggeom";
import { SVGLayout } from "../dist/svg/layout.js";

function apply(m, node) {
	const [P, M] = node.pairTM();
	const L = P.inverse().cat(m).cat(P);
	const R = P.cat(M);

	const I = L.inverse();

	// const T = M.cat(R.inverse().cat(m)).inverse();
	// const T = P.inverse().cat(m).inverse().cat(M).inverse();
	let S, T;
	T = S = R.inverse().cat(m).cat(P);
	if (M.isIdentity == false) {
		T = M.cat(T).inverse(); // R1,R2 OK
		// T = T.cat(M).inverse() // R1,R2 OK
		// T = T.inverse()
	}
	// T = R.inverse().cat(m).cat(P)
	T = L.cat(M); // R1,R2,R3,R4 OK
	node._ownTM = T;

	console.log(
		"trans",
		node.id,
		`[${T.describe()}]\n\tL[${L.describe()}]\n\tS[${S.describe()}]\n\t-> ${T.describe()}`
	);
}

function toParent(parent, i) {
	const childTM = i._rootTM;
	const parentTM = parent._rootTM;
	parent.appendChild(i);
	i._ownTM = parentTM.inverse().cat(childTM);
}

const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
	t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

import { createWriteStream, writeFileSync, WriteStream } from "fs";

tap.test("layout1", { bail: 0 }, function (t) {
	for (const f of glob.sync("test/res/*.metrix.json")) {
		const data = JSON.parse(fs.readFileSync(f, "utf8"));
		const document = parser.parseFromString(data["-"]);
		const root = document.documentElement;
		Array.from(document.querySelectorAll("path[id]"))
			.filter((v) => v.id.match(/^P_/))
			.forEach((v) => v.remove());
		for (const [id, metrix] of Object.entries(data).filter(
			([k, v]) => k != "-" && document.getElementById(k)
		)) {
			// console.log(id, metrix);
			const [a, b, c, d, e, f] = metrix.root_tm;
			const [x, y, w, h] = metrix.root_box;
			const m = Matrix.new(a, b, c, d, e, f);
			const v = document.getElementById(id);
			const r = v._rootTM;
			const l = v._innerTM;
			// const l = _innerTM(v);
			const o = v._ownTM;
			const b0 = BoundingBox.rect(x, y, w, h);
			const b1 = v._boundingBox();
			root.insertAdjacentHTML(
				"beforeend",
				`<rect x="${b1.x}" y="${b1.y}" width="${b1.width}" height="${b1.height}" style="fill:none;stroke:red;opacity:50%;">`
			);

			t.ok(r.equals(m, 1e-3), `${id} ${r.describe()} ${m.describe()}`);
			const n = metrix.tag_name == "svg" ? l.cat(v._viewportTM().inverse()) : l;

			t.ok(r.equals(n, 1e-3), `_innerTM ${id} ${l.describe()} ${o.describe()}`);
			t.ok(
				r.equals(v._rootTM, 1e-3),
				`docTM ${id} ${r.describe()} ${v._rootTM.describe()}`
			);
			if ((metrix.tag_name != "defs", !b0.isEmpty())) {
				eqBox(t, b0, b1, 1e-1, id);
			}
		}

		writeFileSync(`/tmp/test.svg`, root.outerHTML);
	}

	t.end();
});
tap.test("_innerTM", { bail: 0 }, function (t) {
	const document = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
	<g id="G1" transform="translate(100,0)">
	<g id="G2" transform="translate(0,100)">
	  <g id="G3">
	    <g id="G4" transform="translate(-50,-50)">
	      <rect id="R1" x="10px" y="20px" width="100px" height="200px"/>
	      <rect id="R2" x="10px" y="20px" width="100px" height="200px" transform="translate(-10,-10)"/>
	    </g>
	    <rect id="R3" x="10px" y="20px" width="100px" height="200px"/>
	    <rect id="R4" x="10px" y="20px" width="100px" height="200px" transform="translate(-10,-10)"/>
	  </g>
	</g>
	</g>
	<rect id="R9" x="10px" y="20px" width="100px" height="200px"/>
	<rect id="R8" x="10px" y="20px" width="100px" height="200px" transform="translate(-10,-10)"/>
	<svg id="V1" transform="translate(20,-30)">
    	<circle id="C2"/>
	</svg>
  	<svg id="V2">
    	<circle id="C1"/>
	</svg>
  	<svg id="V3" viewBox="0 0 200 100">
    	<circle id="C3"/>
	</svg>
  	<svg id="V4" viewBox="-50 -40 200 100">
    	<circle id="C4"/>
	</svg>
</svg>
		`);
	const R1 = document.getElementById("R1");
	const R8 = document.getElementById("R8");
	const R9 = document.getElementById("R9");
	const { documentElement: rootSVG } = document;

	t.same(
		document.getElementById("G1")._innerTM.describe(),
		Matrix.translate(100, 0).describe()
	);
	t.same(
		document.getElementById("G2")._innerTM.describe(),
		Matrix.translate(100, 100).describe()
	);
	t.same(
		document.getElementById("G3")._innerTM.describe(),
		Matrix.translate(100, 100).describe()
	);
	t.same(
		document.getElementById("G4")._innerTM.describe(),
		Matrix.translate(50, 50).describe()
	);
	t.same(
		document.getElementById("R1")._innerTM.describe(),
		Matrix.translate(50, 50).describe()
	);
	t.same(
		document.getElementById("R2")._innerTM.describe(),
		Matrix.translate(40, 40).describe()
	);
	t.same(
		document.getElementById("R3")._innerTM.describe(),
		Matrix.translate(100, 100).describe()
	);
	t.same(
		document.getElementById("R4")._innerTM.describe(),
		Matrix.translate(90, 90).describe()
	);
	t.same(
		document.documentElement._innerTM.describe(),
		Matrix.identity().describe()
	);
	[
		["R9", "", ""],
		["R8", "translate(-10, -10)", "translate(-10, -10)"],
		["V2", "", ""],
		["V1", "translate(20, -30)", "translate(20,-30)"],
		["C1", "", ""],
		["C2", "translate(20, -30)", "translate(20,-30)"],
		["V3", "", ""],
		["C3", "", ""],
		["C4", "translate(50, 40)", "translate(50, 40)"],
		["V4", "translate(50, 40)", ""],
	].forEach(([id, s, d]) => {
		const m = Matrix.parse(s);
		const n = Matrix.parse(d);
		const v = document.getElementById(id);
		t.same(v._innerTM.describe(), m.describe(), `._innerTM ${id}`);
		t.same(v._rootTM.describe(), n.describe(), `._rootTM ${id}`);
		t.same(_rootTM(v).describe(), n.describe(), `_rootTM() ${id}`);
		t.same(_innerTM(v).describe(), m.describe(), `_innerTM() ${id}`);
		// t.same(
		// 	v._relTM(Matrix.identity(), rootSVG).describe(),
		// 	n.describe(),
		// 	`_composeTM rootSVG ${id}`
		// );
	});
	t.same(
		rootSVG._rootTM.describe(),
		Matrix.identity().describe(),
		`_composeTM documentElement`
	);

	t.end();
});
import { SVGGraphicsElement } from "../dist/svg/_element.js";

function _rootTM(node) {
	let { parentElement: parent, _ownTM: tm } = node;
	while (parent instanceof SVGGraphicsElement) {
		const { _subTM } = parent;
		if ((parent = parent.parentElement) == null) {
			break;
		}
		tm = tm.post_cat(_subTM);
	}
	return tm;
}
function _innerTM(node) {
	let { parentElement: parent, _subTM: tm } = node;
	while (parent instanceof SVGGraphicsElement) {
		const { _subTM } = parent;
		if ((parent = parent.parentElement) == null) {
			break;
		}
		tm = tm.post_cat(_subTM);
	}
	return tm;
}
