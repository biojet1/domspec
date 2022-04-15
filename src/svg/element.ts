import { Vec, Box, Matrix, Path } from "svggeom";
/// Base Elements //////////
function shapeBoxVP(node: SVGGraphicsElement, T?: Matrix | boolean): Box {
	const width = node.width.baseVal.value;
	const height = node.height.baseVal.value;
	const x = node.x.baseVal.value;
	const y = node.y.baseVal.value;
	if (width && height) {
		let b = Box.new(x, y, width, height);
		if (T === true) {
			b = b.transform(node.composedTransform());
		} else if (T) {
			b = b.transform(T);
		} else {
			b = b.transform(node.transformM);
		}
		return b;
	}
	return Box.not();
}

export class SVGElement extends Element {
	get _isViewportElement() {
		return 0;
	}

	get viewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (1 === parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}

	get ownerSVGElement(): SVGSVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent instanceof SVGSVGElement) {
				return parent;
			}
		}
		return null;
	}

	createSVGLength() {
		return new SVGLength();
	}

	createSVGMatrix() {
		return new Matrix();
	}

	createSVGTransformFromMatrix(M: Matrix) {
		const m = new SVGTransform();
		m.setMatrix(M);
		return m;
	}
}

interface IBBoxParam {
	fill?: boolean;
	stroke?: boolean;
	markers?: boolean;
	clipped?: boolean;
}

