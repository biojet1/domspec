export class SVGRect extends BoxMut {
	owner?: SVGSVGElement;

	override get x() {
		return this._x ?? 0;
	}

	override set x(value: number) {
		this._x = value;
	}

	override get y() {
		return this._y ?? 0;
	}

	override set y(value: number) {
		this._y = value;
	}

	override get width() {
		let { _w = 100 } = this;
		if (_w == null) {
			const { owner: o } = this;
			if (o) {
				const a = o.width;
				if (a.specified) {
					_w = a.baseVal.value;
				} else {
					const v = o.nearestViewportElement as SVGSVGElement;
					if (v) {
						// _w = v.viewBox.baseVal.width;
						_w = v.viewBox._calcWidth();
					}
				}
			}
		}
		return _w;
	}

	override set width(value: number) {
		this._w = value;
	}

	override get height() {
		let { _h = 100 } = this;
		if (_h == null) {
			const { owner: o } = this;
			if (o) {
				const a = o.height;
				if (a.specified) {
					_h = a.baseVal.value;
				} else {
					const v = o.nearestViewportElement as SVGSVGElement;
					if (v) {
						// _h = v.viewBox.baseVal.height;
						_h = v.viewBox._calcHeight();
					}
				}
			}
		}
		return _h;
	}

	override set height(value: number) {
		this._h = value;
	}
	toString() {
		return this.toArray()
			.map((n) => {
				const v = n.toFixed(3);
				return v.indexOf(".") < 0
					? v
					: v.replace(/0+$/g, "").replace(/\.$/g, "");
			})
			.join(" ");
	}
}

export class SVGAnimatedRect extends Attr {
	// _var?: { x: number; y: number; width: number; height: number } | string;
	_var?: SVGRect | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof BoxMut) {
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
		if (_var instanceof BoxMut) {
			return _var.toString();
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var;
		} else if (_var) {
			try {
				return (this._var = SVGRect.parse(_var) as BoxMut);
			} catch (err) {
				// return null;
			}
		}
		// return (this._var = SVGRect.forRect(0, 0, 0, 0));
		return null;
	}

	get animVal() {
		return this.baseVal;
	}

	get specified() {
		return this._var != undefined;
	}

	valueOf() {
		return this._var?.toString();
	}

	contain(
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
			bbox = bbox.transform(o._localTM().inverse());
		}
		const { _var } = this;
		if (_var instanceof BoxMut) {
			_var.copy(bbox);
		} else {
			this._var = BoxMut.new(bbox) as BoxMut;
		}
		return this;
	}

	contain2(
		...args: Array<
			| SVGGraphicsElement
			| Box
			| Vec
			| Ray
			| Array<SVGGraphicsElement | Box | Vec | Ray>
		>
	) {
		return this.contain(...args);
	}
	// https://svgwg.org/svg-next/coords.html#Units
	_calcWidth(): number {
		const { baseVal } = this;
		if (baseVal) {
			return baseVal.width;
		}
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			const a = o.width;
			if (a.specified) {
				return a.baseVal.value;
			}
			const v = o.nearestViewportElement as SVGSVGElement;
			if (v) {
				const n = v.viewBox._calcWidth();
				return n;
			}
		}

		return 100;
	}
	_calcHeight(): number {
		const { baseVal } = this;
		if (baseVal) {
			return baseVal.height;
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
		}

		return 100;
	}
	_calcBox(): Box {
		const { baseVal } = this;
		if (baseVal) {
			return baseVal;
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
	let bbox = BoxMut.new() as BoxMut;
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

import { BoxMut, Box, Vec, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement, SVGSVGElement } from "./element.js";
