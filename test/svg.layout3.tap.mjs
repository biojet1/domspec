import fs from "fs";
import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Box, Matrix } from "svggeom";
import DATA from "./res/transform.json" assert { type: "json" };
// import DATA from "../../anim8/test/res/vps.json" assert { type: "json" };


const parser = new DOMParser();
const { all } = parser.parseFromString(DATA[""]);
const elements = Object.entries(DATA)
	.filter(([k, v], i) => !!k)
	.filter(([k, v], i) => !!k)
	.map(([k, v], i) => [all[k], v]);

tap.test("getBBox", function (t) {
	elements
		.map(([k, v], i) => [k, v.box ?? []])
		.forEach(([node, m]) => {
			const b = Box.forRect(...m);
			if (node.localName == "svg") {
				return;
			}
			const a = node.getBBox();
			t.ok(b.equals(a, 1e-5), `getBBox ${node.id} [${a}] [${b}]`);
		});

	t.end();
});
tap.test("getCTM", function (t) {
	elements
		.map(([k, v], i) => [k, v.ctm ?? []])
		.forEach(([node, m]) => {
			const b = Matrix.hexad(...m);
			if (node.localName == "svg") {
				return;
			}
			const a = node.getCTM();
			t.ok(b.equals(a, 1e-5), `getCTM ${node.id} [${a}] [${b}]`);
		});

	t.end();
});

tap.test("getScreenCTM", function (t) {
	elements
		.map(([k, v], i) => [k, v.sctm ?? []])
		.forEach(([node, m]) => {
			const b = Matrix.hexad(...m);
			if (node.localName == "svg") {
				return;
			}
			const a = node.getScreenCTM();
			t.ok(b.equals(a, 1e-5), `getScreenCTM ${node.id} [${a}] [${b}]`);
		});

	t.end();
});

tap.test("_rootTM", async (t) => {
	elements
		.map(([k, v], i) => [k, ...(v.root_tm ?? [])])
		.forEach(([node, ...m]) => {
			const b = Matrix.hexad(...m);
			const c = node._innerTM;
			let a;
			if (node.localName == "svg") {
				a = c;
			} else {
				a = node._rootTM;
			}
			t.ok(b.equals(a, 1e-5), `rootTM ${node.id} [${a}] [${b}]`);
			t.ok(b.equals(c, 1e-5), `localTM ${node.id} [${c}] [${b}]`);
		});

	t.end();
});
import { SVGGraphicsElement } from "../dist/svg/_element.js";

tap.test("_rootTM()", async (t) => {
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
		let { _rootTM: parent, _subTM: tm } = node;
		while (parent instanceof SVGGraphicsElement) {
			const { _subTM } = parent;
			if ((parent = parent.parentElement) == null) {
				break;
			}
			tm = tm.post_cat(_subTM);
		}
		return tm;
	}
	elements
		.map(([k, v], i) => [k, ...(v.root_tm ?? [])])
		.forEach(([node, ...m]) => {
			const b = Matrix.hexad(...m);
			const c = _rootTM(node);
			let a;
			if (node.localName == "svg") {
				a = _innerTM(node);
				return;
			} else {
				a = _rootTM(node);
			}
			t.ok(b.equals(a, 1e-5), `rootTM ${node.id} [${a}] [${b}]`);
			t.ok(b.equals(c, 1e-5), `localTM ${node.id} [${c}] [${b}]`);
		});


	t.end();
});

tap.test("_boundingBox", async (t) => {
	elements
		.map(([k, v], i) => [k, v.root_box ?? []])
		.forEach(([node, m]) => {
			const b = Box.forRect(...m);
			if (node.localName == "svg") {
				return;
			}
			const a = node._boundingBox();
			t.ok(b.equals(a, 1e-5), `boundingBox ${node.id} [${a}] [${b}]`);

			const c = node._objectBBox(node._rootTM);
			t.ok(b.equals(c, 1e-5), `${node.id} [${c}] [${b}]`);
		});
	t.end();
});

tap.test("Layout.boundingBox2", async (t) => {
	for (const [node, { box_from }] of elements) {
		if (node.localName == "svg") {
			continue;
		}
		for (const [group_id, box] of Object.entries(box_from)) {
			const g = all[group_id];

			try {
				// const a = g._boundingBox(node);
				const b = Box.forRect(...box);
				const tg = g._rootTM;
				const tn = node._rootTM;
				const c = node.getBBox().transform(tg.inverse().cat(tn));

				t.ok(
					b.equals(c, 1e-5),
					`BBoxC ${group_id} <-- ${node.id} [${c}] [${b}]`
				);
				// t.ok(b.equals(a, 1e-5), `BBoxA ${group_id} <-- ${node.id} [${a}] [${b}]`);
				break;
			} catch (err) {
				console.log(`${group_id} <-- ${node.id}`);
				throw err;
			}
		}
	}
	t.end();
});

/*
SVGGraphicsElement:
	SVGAElement
	SVGDefsElement
	SVGForeignObjectElement
	SVGGElement
	SVGGeometryElement
		SVGCircleElement
		SVGEllipseElement
		SVGLineElement
		SVGPathElement
		SVGPolygonElement
		SVGPolylineElement
		SVGRectElement
	SVGImageElement
	SVGSVGElement
	SVGSwitchElement
	SVGTextContentElement
		SVGTextPathElement
		SVGTextPositioningElement
			SVGTSpanElement SVGTextElement
	SVGUseElement
*/

// container element
//  a, clipPath, defs, g, marker, mask, pattern, svg, switch, symbol
//    SVGAElement SVGClipPathElement SVGDefsElement SVGGElement SVGMarkerElement
//    SVGMaskElement SVGPatternElement SVGSVGElement SVGSwitchElement SVGSymbolElement

// elements that establish SVG viewports
//  svg, symbol, image, marker, pattern, view
//    SVGSVGElement, SVGSymbolElement, SVGImageElement,
//    SVGMarkerElement, SVGPatternElement, SVGViewElement