export class SVGGraphicsElement extends SVGElement {
	get nearestViewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}
	get farthestViewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		let farthest: SVGElement | null = null;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				farthest = parent as SVGElement;
			}
		}
		return farthest;
	}

	get transformM() {
		// return Matrix.parse(this.getAttribute("transform") || "");
		return this.transform.baseVal.consolidate();
	}

	set transformM(T: Matrix) {
		this.setAttribute("transform", T.toString());
	}

	get clip(): SVGGraphicsElement | undefined {
		const id = this.getAttribute("clip-path");
		if (id) {
			return this.ownerDocument?.getElementById(id) as SVGGraphicsElement;
		}
	}

	set clip(target: SVGElement | undefined) {
		target && this.setAttribute("clip-path", target.letId());
	}

	canRender() {
		if (this.getAttribute("display") === "none") {
			return false;
		}
		return true;
	}
	refElement() {
		const id =
			this.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
			this.getAttribute("href");
		if (id) {
			const h = id.indexOf("#");
			return this.ownerDocument?.getElementById(
				h < 0 ? id : id.substr(h + 1)
			);
		}
	}

	composedTransform(): Matrix {
		// depreciated
		return this.myCTM();
	}

	myCTM(): Matrix {
		const { parentNode: parent, transformM } = this;
		if (parent) {
			if (parent instanceof SVGGraphicsElement) {
				return parent.composedTransform().multiply(transformM);
			}
		}
		return transformM;
	}

	parentCTM(): Matrix {
		const { parentNode: parent } = this;
		if (parent) {
			if (parent instanceof SVGGraphicsElement) {
				return parent.composedTransform();
			}
		}
		return Matrix.identity();
	}
	// parentCTM(), myCTM(), myTM(), transformM

	shapeBox(T?: Matrix | boolean): Box {
		// if (this.canRender()) {
		const E =
			T === true
				? this.composedTransform()
				: T
				? T.multiply(this.transformM)
				: this.transformM;
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.canRender()) {
				box = box.merge(sub.boundingBox(E));
			}
		}
		return box;
		// }
		// return Box.not();
	}

	// def shape_box(self, transform=None):
	//     bbox = None
	//     effective_transform = Transform(transform) * self.transform
	//     for child in self:
	//         if isinstance(child, ShapeElement):
	//             child_bbox = child.bounding_box(transform=effective_transform)
	//             if child_bbox is not None:
	//                 bbox += child_bbox
	//     return bbox

	boundingBox(M?: Matrix | boolean): Box {
		const { clip } = this;
		if (clip) {
			if (M === true) {
				return this.shapeBox(true).overlap(
					clip.boundingBox(this.composedTransform())
				);
			} else {
				return this.shapeBox(M).overlap(clip.boundingBox(M));
			}
		} else {
			return this.shapeBox(M);
		}
	}

	getBBox() {
		const box = this.shapeBox(true);
		// return this.shapeBox(true);
		return box.isValid() ? box : Box.empty();
	}

	newAttributeNode(name: string) {
		// console.log("newAttributeNode", name);
		switch (name) {
			case "r":
			case "x":
			case "y":
			case "rx":
			case "ry":
			case "cx":
			case "cy":
			case "x1":
			case "x2":
			case "y1":
			case "y2":
			case "width":
			case "height":
				return new SVGLengthAttr(name);
			case "viewBox":
				return new SVGRectAttr(name);
			// return new SVGLengthListAttr(name);
			case "transform":
				return new SVGTransformListAttr(name);
			// case "points":
			// 	return new SVGNumberListAttr(name);
		}

		return super.newAttributeNode(name);
	}
	get r(): SVGLengthAttr {
		return this.letAttributeNode("r") as SVGLengthAttr; // for now
	}
	get x(): SVGLengthAttr {
		return this.letAttributeNode("x") as SVGLengthAttr; // for now
	}

	get y(): SVGLengthAttr {
		return this.letAttributeNode("y") as SVGLengthAttr; // for now
	}
	get cx(): SVGLengthAttr {
		return this.letAttributeNode("cx") as SVGLengthAttr; // for now
	}
	get cy(): SVGLengthAttr {
		return this.letAttributeNode("cy") as SVGLengthAttr; // for now
	}
	get rx(): SVGLengthAttr {
		return this.letAttributeNode("rx") as SVGLengthAttr; // for now
	}
	get ry(): SVGLengthAttr {
		return this.letAttributeNode("ry") as SVGLengthAttr; // for now
	}
	get x1(): SVGLengthAttr {
		return this.letAttributeNode("x1") as SVGLengthAttr; // for now
	}
	get x2(): SVGLengthAttr {
		return this.letAttributeNode("x2") as SVGLengthAttr; // for now
	}
	get y1(): SVGLengthAttr {
		return this.letAttributeNode("y1") as SVGLengthAttr; // for now
	}
	get y2(): SVGLengthAttr {
		return this.letAttributeNode("y2") as SVGLengthAttr; // for now
	}
	get width(): SVGLengthAttr {
		return this.letAttributeNode("width") as SVGLengthAttr; // for now
	}
	get height(): SVGLengthAttr {
		return this.letAttributeNode("height") as SVGLengthAttr; // for now
	}
	get viewBox(): SVGRectAttr {
		return this.letAttributeNode("viewBox") as SVGRectAttr; // for now
	}
	get transform(): SVGTransformListAttr {
		return this.letAttributeNode("transform") as SVGTransformListAttr; // for now
	}

	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode("transform");
		if (parentT) {
			if (a) {
				parentT = parentT.multiply(Matrix.parse(a.value));
			}
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}

		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement) {
				sub.fuseTransform(parentT);
			}
		}
		a && this.removeAttributeNode(a);
	}
}

export class SVGTextContentElement extends SVGGraphicsElement {}

export class SVGGeometryElement extends SVGGraphicsElement {
	describe(): string {
		throw new Error("NotImplemented");
	}

	get path() {
		try {
			return Path.parse(this.describe());
		} catch (err) {
			return Path.new();
		}
	}

	shapeBox(T?: Matrix | boolean) {
		let { path } = this;
		if (path.firstPoint) {
			if (T === true) {
				path = path.transform(this.composedTransform());
			} else {
				path = path.transform(this.transformM);
				if (T) {
					path = path.transform(T);
				}
			}
			return path.bbox();
		}
		return Box.not();
	}

