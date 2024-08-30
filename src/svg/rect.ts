function _format(box: SVGRect) {
	const { left, top, width, height } = box;
	return [left, top, width, height].map((n, i) => {
		// if (i < 2) {
		// 	if (isNaN(n)) {
		// 		n = 0;
		// 	}
		// }
		const v = n.toFixed(3);
		return v.indexOf(".") < 0 ? v : v.replace(/0+$/g, "").replace(/\.$/g, "");
	})
		.join(" ");
}

export class SVGAnimatedRect extends Attr {
	// _var?: { x: number; y: number; width: number; height: number } | string;
	_var?: SVGRect | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGRect) {
			let rec: BoundingBox | undefined = undefined;
			try {
				rec = SVGRect.parse(value);
			} catch (err) {
				//
			}
			if (rec && rec.is_valid()) {
				_var.copy(rec);
				return;
			}
		}
		this._var = value;

	}

	get value() {
		const { _var } = this;
		if (_var instanceof SVGRect) {
			return _format(_var);
		}
		return _var || "";
	}

	get baseVal(): SVGRect {
		const { _var } = this;
		if (_var instanceof SVGRect) {
			return _var;
		}
		if (!(_var === undefined || typeof _var === "string")) {
			throw new TypeError(`_var is ${_var}`)
		}
		{
			let box: SVGRect | undefined;
			try {
				if (_var) {
					box = SVGRect.parse(_var) as SVGRect;
				}
			} finally {
				if (!box || !box.is_valid()) {
					box = SVGRect.rect(0, 0, NaN, NaN) as SVGRect;
				}
				// box.owner = this.ownerElement as SVGSVGElement;
				return (this._var = box);
			}
		}
		// return (this.);
		// return null;
	}

	get animVal() {
		return this.baseVal;
	}

	get specified() {
		const { _var } = this;
		// return _var != undefined;
		return !!(_var && (!(_var instanceof SVGRect) || _var.is_valid()));
	}

	valueOf() {
		const { _var } = this;

		if (_var instanceof SVGRect) {
			if (_var.is_valid()) {
				return _format(_var);
			}
		} else {
			if (!(_var === undefined || typeof _var === "string")) {
				throw new TypeError(`_var is ${_var}`)
			}
			if (_var) {
				return _var;
			}
		}
	}

	_closeIn(
		...args: Array<
			| SVGGraphicsElement
			| BoundingBox
			| Vector
			| Ray
			| Array<SVGGraphicsElement | BoundingBox | Vector | Ray>
		>
	) {
		let bbox = contain(args);
		const o = this.ownerElement;
		if (o instanceof SVGGraphicsElement) {
			bbox = bbox.transform(o._innerTM.inverse());
		}
		const { _var } = this;
		if (_var instanceof SVGRect) {
			_var.copy(bbox);
		} else {
			this._var = new SVGRect(...bbox);
		}
		return this;
	}

	// https://svgwg.org/svg-next/coords.html#Units
	_calcWidth(): number {
		const { _var } = this;
		if (_var) {
			const { baseVal } = this;
			if (baseVal && baseVal.is_valid()) {
				return baseVal.width;
			}
		}
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			const a = o.width;
			if (a.specified) {
				return a.baseVal.value;
			}

			const v = o.nearestViewportElement as SVGSVGElement;
			if (v) {
				return v.viewBox._calcWidth();
			}

			const p = o.parentElement;
			if (p) {
				const csm = p.computedStyleMap();
				const q = csm.get("width");
				if (q) {
					let r = new SVGLength();
					if (r.parse(q.toString())) {
						return r.value;
					}
				}
			}
		}

		return 100;
	}
	_calcHeight(): number {
		const { _var } = this;
		if (_var) {
			const { baseVal } = this;
			if (baseVal && baseVal.is_valid()) {
				return baseVal.height;
			}
		}
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			const a = o.height;
			if (a.specified) {
				return a.baseVal.value;
			} else {
				const v = o.nearestViewportElement as SVGSVGElement;
				if (v) {
					const n = v.viewBox._calcHeight();
					return n;
				}
			}
			{
				const p = o.parentElement;
				if (p) {
					const csm = p.computedStyleMap();
					const q = csm.get("height");
					if (q) {
						let r = new SVGLength();
						if (r.parse(q.toString())) {
							return r.value;
						}
					}
				}
			}
		}

		return 100;
	}
	_calcBox(): BoundingBox {
		const { _var } = this;
		if (_var) {
			const { baseVal } = this;
			if (baseVal && baseVal.is_valid()) {
				return baseVal;
			}
		}
		let x = 0,
			y = 0,
			w = 100,
			h = 100;
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			x = o.x.baseVal.value;
			y = o.y.baseVal.value;
			w = this._calcWidth();
			h = this._calcHeight();
		}
		return BoundingBox.rect(x, y, w, h);
	}
}

function contain(
	args: Array<
		| SVGGraphicsElement
		| BoundingBox
		| Vector
		| Ray
		| Array<SVGGraphicsElement | BoundingBox | Vector | Ray>
	>
): BoundingBox {
	let bbox = SVGRect.not();
	for (const v of args) {
		if (v instanceof Array) {
			bbox.merge_self(contain(v));
		} else if (v instanceof BoundingBox) {
			bbox.merge_self(v);
		} else if (v instanceof Vector || v instanceof Ray) {
			const { x, y } = v;
			bbox.merge_self(BoundingBox.rect(x, y, 0, 0));
		} else {
			try {
				bbox.merge_self(v._boundingBox());
			} catch (err) {
				console.error(
					`Failed to merge ${v.constructor.name} ${bbox.constructor.name}(${bbox})`
				);
				throw err;
			}
		}
	}
	return bbox;
}


// import { BoxMut as SVGRect } from "svggeom";
import { BoundingBox, Vector, Ray, BoundingInterval } from "svggeom";

class SVGRect extends BoundingBox {
	public static parse(s: string) {
		const v = s.split(/[\s,]+/).map(parseFloat);
		return SVGRect.rect(v[0], v[1], v[2], v[3]);
	}
	set x(n: number) {
		const [a, b] = this[0];
		this[0] = new BoundingInterval([n, n + (b - a)]);
	}
	get x() {
		return this[0][0];
	}
	set y(n: number) {
		const [a, b] = this[1];
		this[1] = new BoundingInterval([n, n + (b - a)]);
	}
	get y() {
		return this[1].minimum
	}
	set width(n: number) {
		const { minimum } = this[0];
		this[0] = new BoundingInterval([minimum, minimum + n]);
	}
	get width() {
		const { size } = this[0];
		return size
	}
	set height(n: number) {
		const { minimum } = this[1];
		this[1] = new BoundingInterval([minimum, minimum + n]);
	}
	get height() {
		const { size } = this[1];
		return size
	}

	copy(that: BoundingBox) {
		const [x, y] = that;
		this[0] = x;
		this[1] = y;
		return this;
	}
}

import { Attr } from "../attr.js";
import { SVGGraphicsElement, SVGSVGElement, SVGElement } from "./element.js";
import { SVGLength } from "./length.js";
export { SVGRect };
