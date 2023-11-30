import fs from "fs";
import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Box, Matrix } from "svggeom";
// import DATA from "./res/preserveAspectRatio.json" assert { type: "json" };
// import DATA from "./res/preserveAspectRatio2.json" assert { type: "json" };
import DATA from "./res/symbolViewBox.json" assert { type: "json" };
const parser = new DOMParser();

tap.test("DATA", function (t) {
	const { all } = parser.parseFromString(DATA[""]);
	const elements = Object.entries(DATA)
		.filter(([k, v], i) => !!k)
		.map(([k, v], i) => [all[k], v]);
	// elements
	// 	.map(([elem, v], i) => [elem, ...(v.root_tm ?? [])])
	// 	.forEach(([elem, ...m]) => {
	// 		const b = Matrix.hexad(...m);
	// 		let a, c;
	// 		c = elem._innerTM;
	// 		a = elem._rootTM;
	// 		if (elem.localName == "svg") {
	// 			a = c;
	// 		}
	// 		t.ok(b.equals(a, 1e-5), `rootTM ${elem.id} [${a}] [${b}]`);
	// 		t.ok(b.equals(c, 1e-5), `localTM ${elem.id} [${c}] [${b}]`);
	// 	});
	// elements
	// 	.map(([elem, v], i) => [elem, v.root_box ?? []])
	// 	.forEach(([elem, m]) => {
	// 		const b = Box.forRect(...m);
	// 		let a;
	// 		if (elem.localName == "svg") {
	// 			// a = elem._objectBBox(elem._innerTM);
	// 			a = elem._shapeBox();
	// 			// a = elem._boundingBox();
	// 		} else {
	// 			a = elem._boundingBox();
	// 		}
	// 		// _objectBBox
	// 		t.ok(b.equals(a, 1e-3), `_boundingBox ${elem.id} [${a}] [${b}]`);
	// 	});

	// elements
	// 	.map(([elem, v], i) => [elem, v.box ?? []])
	// 	.forEach(([elem, m]) => {
	// 		const b = Box.forRect(...m);
	// 		const a = elem.getBBox();
	// 		if (elem.localName == "defs") {
	// 			return;
	// 		}
	// 		t.ok(b.equals(a, 1e-3), `${elem.id} [${a}] [${b}]`);
	// 	});
	elements
		.map(([elem, v], i) => [elem, v.root_box ?? []])
		.forEach(([elem, m]) => {
			switch (elem.localName) {
				case "use":
				case "g":
					return;
			}
			const b = Box.forRect(...m);
			const a = elem._boundingBox();
			t.ok(b.equals(a, 1e-3), `${elem.id} [${a}] [${b}]`);
		});

	// Object.entries(preserveAspectRatio)
	// 	.map(([elem, v], i) => [elem, v.box ?? []])
	// 	.forEach(([elem, m]) => {
	// 		console.log();
	// 		// const b = Box.forRect(...m);
	// 		// const a = elem.getBBox();
	// 		// t.ok(b.equals(a, 1e-5), `${id} [${a}] [${b}]`);
	// 	});

	t.end();
});

/*
https://github.com/kevleyski/webrtc/blob/4d274da199b5fbf6d3c5f00dd941ad60faed77b4/third_party/blink/web_tests/svg/dom/svg2-inheritance.html
*/
function checkParent(that, klass) {
	const map = globalThis._dominh ?? (globalThis._dominh = {});
	const set = map[klass] ?? (map[klass] = new Set());
	set.add(that);
}
// Object.entries(_dominh).map(([k, v])=>[k, [...v].sort()])
[
	[
		"SVGGraphicsElement",
		[
			"SVGAElement",
			"SVGDefsElement",
			"SVGForeignObjectElement",
			"SVGGElement",
			"SVGGeometryElement",
			"SVGImageElement",
			"SVGSVGElement",
			"SVGSwitchElement",
			"SVGTextContentElement",
			"SVGUseElement",
		],
	],
	[
		"Object",
		[
			"SVGAngle",
			"SVGAnimatedAngle",
			"SVGAnimatedBoolean",
			"SVGAnimatedEnumeration",
			"SVGAnimatedInteger",
			"SVGAnimatedLength",
			"SVGAnimatedLengthList",
			"SVGAnimatedNumber",
			"SVGAnimatedNumberList",
			"SVGAnimatedPathData",
			"SVGAnimatedPreserveAspectRatio",
			"SVGAnimatedRect",
			"SVGAnimatedString",
			"SVGAnimatedTransformList",
			"SVGLength",
			"SVGLengthList",
			"SVGMarkerInstance",
			"SVGMarkerList",
			"SVGMatrix",
			"SVGNumber",
			"SVGNumberList",
			"SVGPoint",
			"SVGPointList",
			"SVGPreserveAspectRatio",
			"SVGRect",
			"SVGStringList",
			"SVGTransform",
			"SVGTransformList",
		],
	],
	[
		"SVGAnimationElement",
		[
			"SVGAnimateColorElement",
			"SVGAnimateElement",
			"SVGAnimateMotionElement",
			"SVGAnimateTransformElement",
			"SVGSetElement",
		],
	],
	[
		"SVGElement",
		[
			"SVGAnimationElement",
			"SVGClipPathElement",
			"SVGColorProfileElement",
			"SVGCursorElement",
			"SVGDescElement",
			"SVGGradientElement",
			"SVGGraphicsElement",
			"SVGMPathElement",
			"SVGMarkerElement",
			"SVGMaskElement",
			"SVGMeshPatchElement",
			"SVGMeshRowElement",
			"SVGMetadataElement",
			"SVGPatternElement",
			"SVGScriptElement",
			"SVGStopElement",
			"SVGStyleElement",
			"SVGSymbolElement",
			"SVGTitleElement",
			"SVGViewElement",
		],
	],
	["CSSRule", ["SVGCSSRule"]],
	[
		"SVGGeometryElement",
		[
			"SVGCircleElement",
			"SVGEllipseElement",
			"SVGLineElement",
			"SVGPathElement",
			"SVGPolygonElement",
			"SVGPolylineElement",
			"SVGRectElement",
		],
	],
	["SVGCSSRule", ["SVGColorProfileRule"]],
	["Element", ["SVGElement"]],
	[
		"SVGGradientElement",
		[
			"SVGLinearGradientElement",
			"SVGMeshGradientElement",
			"SVGRadialGradientElement",
		],
	],
	["SVGTextPositioningElement", ["SVGTSpanElement", "SVGTextElement"]],
	[
		"SVGTextContentElement",
		["SVGTextPathElement", "SVGTextPositioningElement"],
	],
	["Event", ["TimeEvent"]],
];
