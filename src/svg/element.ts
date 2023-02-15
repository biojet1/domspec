import { Vec, Box, Matrix, PathLS, SVGTransform } from "svggeom";
/// Base Elements //////////

interface IBBoxParam {
	fill?: boolean;
	stroke?: boolean;
	markers?: boolean;
	clipped?: boolean;
}

export class SVGTextContentElement extends SVGGraphicsElement {}

export class SVGGeometryElement extends SVGGraphicsElement {
	describe(): string {
		/* c8 ignore next */
		throw new Error("NotImplemented");
	}
	getPath() {
		return PathLS.parse(this.describe());
	}
	get path() {
		try {
			return PathLS.parse(this.describe());
		} catch (err) {
			return new PathLS(undefined);
		}
	}
	// https://greensock.com/forums/topic/13681-svg-gotchas/page/2/?tab=comments#comment-72060
	objectBBox(T?: Matrix) {
		let { path } = this;
		if (path.firstPoint) {
			if (T) {
				return path.transform(T).bbox();
			}
			return path.bbox();
		}
		return Box.not();
	}

	shapeBox(T?: Matrix) {
		return this._shapeBox(T);
	}

	_shapeBox(tm?: Matrix) {
		let { path } = this;
		if (path.firstPoint) {
			// NOTE: bbox error
			// if (tm) {
			// 	return path.bbox().transform(tm.cat(this.ownTM));
			// } else {
			// 	return path.bbox().transform(this.rootTM);
			// }
			if (tm) {
				path = path.transform(tm.cat(this.ownTM));
			} else {
				path = path.transform(this.rootTM);
			}
			return path.bbox();
		}
		return Box.not();
	}

	toPathElement() {
		const { ownerDocument } = this;
		if (ownerDocument) {
			const p = ownerDocument.createElementNS(
				this.namespaceURI,
				"path"
			) as SVGGeometryElement;
			let s;
			(s = this.describe()) && p.setAttribute("d", s);
			(s = this.getAttribute("style")) && p.setAttribute("style", s);
			(s = this.getAttribute("class")) && p.setAttribute("class", s);
			(s = this.getAttribute("transform")) && p.setAttribute("transform", s);
			return p;
		}
		throw DOMException.new(`InvalidStateError`);
	}
	getTotalLength() {
		return this.path.length;
	}
	getPointAtLength(L: number) {
		return this.path.pointAtLength(L, true);
	}
}

/// SVGGeometryElement //////////
class _PathD extends PathLS {
	_node: SVGPathElement;
	constructor(node: SVGPathElement) {
		super(undefined);
		this._node = node;
	}
	assign() {
		this._node.setAttribute("d", this.toString());
		return this;
	}
	// end() {
	// 	return this._node;
	// }
}

export class SVGPathElement extends SVGGeometryElement {
	static TAGS = ["path"];
	describe() {
		return this.getAttribute("d") || "";
	}
	beginPath() {
		// ._beginPath().withFont().text()
		return new _PathD(this);
	}

	fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		this.setAttribute(
			"d",
			PathLS.parse(this.describe()).transform(tm).describe()
		);
		this.removeAttribute("transform");
	}
}

export class SVGCircleElement extends SVGGeometryElement {
	static TAGS = ["circle"];
	describe() {
		const r = this.r.baseVal.value;
		const x = this.cx.baseVal.value;
		const y = this.cy.baseVal.value;

		if (r === 0) return "M0 0";

		return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${
			x - r
		} ${y}`;
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
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		const {
			a: scale_x,
			b: skew_x,
			c: skew_y,
			d: scale_y,
			e: translate_x,
			f: translate_y,
		} = tm;
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
			this.removeAttribute("transform");
		} else {
			throw new Error(
				`fuseTransform of ${this.constructor.name} with skew_x == ${skew_x}, skew_y == ${skew_y}`
			);
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
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		if (!tm.isIdentity) {
			let x1 = this.x1.baseVal.value;
			let x2 = this.x2.baseVal.value;
			let y1 = this.y1.baseVal.value;
			let y2 = this.y2.baseVal.value;
			[x1, y1] = Vec.pos(x1, y1).transform(tm);
			[x2, y2] = Vec.pos(x2, y2).transform(tm);
			this.x1.baseVal.value = x1;
			this.x2.baseVal.value = x2;
			this.y1.baseVal.value = y1;
			this.y2.baseVal.value = y2;
		}
		this.removeAttribute("transform");
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
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		if (!tm.isIdentity) {
			const l = this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vec.pos(e[0], e[1]))
				.map((e) => [...e.transform(tm)])
				.map((e) => `${e[0]},${e[1]}`);
			l && this.setAttribute("points", l.join(" "));
		}
		this.removeAttribute("transform");
	}
}

export class SVGPolylineElement extends SVGGeometryElement {
	static TAGS = ["polyline"];
	describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p}` : "";
	}
	fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		if (!tm.isIdentity) {
			const l = this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vec.pos(e[0], e[1]))
				.map((e) => [...e.transform(tm)])
				.map((e) => `${e[0]},${e[1]}`);
			l && this.setAttribute("points", l.join(" "));
		}
		this.removeAttribute("transform");
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
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}
	_shapeBox(tm?: Matrix): Box {
		return this._viewportBox(tm);
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
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}
	_shapeBox(tm?: Matrix): Box {
		return this._viewportBox(tm);
	}
}

