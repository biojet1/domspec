export class SVGRectAttr extends Attr {
	// _var?: { x: number; y: number; width: number; height: number } | string;
	_var?: BoxMut | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			try {
				const { x, y, width, height } = BoxMut.parse(value);
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
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		}
		return _var || '';
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var;
		} else if (_var) {
			try {
				return (this._var = BoxMut.parse(_var) as BoxMut);
			} catch (err) {
				return null;
			}
		}
	}

	get specified() {
		return this._var != undefined;
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		} else {
			return _var?.toString();
		}
	}

	contain(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>) {
		let bbox = contain(args);
		const { _var } = this;
		if (_var instanceof BoxMut) {
			_var.copy(bbox);
		} else {
			this._var = BoxMut.new(bbox) as BoxMut;
		}
		return this;
	}

	contain2(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>) {
		let bbox = contain(args);
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			if (o.nearestViewportElement) {
				const [p, m] = o.splitTM();
				bbox = bbox.transform(p.multiply(o.innerTM).inverse());
			}
		}
		const { _var } = this;
		if (_var instanceof BoxMut) {
			_var.copy(bbox);
		} else {
			this._var = BoxMut.new(bbox) as BoxMut;
		}
		return this;
	}
	// https://svgwg.org/svg-next/coords.html#Units
	calcWidth(): number {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var.width;
		} else if (_var) {
			try {
				this._var = BoxMut.parse(_var) as BoxMut;
				return this._var.width;
			} catch (err) {
				console.error(`Failed to parse as Box "${_var}"`)
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
				const n = v.viewBox.calcWidth();
				return n;
				// const scale = v.innerTM.inverse().d;
				// return n * scale;
			}
		}

		// throw new Error(`calcWidth`);
		return 100;
	}
	calcHeight(): number {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var.height;
		} else if (_var) {
			try {
				this._var = BoxMut.parse(_var) as BoxMut;
				return this._var.height;
			} catch (err) {
				console.error(`Failed to parse as Box "${_var}"`)
			}
		}
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			const a = o.height;
			if (a.specified) {
				return a.baseVal.value;
			}

			const v = o.nearestViewportElement as SVGSVGElement;
			if (v) {
				const n = v.viewBox.calcHeight();
				return n;
				// const scale = v.innerTM.inverse().d;
				// return n * scale;
			} else if (o as SVGSVGElement) {

			}
		}

		// throw new Error(`calcWidth`);
		return 100;
	}
	calcBox(): Box {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var;
		} else if (_var) {
			try {
				return (this._var = BoxMut.parse(_var) as BoxMut);
			} catch (err) {
				console.error(`Failed to parse as Box "${_var}"`)
			}
		}
		let x = 0,
			y = 0,
			w = 100,
			h = 100;
		const o = this.ownerElement as SVGGraphicsElement;
		if (o) {
			let a;
			x = o.x.baseVal.value;
			y = o.y.baseVal.value;
			a = o.height;
			if (a.specified) {
				h = a.baseVal.value;
			} else {
				const v = o.nearestViewportElement as SVGSVGElement;
				if (v) {
					h = v.viewBox.calcHeight();
				}
			}
			a = o.width;
			if (a.specified) {
				w = a.baseVal.value;
			} else {
				const v = o.nearestViewportElement as SVGSVGElement;
				if (v) {
					w = v.viewBox.calcWidth();
				}
			}
		}
		return Box.forRect(x, y, w, h);
	}
}

function contain(
	args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>
): Box {
	let bbox = BoxMut.new() as BoxMut;
	for (const v of args) {
		if (v instanceof Array) {
			bbox.mergeSelf(contain(v));
		} else if (v instanceof Box) {
			bbox.mergeSelf(v);
		} else if (v instanceof Point || v instanceof Ray) {
			const { x, y } = v;
			bbox.mergeSelf(Box.new(x, y, 0, 0));
		} else {
			try {
				bbox.mergeSelf(v._boundingBox());
			} catch (err) {
				console.error(`Failed to merge ${v.constructor.name} ${bbox.constructor.name}(${bbox})`);
				throw err;
			}
		}
	}
	return bbox;
}

import { BoxMut, Box, Point, Ray } from 'svggeom';
import { Attr } from '../attr.js';
import { SVGGraphicsElement, SVGSVGElement } from './element.js';
