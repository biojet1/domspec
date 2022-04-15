export class SVGTransformList extends Array<SVGTransform> {
	clear() {
		this.splice(0);
	}
	getItem(i: number) {
		return this[i];
	}
	removeItem(i: number) {
		const m = this[i];
		this.splice(i, 1);
		return m;
	}
	appendItem(newItem: SVGTransform) {
		this.push(newItem);
		return newItem;
	}
	initialize(newItem: SVGTransform) {
		this.clear();
		this.push(newItem);
		return newItem;
	}
	insertItemBefore(newItem: SVGTransform, i: number) {
		let j;
		while ((j = this.indexOf(newItem)) >= 0) {
			this.splice(j, 1);
		}
		this.splice(i, 0, newItem);
	}
	replaceItem(newItem: SVGTransform, i: number) {
		let j;
		while ((j = this.indexOf(newItem)) >= 0) {
			this.splice(j, 1);
			--i;
		}
		this.splice(i, 0, newItem);
	}
	createSVGTransformFromMatrix(newItem: Matrix) {
		this.clear();
		const m = new SVGTransform();
		m.setMatrix(newItem);
		this.push(m);
		return m;
	}
	consolidate() {
		let { [0]: first, length: n } = this;
		const m = new SVGTransform();
		if (first) {
			m.setMatrix(first);
			let i = 1;
			while (i < n) {
				m.multiplySelf(this[i++]);
			}
		}
		return this.initialize(m);
	}

	toString() {
		let { [0]: first, length: n } = this;
		const m = new SVGTransform();
		if (first) {
			m.setMatrix(first);
			let i = 1;
			while (i < n) {
				m.multiplySelf(this[i++]);
			}
		}
		return m.toString();
	}
	get numberOfItems() {
		return this.length;
	}

	public static parse(d: string): SVGTransformList {
		const tl = new SVGTransformList();
		for (const str of d.split(/\)\s*,?\s*/).slice(0, -1)) {
			const kv = str.trim().split("(");
			const name = kv[0].trim();
			const args = kv[1].split(/[\s,]+/).map((str) => parseFloat(str));
			// console.log(name, args);
			tl.appendItem(
				(SVGTransform as any)[name](...args) as any as SVGTransform
			);
		}
		return tl;
	}
}

export class SVGTransform extends MatrixMut {
	θ?: number;
	get matrix() {
		return this;
	}
	get type() {
		const { a, b, c, d, e, f, θ } = this;
		// if (e || f) {
		// 	if (!b && !c && a === 1 && d === 1) {
		// 		return 2; // SVG_TRANSFORM_TRANSLATE
		// 	} else if (a === d && b === -c) {
		// 		return 4; // SVG_TRANSFORM_ROTATE
		// 	}
		// } else if (a !== 1 || d !== 1) {
		// 	if (!b && !c) {
		// 		return 3; // SVG_TRANSFORM_SCALE
		// 	} else if (a === d && b === -c) {
		// 		return 4; // SVG_TRANSFORM_ROTATE
		// 	}
		// } else if (b) {
		// 	if (!c) {
		// 		return 5; // SVG_TRANSFORM_SKEWX
		// 	}
		// } else if (c) {
		// 	return 6; // SVG_TRANSFORM_SKEWY
		// }
		if (θ) {
			// SVG_TRANSFORM_SKEWY, SVG_TRANSFORM_SKEWX, SVG_TRANSFORM_ROTATE
			return a === 1 && d === 1 && b ^ c ? (b ? 6 : 5) : 4;
		} else if (!b && !c) {
			if (e || f) {
				if (a === 1 && d === 1) {
					return 2; // SVG_TRANSFORM_TRANSLATE
				}
			} else if (a || d) {
				return 3; // SVG_TRANSFORM_SCALE
			}
		}
		return 1; // SVG_TRANSFORM_MATRIX
	}
	get angle() {
		return this.θ || 0;
		// return 0;
	}
	toString() {
		const { a, b, c, d, e, f, θ } = this;
		if (θ) {
			// SVG_TRANSFORM_SKEWY, SVG_TRANSFORM_SKEWX, SVG_TRANSFORM_ROTATE
			if (a === 1 && d === 1 && b ^ c) {
				if (b) {
					// SVG_TRANSFORM_SKEWY
				} else {
					// SVG_TRANSFORM_SKEWX
				}
			} else {
				// return `rotate(${θ},${c})`; // SVG_TRANSFORM_ROTATE
			}
		} else if (!b && !c) {
			if (e || f) {
				if (a === 1 && d === 1) {
					return `translate(${e},${f})`; // SVG_TRANSFORM_TRANSLATE
				}
			} else if (a || d) {
				return `scale(${a},${d})`; // SVG_TRANSFORM_SCALE
			}
		}
		return `matrix(${a},${b},${c},${d},${e},${f})`; // SVG_TRANSFORM_MATRIX
	}