	toPathElement() {
		const { ownerDocument } = this;
		if (ownerDocument) {
			const p = ownerDocument.createElement("path") as SVGGeometryElement;
			let s;
			(s = this.describe()) && p.setAttribute("d", s);
			(s = this.getAttribute("style")) && p.setAttribute("style", s);
			(s = this.getAttribute("class")) && p.setAttribute("class", s);
			(s = this.getAttribute("transform")) &&
				p.setAttribute("transform", s);
			return p;
		}
		throw DOMException.new(`InvalidStateError`);
	}
	getTotalLength() {
		return this.path.length;
	}
	getPointAtLength(L: number) {
		return this.path.pointAtLength(L);
	}
}

/// SVGGeometryElement //////////
export class SVGPathElement extends SVGGeometryElement {
	static TAGS = ["path"];
	describe() {
		return this.getAttribute("d") || "";
	}
	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode("transform");
		const d = this.describe();

		if (parentT) {
			if (a) {
				parentT = parentT.multiply(Matrix.parse(a.value));
			}
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}

		if (d && parentT) {
			this.setAttribute("d", Path.parse(d).transform(parentT).describe());
		}
		a && this.removeAttributeNode(a);
	}
}

export class SVGCircleElement extends SVGGeometryElement {
	static TAGS = ["circle"];
	describe() {
		const r = this.r.baseVal.value;
		const x = this.cx.baseVal.value;
		const y = this.cy.baseVal.value;

		if (r === 0) return "M0 0";

		return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${
			x + r
		} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
	}
}

export class SVGRectElement extends SVGGeometryElement {
	static TAGS = ["rect"];
	describe() {
		const width = this.width.baseVal.value;
		const height = this.height.baseVal.value;
		const x = this.x.baseVal.value;
		const y = this.y.baseVal.value;
		const rx = this.rx.baseVal.value;
		const ry = this.ry.baseVal.value;

		return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
	}
	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode("transform");
		if (parentT) {
			a && (parentT = parentT.multiply(Matrix.parse(a.value)));
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}
		if (parentT) {
			const {
				a: scale_x,
				b: skew_x,
				c: skew_y,
				d: scale_y,
				e: translate_x,
				f: translate_y,
			} = parentT;
			if (skew_x == 0 && skew_y == 0) {
				const { abs } = Math;
				let w = this.width.baseVal.value;
				let h = this.height.baseVal.value;
				let x = this.x.baseVal.value;
				let y = this.y.baseVal.value;
				x *= scale_x;
				x += translate_x;
				y *= scale_y;
				y += translate_y;
				this.x.baseVal.value = x;
				this.y.baseVal.value = y;
				this.width.baseVal.value = abs(w * scale_x);
				this.height.baseVal.value = abs(h * scale_y);
				a && this.removeAttributeNode(a);
			} else {
				throw new Error(
					`fuseTransform of ${this.constructor.name} with skew_x == ${skew_x}, skew_y == ${skew_y}`
				);
			}
		}
	}
}

export class SVGLineElement extends SVGGeometryElement {
	static TAGS = ["line"];
	describe() {
		const x1 = this.x1.baseVal.value;
		const x2 = this.x2.baseVal.value;
		const y1 = this.y1.baseVal.value;
		const y2 = this.y2.baseVal.value;
		return `M ${x1} ${y1} L ${x2} ${y2}`;
	}
	fuseTransform(parentT: Matrix) {
		const a = this.getAttributeNode("transform");
		if (a) {
			let m = Matrix.parse(a.value);
			let x1 = this.x1.baseVal.value;
			let x2 = this.x2.baseVal.value;
			let y1 = this.y1.baseVal.value;
			let y2 = this.y2.baseVal.value;
			parentT && (m = parentT.multiply(m));

			[x1, y1] = Vec.pos(x1, y1).transform(m);
			[x2, y2] = Vec.pos(x2, y2).transform(m);
			this.x1.baseVal.value = x1;
			this.x2.baseVal.value = x2;
			this.y1.baseVal.value = y1;
			this.y2.baseVal.value = y2;
			this.removeAttributeNode(a);
		}
	}
}