export class SVGSwitchElement extends SVGGraphicsElement {
	static TAGS = ["switch"];
}

export class SVGUseElement extends SVGGraphicsElement {
	static TAGS = ["use"];

	// get ownTM() {
	// 	// const m = Matrix.parse(this.getAttribute('transform') || '');
	// 	const m = Matrix.parse(this.getAttribute('transform') || '');
	// 	const x = this.x.baseVal.value;
	// 	const y = this.y.baseVal.value;
	// 	if (x || y) {
	// 		return Matrix.translate(x, y).cat(m);
	// 	}
	// 	return m;
	// }
	// set ownTM(m: Matrix) {
	// 	const x = this.x.baseVal.value;
	// 	const y = this.y.baseVal.value;
	// 	if (x || y) {
	// 		const m0 = Matrix.parse(this.getAttribute('transform') || '');

	// 		m = Matrix.translate(x, y).inverse().cat(m);
	// 	}
	// 	this.setAttribute('transform', m.toString());
	// }

	shapeBox(T?: Matrix) {
		return this._shapeBox(T);
	}

	_shapeBox(tm?: Matrix) {
		const ref = this.hrefElement;
		if (ref) {
			const m = (() => {
				let [p, o] = this.pairTM();
				const x = this.x.baseVal.value;
				const y = this.y.baseVal.value;
				if (x || y) {
					o = Matrix.translate(x, y).cat(o);
				}
				if (tm) {
					return tm.cat(o);
				} else {
					return p.cat(o);
				}
			})();

			if (ref instanceof SVGSymbolElement) {
				return (ref as SVGGraphicsElement)._shapeBox(m);
			} else {
				return (ref as SVGGraphicsElement)
					._shapeBox(Matrix.identity())
					.transform(m);
			}
		}
		return Box.not();
	}

	objectBBox(T?: Matrix) {
		// const E = T ? T.cat(this.ownTM) : this.ownTM;
		const ref = this.hrefElement;
		if (ref) {
			const m = (() => {
				let [p, o] = this.pairTM();
				const x = this.x.baseVal.value;
				const y = this.y.baseVal.value;
				if (x || y) {
					o = Matrix.translate(x, y).cat(o);
				}
				if (T) {
					return T.cat(o);
				} else {
					return o;
				}
			})();

			// if (ref instanceof SVGSymbolElement) {
			// 	return (ref as SVGGraphicsElement).objectBBox(m);
			// }

			// if (T) {
			// 	return (ref as SVGGraphicsElement).objectBBox(m);
			// }

			return (ref as SVGGraphicsElement).objectBBox(m);
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
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}
	_shapeBox(tm?: Matrix): Box {
		return this._viewportBox(tm);
	}
}

/// SVGTextContentElement //////////

export class SVGTextElement extends SVGTextContentElement {
	static TAGS = ["text"];
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}
	_shapeBox(tm?: Matrix): Box {
		const m = tm ? tm.cat(this.ownTM) : this.ownTM;
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
			Box.new(Vec.at(x, y).transform(m).toArray().concat([0, 0]))
		);
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.localName == "tspan") {
				box = sub.boundingBox(m).merge(box);
			}
		}
		return box;
	}
}

export class SVGTSpanElement extends SVGTextContentElement {
	static TAGS = ["tspan"];
	shapeBox(T?: Matrix) {
		return this._shapeBox(T);
	}

	_shapeBox(tm?: Matrix): Box {
		const m = tm ? tm.cat(this.ownTM) : this.ownTM;
		let box = Box.new();
		// Returns a horrible bounding box that just contains the coord points
		// of the text without width or height (which is impossible to calculate)
		let s;
		const x1 = this.x.baseVal.value;
		const y1 = this.y.baseVal.value;
		const fontsize = 16;
		const x2 = x1 + 0; // This is impossible to calculate!
		const y2 = y1 + fontsize;
		const a = Vec.at(x1, y1).transform(m);
		const b = Vec.at(x2, y2).transform(m).sub(a);
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

import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
import { SVGTransformListAttr } from "./attr-transform.js";
import { DOMException } from "../event-target.js";
export { SVGLength, SVGAnimatedLength } from "./length.js";
export { SVGRect, SVGAnimatedRect } from "./rect.js";
export { SVGLayout } from "./layout.js";
export { SVGElement, SVGGraphicsElement, SVGSVGElement };
