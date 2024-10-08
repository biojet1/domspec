import { Vector, BoundingBox, Matrix, PathLC, SVGTransform } from "svggeom";
/// Base Elements //////////

export class SVGMarkerElement extends SVGGraphicsElement {
	static TAGS = ["marker"];
	get _isViewportElement() {
		return 2;
	}
	_shapeBox(tm?: Matrix): BoundingBox {
		return this._viewportBox(tm);
	}
}

export class SVGTextContentElement extends SVGGraphicsElement { }

export class SVGGeometryElement extends SVGGraphicsElement {
	_describe(): string {
		/* c8 ignore next */
		throw new Error("NotImplemented");
	}
	get _path() {
		try {
			return PathLC.parse(this._describe());
		} catch (err) {
			return new PathLC(undefined);
		}
	}
	// https://greensock.com/forums/topic/13681-svg-gotchas/page/2/?tab=comments#comment-72060
	_objectBBox(T?: Matrix) {
		let { _path } = this;
		if (_path.from) {
			if (T) {
				return _path.transform(T).bbox();
			}
			return _path.bbox();
		}
		return BoundingBox.not();
	}

	_shapeBox(tm?: Matrix) {
		if (tm) {
			return this._objectBBox(tm.cat(this._ownTM));
		} else {
			return this._objectBBox(this._rootTM);
		}
	}

	_toPathElement() {
		const { ownerDocument } = this;
		if (ownerDocument) {
			const p = ownerDocument.createElementNS(
				this.namespaceURI,
				"path"
			) as SVGGeometryElement;
			let s;
			(s = this._describe()) && p.setAttribute("d", s);
			(s = this.getAttribute("style")) && p.setAttribute("style", s);
			(s = this.getAttribute("class")) && p.setAttribute("class", s);
			(s = this.getAttribute("transform")) && p.setAttribute("transform", s);
			return p;
		}
		throw DOMException.new(`InvalidStateError`);
	}
	getTotalLength() {
		return this._path.length;
	}
	getPointAtLength(L: number) {
		return this._path.point_at_length(L, true);
	}
}

/// SVGGeometryElement //////////
class _PathD extends PathLC {
	_node: SVGPathElement;
	constructor(node: SVGPathElement) {
		super(undefined);
		this._node = node;
	}
	assign() {
		this._node.setAttribute("d", this.toString());
		return this;
	}
}

export class SVGPathElement extends SVGGeometryElement {
	static TAGS = ["path"];
	_describe() {
		return this.getAttribute("d") || "";
	}
	_beginPath() {
		// ._beginPath().withFont().text()
		return new _PathD(this);
	}

	_fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this._ownTM.post_cat(parentT) : this._ownTM;
		this.setAttribute(
			"d",
			PathLC.parse(this._describe()).transform(tm).describe()
		);
		this.removeAttribute("transform");
	}
}

export class SVGCircleElement extends SVGGeometryElement {
	static TAGS = ["circle"];
	_describe() {
		const r = this.r.baseVal.value;
		const x = this.cx.baseVal.value;
		const y = this.cy.baseVal.value;

		if (r === 0) return "M0 0";

		return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${x - r
			} ${y}`;
	}
}

export class SVGRectElement extends SVGGeometryElement {
	static TAGS = ["rect"];
	_describe() {
		const width = this.width.baseVal.value;
		const height = this.height.baseVal.value;
		const x = this.x.baseVal.value;
		const y = this.y.baseVal.value;
		const rx = this.rx.baseVal.value;
		const ry = this.ry.baseVal.value;

		return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
	}
	_fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this._ownTM.post_cat(parentT) : this._ownTM;
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
				`fuse transform of ${this.constructor.name} with skew_x == ${skew_x}, skew_y == ${skew_y}`
			);
		}
	}
}

export class SVGLineElement extends SVGGeometryElement {
	static TAGS = ["line"];
	_describe() {
		const x1 = this.x1.baseVal.value;
		const x2 = this.x2.baseVal.value;
		const y1 = this.y1.baseVal.value;
		const y2 = this.y2.baseVal.value;
		return `M ${x1} ${y1} L ${x2} ${y2}`;
	}
	_fuseTransform(parentT: Matrix) {
		let tm = parentT ? this._ownTM.post_cat(parentT) : this._ownTM;
		if (!tm.is_identity()) {
			let x1 = this.x1.baseVal.value;
			let x2 = this.x2.baseVal.value;
			let y1 = this.y1.baseVal.value;
			let y2 = this.y2.baseVal.value;
			[x1, y1] = Vector.new(x1, y1).transform(tm);
			[x2, y2] = Vector.new(x2, y2).transform(tm);
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
	_describe() {
		const rx = this.rx.baseVal.value;
		const ry = this.ry.baseVal.value;
		const x = this.cx.baseVal.value;
		const y = this.cy.baseVal.value;
		return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx
			} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
	}
}

export class SVGPolygonElement extends SVGGeometryElement {
	static TAGS = ["polygon"];
	_describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p} Z` : "";
	}
	_fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this._ownTM.post_cat(parentT) : this._ownTM;
		if (!tm.is_identity()) {
			const l = this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vector.new(e[0], e[1]))
				.map((e) => [...e.transform(tm)])
				.map((e) => `${e[0]},${e[1]}`);
			l && this.setAttribute("points", l.join(" "));
		}
		this.removeAttribute("transform");
	}
}

