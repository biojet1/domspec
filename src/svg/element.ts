import { Point, Box, Matrix, Path } from "svggeom";
import { userUnit } from "./units.js";
/// Base Elements //////////

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
		while ((parent = this.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}
	get farthestViewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		let farthest: SVGElement | null = null;
		while ((parent = this.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				farthest = parent as SVGElement;
			}
		}
		return farthest;
	}

	get transformM() {
		return Matrix.parse(this.getAttribute("transform") || "");
	}

	set transformM(T: Matrix ) {
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
		const { parentNode: parent, transformM } = this;
		if (parent) {
			if (parent instanceof SVGGraphicsElement) {
				return parent.composedTransform().multiply(transformM);
			}
		}
		return transformM;
	}

	shapeBox(T?: Matrix | boolean) {
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
		let { ownerDocument } = this;
		if (ownerDocument) {
			const p = ownerDocument.createElement("path");
			let s;
			(s = this.describe()) && p.setAttribute("d", s);
			(s = this.getAttribute("style")) && p.setAttribute("style", s);
			(s = this.getAttribute("class")) && p.setAttribute("class", s);
			(s = this.getAttribute("transform")) &&
				p.setAttribute("transform", s);
			return p;
		}
		throw new Error(`No ownerDocument`);
	}
}

/// SVGGeometryElement //////////

export class SVGCircleElement extends SVGGeometryElement {
	static TAGS = ["circle"];
	describe() {
		const r = parseFloat(this.getAttribute("r") || "0");
		const x = parseFloat(this.getAttribute("cx") || "0");
		const y = parseFloat(this.getAttribute("cy") || "0");

		if (r === 0) return "M0 0";

		return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${
			x + r
		} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
	}
}

export class SVGPathElement extends SVGGeometryElement {
	static TAGS = ["path"];
	describe() {
		return this.getAttribute("d") || "";
	}
}

export class SVGRectElement extends SVGGeometryElement {
	static TAGS = ["rect"];
	describe() {
		const width = parseFloat(this.getAttribute("width") || "0");
		const height = parseFloat(this.getAttribute("height") || "0");
		const x = parseFloat(this.getAttribute("x") || "0");
		const y = parseFloat(this.getAttribute("y") || "0");
		return `M ${x} ${y} h ${width} v ${height} H ${x} V ${y}`;
	}
}

export class SVGLineElement extends SVGGeometryElement {
	static TAGS = ["line"];
	describe() {
		const x1 = parseFloat(this.getAttribute("x1") || "0");
		const x2 = parseFloat(this.getAttribute("x2") || "0");
		const y1 = parseFloat(this.getAttribute("y1") || "0");
		const y2 = parseFloat(this.getAttribute("y2") || "0");
		return `M ${x1} ${y1} L ${x2} ${y2}`;
	}
}

export class SVGEllipseElement extends SVGGeometryElement {
	static TAGS = ["ellipse"];
	describe() {
		const rx = parseFloat(this.getAttribute("rx") || "0");
		const ry = parseFloat(this.getAttribute("ry") || "0");
		const x = parseFloat(this.getAttribute("cx") || "0");
		const y = parseFloat(this.getAttribute("cy") || "0");
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
}

export class SVGPolylineElement extends SVGGeometryElement {
	static TAGS = ["polyline"];
	describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p}` : "";
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
}

export class SVGGElement extends SVGGraphicsElement {
	static TAGS = ["g"];
}

export class SVGImageElement extends SVGGraphicsElement {
	static TAGS = ["image"];
	get _isViewportElement() {
		return 1;
	}
	shapeBox(T?: Matrix | boolean) {
		let width = this.getAttribute("width");
		let height = this.getAttribute("height");
		let x = this.getAttribute("x");
		let y = this.getAttribute("y");
		if (x && y && width && height) {
			return Box.new(`${x} ${y} ${width} ${height}`);
		}
		return Box.not();
	}
}

export class SVGSVGElement extends SVGGraphicsElement {
	static TAGS = ["svg"];
	get _isViewportElement() {
		return 1;
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
		const x = this.getAttribute("x");
		const y = this.getAttribute("y");
		if (x || y) {
			return Matrix.translate(
				parseFloat(x || "0"),
				parseFloat(y || "0")
			).multiply(m);
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
			return (ref as SVGGraphicsElement).shapeBox(true).transform(E);
		}
		return Box.not();
	}
}

/// SVGTextContentElement //////////

export class SVGTextElement extends SVGTextContentElement {
	static TAGS = ["text"];
	shapeBox(T?: Matrix | boolean) {
		const E =
			T === true
				? this.composedTransform()
				: T
				? T.multiply(this.transformM)
				: this.transformM;
		let s;
		const x = (s = this.getAttribute("x")) ? userUnit(s, 0) : 0;
		const y = (s = this.getAttribute("y")) ? userUnit(s, 0) : 0;
		let box = Box.new();
		box = box.merge(
			Box.new(Point.at(x, y).transform(E).toArray().concat([0, 0]))
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
		const a = Point.at(x1, y1).transform(E);
		const b = Point.at(x2, y2).transform(E).sub(a);
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

export class SVGSymbolElement extends SVGElement {
	static TAGS = ["symbol"];
	get _isViewportElement() {
		return 1;
	}
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

import { Element } from "../element.js";

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