export class SVGEllipseElement extends SVGGeometryElement {
	static TAGS = ["ellipse"];
	describe() {
		const rx = this.rx.baseVal.value;
		const ry = this.ry.baseVal.value;
		const x = this.cx.baseVal.value;
		const y = this.cy.baseVal.value;
		return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${
			x + rx
		} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
	}
}

export class SVGPolygonElement extends SVGGeometryElement {
	static TAGS = ["polygon"];
	describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p} Z` : "";
	}
	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode("transform");
		if (parentT) {
			a && (parentT = parentT.multiply(Matrix.parse(a.value)));
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}
		const l =
			parentT &&
			this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vec.pos(e[0], e[1]))
				.map((e) => [...e.transform(parentT)])
				.map((e) => `${e[0]},${e[1]}`);
		l && this.setAttribute("points", l.join(" "));
		a && this.removeAttributeNode(a);
	}
}

export class SVGPolylineElement extends SVGGeometryElement {
	static TAGS = ["polyline"];
	describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p}` : "";
	}
	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode("transform");
		if (parentT) {
			a && (parentT = parentT.multiply(Matrix.parse(a.value)));
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}
		const l =
			parentT &&
			this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vec.pos(e[0], e[1]))
				.map((e) => [...e.transform(parentT)])
				.map((e) => `${e[0]},${e[1]}`);
		l && this.setAttribute("points", l.join(" "));
		a && this.removeAttributeNode(a);
	}
}

/// SVGGraphicsElement //////////
// ‘a’, ‘clipPath’, ‘defs’, ‘g’, ‘marker’, ‘mask’, ‘pattern’, ‘svg’, ‘switch’ and ‘symbol’.

export class SVGAElement extends SVGGraphicsElement {
	static TAGS = ["a"];
}

export class SVGDefsElement extends SVGGraphicsElement {
	static TAGS = ["defs"];

	getBBox() {
		return Box.empty();
	}
}

export class SVGForeignObjectElement extends SVGGraphicsElement {
	static TAGS = ["foreignObject"];
	get _isViewportElement() {
		return 2;
	}
	shapeBox(T?: Matrix | boolean): Box {
		return shapeBoxVP(this, T);
	}
}

export class SVGGElement extends SVGGraphicsElement {
	static TAGS = ["g"];
}

export class SVGImageElement extends SVGGraphicsElement {
	// https://svgwg.org/svg2-draft/coords.html#BoundingBoxes
	static TAGS = ["image"];
	get _isViewportElement() {
		return 1;
	}
	shapeBox(T?: Matrix | boolean): Box {
		return shapeBoxVP(this, T);
	}
}

export class SVGSVGElement extends SVGGraphicsElement {
	static TAGS = ["svg"];

	get _isViewportElement() {
		return 1;
	}

	shapeBox(T?: Matrix | boolean): Box {
		return shapeBoxVP(this, T);
	}

	defs() {
		let { ownerDocument, children } = this;
		if (ownerDocument) {
			for (const sub of children) {
				if (sub.localName == "defs") {
					return sub;
				}
			}
			const defs = ownerDocument.createElement("defs");
			return defs;
		}
		throw new Error(`No ownerDocument`);
	}
}

export class SVGSwitchElement extends SVGGraphicsElement {
	static TAGS = ["switch"];
}

export class SVGUseElement extends SVGGraphicsElement {
	static TAGS = ["use"];

	get transformM() {
		const m = Matrix.parse(this.getAttribute("transform") || "");
		const x = this.x.baseVal.value;
		const y = this.y.baseVal.value;
		if (x || y) {
			return Matrix.translate(x, y).multiply(m);
		}
		return m;
	}

