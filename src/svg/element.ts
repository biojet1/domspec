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
}

export class SVGTextContentElement extends SVGGraphicsElement {}

export class SVGGeometryElement extends SVGGraphicsElement {
	describe(): string {
		throw new Error("NotImplemented");
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
		return `M ${this.getAttribute("points")} Z`;
	}
}

export class SVGPolylineElement extends SVGGeometryElement {
	static TAGS = ["polyline"];
	describe() {
		return `M ${this.getAttribute("points")}`;
	}
}

/// SVGGraphicsElement //////////

export class SVGAElement extends SVGGraphicsElement {
	static TAGS = ["a"];
}

export class SVGDefsElement extends SVGGraphicsElement {
	static TAGS = ["defs"];
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
}

export class SVGSVGElement extends SVGGraphicsElement {
	static TAGS = ["svg"];
	get _isViewportElement() {
		return 1;
	}
}

export class SVGSwitchElement extends SVGGraphicsElement {
	static TAGS = ["switch"];
}

export class SVGUseElement extends SVGGraphicsElement {
	static TAGS = ["use"];
}

/// SVGTextContentElement //////////

export class SVGTextElement extends SVGTextContentElement {
	static TAGS = ["text"];
}

export class SVGTSpanElement extends SVGTextContentElement {
	static TAGS = ["tspan"];
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