export class SVGPolylineElement extends SVGGeometryElement {
	static TAGS = ["polyline"];
	_describe() {
		const p = this.getAttribute("points");
		return p ? `M ${p}` : "";
	}
	_fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this._ownTM.post_cat(parentT) : this._ownTM;
		if (!tm.is_identity()) {
			const l = this.getAttribute("points")
				?.split(/(\s+)/)
				.filter((e) => e.trim().length > 0)
				.map((e) => e.split(",").map((v) => parseFloat(v)))
				.map((e) => Vector.new(e[0], e[1]))
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

	_objectBBox() {
		return BoundingBox.rect(0, 0, 0, 0);
	}
}

export class SVGForeignObjectElement extends SVGGraphicsElement {
	static TAGS = ["foreignObject"];
	get _isViewportElement() {
		return 2;
	}
	_shapeBox(tm?: Matrix): BoundingBox {
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
	_shapeBox(tm?: Matrix): BoundingBox {
		return this._viewportBox(tm);
	}
	_objectBBox(tm?: Matrix): BoundingBox {
		return this._viewportBox(tm);
	}
}

export class SVGSwitchElement extends SVGGraphicsElement {
	static TAGS = ["switch"];
}

export class SVGUseElement extends SVGGraphicsElement {
	static TAGS = ["use"];

	_shapeBox(tm?: Matrix) {
		const ref = this._hrefElement;
		if (ref) {
			const m = (() => {
				let [p, o] = this._pairTM();
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
		return BoundingBox.not();
	}

	_objectBBox(T?: Matrix) {
		// const E = T ? T.cat(this._ownTM) : this._ownTM;
		const ref = this._hrefElement;
		if (ref) {
			const m = (() => {
				let [p, o] = this._pairTM();
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
			// 	return (ref as SVGGraphicsElement)._objectBBox(m);
			// }

			// if (T) {
			// 	return (ref as SVGGraphicsElement)._objectBBox(m);
			// }

			return (ref as SVGGraphicsElement)._objectBBox(m);
		}
		return BoundingBox.not();
	}
}
// https://svgwg.org/svg2-draft/struct.html#SymbolElement

export class SVGSymbolElement extends SVGGraphicsElement {
	static TAGS = ["symbol"];
	get _isViewportElement() {
		return 1;
	}
	_shapeBox(tm?: Matrix): BoundingBox {
		return this._viewportBox(tm);
	}
}

/// SVGTextContentElement //////////

export class SVGTextElement extends SVGTextContentElement {
	static TAGS = ["text"];

	_shapeBox(tm?: Matrix): BoundingBox {
		const m = tm ? tm.cat(this._ownTM) : this._ownTM;
		const {
			x: {
				baseVal: { value: x },
			},
			y: {
				baseVal: { value: y },
			},
		} = this;
		let box = BoundingBox.not();
		const [a, b] = Vector.new(x, y).transform(m);
		box = box.merge(
			BoundingBox.rect(a, b, 0, 0)
		);
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.localName == "tspan") {
				box = sub._boundingBox(m).merge(box);
			}
		}
		return box;
	}
}

export class SVGTSpanElement extends SVGTextContentElement {
	static TAGS = ["tspan"];
	_shapeBox(tm?: Matrix): BoundingBox {
		const m = tm ? tm.cat(this._ownTM) : this._ownTM;
		let box = BoundingBox.not();
		// Returns a horrible bounding box that just contains the coord points
		// of the text without width or height (which is impossible to calculate)
		let s;
		const x1 = this.x.baseVal.value;
		const y1 = this.y.baseVal.value;
		const fontsize = 16;
		const x2 = x1 + 0; // This is impossible to calculate!
		const y2 = y1 + fontsize;
		const a = Vector.new(x1, y1).transform(m);
		const b = Vector.new(x2, y2).transform(m).subtract(a);
		box = box.merge(BoundingBox.rect(a.x, a.y, Math.abs(b.x), Math.abs(b.y)));
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
	_shapeBox(tm?: Matrix): BoundingBox {
		return this._viewportBox(tm);
	}
}

// interface ScriptElement {
// 	_alreadyStarted?: boolean;
// }

// export class SVGScriptElement extends SVGElement {
// 	static TAGS = ["script"];
// 	_alreadyStarted?: boolean;
// }

import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
import { DOMException } from "../event-target.js";
export { SVGLength, SVGAnimatedLength } from "./length.js";
export { SVGRect, SVGAnimatedRect } from "./rect.js";
export { SVGLayout } from "./layout.js";
export { SVGElement, SVGGraphicsElement, SVGSVGElement };