	shapeBox(T?: Matrix | boolean) {
		const E =
			T === true
				? this.composedTransform()
				: T
				? T.multiply(this.transformM)
				: this.transformM;
		const ref = this.refElement();
		if (ref) {
			if (ref instanceof SVGSymbolElement) {
				return (ref as SVGGraphicsElement).shapeBox(E);
			}
			return (ref as SVGGraphicsElement).shapeBox().transform(E);
		}
		return Box.not();
	}
}
// https://svgwg.org/svg2-draft/struct.html#SymbolElement

export class SVGSymbolElement extends SVGGraphicsElement {
	static TAGS = ["symbol"];
	get _isViewportElement() {
		return 1;
	}
	shapeBox(T?: Matrix | boolean): Box {
		return shapeBoxVP(this, T);
	}
}

/// SVGTextContentElement //////////

export class SVGTextElement extends SVGTextContentElement {
	static TAGS = ["text"];
	shapeBox(T?: Matrix | boolean): Box {
		const E =
			T === true
				? this.composedTransform()
				: T
				? T.multiply(this.transformM)
				: this.transformM;
		let s;
		const {
			x: {
				baseVal: { value: x },
			},
			y: {
				baseVal: { value: y },
			},
		} = this;
		let box = Box.new();
		box = box.merge(
			Box.new(Vec.at(x, y).transform(E).toArray().concat([0, 0]))
		);
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.localName == "tspan") {
				box = sub.boundingBox(E).merge(box);
			}
		}
		return box;
	}
}

export class SVGTSpanElement extends SVGTextContentElement {
	static TAGS = ["tspan"];
	shapeBox(T?: Matrix | boolean) {
		let box = Box.new();
		// Returns a horrible bounding box that just contains the coord points
		// of the text without width or height (which is impossible to calculate)
		const E =
			T === true
				? this.composedTransform()
				: T
				? T.multiply(this.transformM)
				: this.transformM;
		let s;
		const x1 = (s = this.getAttribute("x")) ? userUnit(s, 0) : 0;
		const y1 = (s = this.getAttribute("y")) ? userUnit(s, 0) : 0;
		const fontsize = 16;
		const x2 = x1 + 0; // This is impossible to calculate!
		const y2 = y1 + fontsize;
		const a = Vec.at(x1, y1).transform(E);
		const b = Vec.at(x2, y2).transform(E).sub(a);
		box = box.merge(Box.new([a.x, a.y, Math.abs(b.x), Math.abs(b.y)]));
		return box;
	}
}

export class SVGTRefElement extends SVGTextContentElement {
	static TAGS = ["tref"];
}

export class SVGTextPathElement extends SVGTextContentElement {
	static TAGS = ["textPath"];
}

/// SVGElement //////////

export class SVGClipPathElement extends SVGElement {
	static TAGS = ["clipPath"];
}

export class SVGMaskElement extends SVGElement {
	static TAGS = ["mask"];
}

export class SVGMissingGlyphElement extends SVGElement {
	static TAGS = ["missing-glyph"];
}

export class SVGGlyphElement extends SVGElement {
	static TAGS = ["glyph"];
}

export class SVGPatternElement extends SVGElement {
	static TAGS = ["pattern"];
}

interface ScriptElement {
	_alreadyStarted?: boolean;
}

export class SVGScriptElement extends SVGElement {
	static TAGS = ["script"];
	_alreadyStarted?: boolean;

	// _eval() {
	// 	if (this._alreadyStarted) {
	// 		return;
	// 	}

	// 	// TODO: this text check doesn't seem completely the same as the spec, which e.g. will try to execute scripts with
	// 	// child element nodes. Spec bug? https://github.com/whatwg/html/issues/3419
	// 	const src = this.getAttributeNS(null, "src");
	// 	let text = !src && this.textContent;

