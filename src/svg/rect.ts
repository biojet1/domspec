// export class SVGRect extends BoxMut {
// 	owner?: SVGSVGElement;

// 	override get x() {
// 		return this._x ?? 0;
// 	}

// 	override set x(value: number) {
// 		this._x = value;
// 	}

// 	override get y() {
// 		return this._y ?? 0;
// 	}

// 	override set y(value: number) {
// 		this._y = value;
// 	}

// 	override get width() {
// 		let { _w = 100 } = this;
// 		if (_w == null || isNaN(_w)) {
// 			const { owner: o } = this;
// 			if (o) {
// 				// const a = o.width;
// 				// if (a.specified && a.baseVal !== this) {
// 				// 	_w = a.baseVal.value;
// 				// } else {
// 				// 	const v = o.nearestViewportElement as SVGSVGElement;
// 				// 	if (v) {
// 				// 		// _w = v.viewBox.baseVal.width;
// 				// 		_w = v.viewBox._calcWidth();
// 				// 	} else {
// 				// 		const p = o.parentElement;
// 				// 		if (p) {
// 				// 			const csm = p.computedStyleMap();
// 				// 			const q = csm.get("width");
// 				// 			if (q) {
// 				// 				let r = new SVGLength();
// 				// 				if (r.parse(q.toString())) {
// 				// 					_w = r.value;
// 				// 				}
// 				// 			}
// 				// 		}
// 				// 	}
// 				// }
// 			}
// 		}
// 		return _w;
// 	}

// 	override set width(value: number) {
// 		this._w = value;
// 	}

// 	override get height() {
// 		let { _h = 100 } = this;
// 		if (_h == null || isNaN(_h)) {
// 			const { owner: o } = this;
// 			if (o) {
// 				// const a = o.height;
// 				// if (a.specified  && a.baseVal !== this) {
// 				// 	_h = a.baseVal.value;
// 				// } else {
// 				// 	const v = o.nearestViewportElement as SVGSVGElement;
// 				// 	if (v) {
// 				// 		// _h = v.viewBox.baseVal.height;
// 				// 		_h = v.viewBox._calcHeight();
// 				// 	} else {
// 				// 		const p = o.parentElement;
// 				// 		if (p) {
// 				// 			const csm = p.computedStyleMap();
// 				// 			const q = csm.get("height");
// 				// 			if (q) {
// 				// 				let r = new SVGLength();
// 				// 				if (r.parse(q.toString())) {
// 				// 					_h = r.value;
// 				// 				}
// 				// 			}
// 				// 		}
// 				// 	}
// 				// }
// 			}
// 		}
// 		return _h;
// 	}

// 	override set height(value: number) {
// 		this._h = value;
// 	}
// 	// toString() {
// 	// 	return this.toArray()
// 	// 		.map((n) => {
// 	// 			const v = n.toFixed(3);
// 	// 			return v.indexOf(".") < 0
// 	// 				? v
// 	// 				: v.replace(/0+$/g, "").replace(/\.$/g, "");
// 	// 		})
// 	// 		.join(" ");
// 	// }
// }

function _format(box: SVGRect) {
	return box
		.toArray()
		.map((n, i) => {
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
			try {
				const { x, y, width, height } = SVGRect.parse(value);
				_var.x = x;
				_var.y = y;
				_var.width = width;
				_var.height = height;
			} catch (err) {
				this._var = value;
			}
		} else {
			this._var = value;
		}
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

		{
			let box: SVGRect | undefined;
			try {
				if (_var) {
					box = SVGRect.parse(_var) as SVGRect;
				}
			} finally {
				if (!box) {
					box = SVGRect.forRect(0, 0, NaN, NaN);
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
		return !!(_var && (!(_var instanceof SVGRect) || _var.isValid()));
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof SVGRect) {
			if (_var.isValid()) {
				return _format(_var);
			}
		} else if (_var) {
			return _var;
		}
	}

	_closeIn(
		...args: Array<
			| SVGGraphicsElement
			| Box
			| Vec
			| Ray
			| Array<SVGGraphicsElement | Box | Vec | Ray>
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
			this._var = SVGRect.new(bbox) as SVGRect;
		}
		return this;
	}

	// https://svgwg.org/svg-next/coords.html#Units
	_calcWidth(): number {
		const { _var } = this;
		if (_var) {
			const { baseVal } = this;
			if (baseVal && baseVal.isValid()) {
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
			if (baseVal && baseVal.isValid()) {
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
	_calcBox(): Box {
		const { _var } = this;
		if (_var) {
			const { baseVal } = this;
			if (baseVal && baseVal.isValid()) {
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
		return Box.forRect(x, y, w, h);
	}
}

function contain(
	args: Array<
		| SVGGraphicsElement
		| Box
		| Vec
		| Ray
		| Array<SVGGraphicsElement | Box | Vec | Ray>
	>
): Box {
	let bbox = SVGRect.new() as SVGRect;
	for (const v of args) {
		if (v instanceof Array) {
			bbox.mergeSelf(contain(v));
		} else if (v instanceof Box) {
			bbox.mergeSelf(v);
		} else if (v instanceof Vec || v instanceof Ray) {
			const { x, y } = v;
			bbox.mergeSelf(Box.new(x, y, 0, 0));
		} else {
			try {
				bbox.mergeSelf(v._boundingBox());
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
import { BoxMut as SVGRect } from "svggeom";
import { Box, Vec, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement, SVGSVGElement, SVGElement } from "./element.js";
import { SVGLength } from "./length.js";
export { SVGRect };