	setTranslate(x = 0, y = 0) {
		this.setHexad(1, 0, 0, 1, x, y);
		delete this.θ;
	}
	setScale(sx: number, sy: number) {
		this.setHexad(sx, 0, 0, sy, 0, 0);
		delete this.θ;
	}
	setRotate(ang: number, x: number = 0, y: number = 0) {
		let cosθ, sinθ;

		switch ((this.θ = ang)) {
			case 0:
				cosθ = 1;
				sinθ = 0;
				break;
			case 90:
				cosθ = +0;
				sinθ = +1;
				break;
			case -90:
				cosθ = +0;
				sinθ = -1;
				break;
			case 180:
				cosθ = -1;
				sinθ = +0;
				break;
			case -180:
				cosθ = -1;
				sinθ = -0;
				break;
			case 270:
				cosθ = -0;
				sinθ = -1;
				break;
			case -270:
				cosθ = -0;
				sinθ = +1;
				break;
			default:
				const θ = ((ang % 360) * PI) / 180;
				cosθ = cos(θ);
				sinθ = sin(θ);
		}
		this.setHexad(
			cosθ,
			sinθ,
			-sinθ,
			cosθ,
			x ? -cosθ * x + sinθ * y + x : 0,
			y ? -sinθ * x - cosθ * y + y : 0
		);
	}
	setSkewX(x: number) {
		this.setHexad(1, 0, tan(radians((this.θ = x))), 1, 0, 0);
	}
	setSkewY(y: number) {
		this.setHexad(1, tan(radians((this.θ = y))), 0, 1, 0, 0);
	}
	setMatrix(matrix: Matrix) {
		const { a, b, c, d, e, f } = matrix;
		this.setHexad(a, b, c, d, e, f);
		delete this.θ;
	}
	static parse(desc: string) {
		const { a, b, c, d, e, f } = Matrix.parse(desc);
		return new SVGTransform([a, b, c, d, e, f]);
	}
	static translate(x = 0, y = 0) {
		return new SVGTransform([1, 0, 0, 1, x, y]);
	}
	static scale(sx: number, sy: number = 0) {
		return new SVGTransform([sx, 0, 0, sy, 0, 0]);
	}
	static rotate(ang: number, x: number = 0, y: number = 0) {
		const θ = ((ang % 360) * PI) / 180;
		const cosθ = ang === 90 ? 0 : cos(θ);
		const sinθ = ang === 90 ? 1 : sin(θ);
		return new SVGTransform([
			cosθ,
			sinθ,
			-sinθ,
			cosθ,
			x ? -cosθ * x + sinθ * y + x : 0,
			y ? -sinθ * x - cosθ * y + y : 0,
		]);
	}

	static skewX(x: number) {
		return new SVGTransform([1, 0, tan(radians(x)), 1, 0, 0]);
	}
	static skewY(y: number) {
		return new SVGTransform([1, tan(radians(y)), 0, 1, 0, 0]);
	}
	static matrix(
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number
	) {
		return new SVGTransform([a, b, c, d, e, f]);
	}
	[shot: string]: any;

	static readonly SVG_TRANSFORM_UNKNOWN = 0;
	static readonly SVG_TRANSFORM_MATRIX = 1;
	static readonly SVG_TRANSFORM_TRANSLATE = 2;
	static readonly SVG_TRANSFORM_SCALE = 3;
	static readonly SVG_TRANSFORM_ROTATE = 4;
	static readonly SVG_TRANSFORM_SKEWX = 5;
	static readonly SVG_TRANSFORM_SKEWY = 6;
}

export class SVGTransformListAttr extends Attr {
	_var?: SVGTransformList | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			_var.initialize(SVGTransform.parse(value));
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			return _var.consolidate()?.toString() || "";
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			return _var;
		} else if (_var) {
			return (this._var = SVGTransformList.parse(_var));
		} else {
			return (this._var = new SVGTransformList());
		}
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			const m = _var.consolidate();
			if (m && !m.isIdentity()) {
				return m.toString();
			}
		} else {
			return _var?.toString();
		}
	}
}
const { tan, cos, sin, PI } = Math;
const radians = function (d: number) {
	return ((d % 360) * PI) / 180;
};
import { Matrix, MatrixMut } from "svggeom";
import { Attr } from "../attr.js";