	// 	if (!text || !src) {
	// 		return;
	// 	}

	// 	// if (!this._attached) {
	// 	// 	return;
	// 	// }

	// 	// const scriptBlocksTypeString = this._getTypeString();
	// 	// const type = getType(scriptBlocksTypeString);

	// 	// if (type !== "classic") {
	// 	// 	// TODO: implement modules, and then change the check to `type === null`.
	// 	// 	return;
	// 	// }

	// 	this._alreadyStarted = true;

	// 	// TODO: implement nomodule here, **but only after we support modules**.

	// 	// At this point we completely depart from the spec.

	// 	if (src) {
	// 		// this._fetchExternalScript();
	// 	} else {
	// 		// this._fetchInternalScript();
	// 	}
	// }

	// _fetchExternalScript(src: string) {
	// 	const document = this.ownerDocument;
	// 	if (document) {
	// 		const { defaultView: window } = document;
	// 		if(window){

	// 		}
	// 		document.resolveURL(src)
	// 	}
	// 	// const { ownerDocument: document, defaultView: window } =
	// 	// 	this.ownerDocument;
	// 	// const resourceLoader = document._fetcher;
	// 	// const { URL, defaultView } = document;
	// }
}

import { Element } from "../element.js";
import { userUnit, SVGLength, SVGLengthAttr } from "./length.js";
import { SVGLengthListAttr, SVGLengthList } from "./length-list.js";
import { SVGRectAttr } from "./rect.js";
import { SVGTransformListAttr, SVGTransform } from "./attr-transform.js";
import { DOMException } from "../event-target.js";
export { SVGLength, SVGTransform };
// const excl = /^SVGGraphicsElement|SVGGeometryElement|SVGFE[A-Z].+$/;
// Object.getOwnPropertyNames(window)
// 	.filter(
// 		(k) =>
// 			/^SVG_NS.+Element$/.test(k) &&
// 			!excl.test(k) &&
// 			Object.getPrototypeOf(window[k]) === SVGGeometryElement
// 	)
// 	.sort();
// const SVGGeometryElements = [
// 	"SVGCircleElement",
// 	"SVGPathElement",
// 	"SVGRectElement",
// 	"SVGPolygonElement",
// 	"SVGPolylineElement",
// 	"SVGLineElement",
// 	"SVGEllipseElement",
// ];
// Object.getOwnPropertyNames(window)
// 	.filter(
// 		(k) =>
// 			/^SVG_NS.+Element$/.test(k) &&
// 			!excl.test(k) &&
// 			Object.getPrototypeOf(window[k]) === SVGGraphicsElement
// 	)
// 	.sort();
// const SVGGraphicsElements = [
// 	"SVGAElement",
// 	"SVGDefsElement",
// 	"SVGForeignObjectElement",
// 	"SVGGElement",
// 	"SVGImageElement",
// 	"SVGSVGElement",
// 	"SVGSwitchElement",
// 	"SVGTextContentElement",
// 	"SVGUseElement",
// ];
// Object.getOwnPropertyNames(window)
// 	.filter(
// 		(k) =>
// 			/^SVG_NS.+Element$/.test(k) &&
// 			!excl.test(k) &&
// 			Object.getPrototypeOf(window[k]) === SVGElement
// 	)
// 	.sort();
// const SVGElements = [
//   "SVGAnimationElement",
//   "SVGClipPathElement",
//   "SVGComponentTransferFunctionElement",
//   "SVGDescElement",
//   "SVGFilterElement",
//   "SVGGradientElement",
//   "SVGMPathElement",
//   "SVGMarkerElement",
//   "SVGMaskElement",
//   "SVGMetadataElement",
//   "SVGPatternElement",
//   "SVGScriptElement",
//   "SVGStopElement",
//   "SVGStyleElement",
//   "SVGSymbolElement",
//   "SVGTitleElement",
//   "SVGViewElement"
// ]
