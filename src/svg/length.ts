const BOTH_MATCH =
	/^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;
const CONVERSIONS: { [k: string]: number } = {
	in: 96.0,
	pt: 1.3333333333333333,
	px: 1.0,
	mm: 3.779527559055118,
	cm: 37.79527559055118,
	m: 3779.527559055118,
	km: 3779527.559055118,
	Q: 0.94488188976378,
	pc: 16.0,
	yd: 3456.0,
	ft: 1152.0,
	'': 1.0,
};

export function userUnit(src: string, default_value?: number): number {
	if (src) {
		const m = src.match(BOTH_MATCH);
		if (m) {
			const value = parseFloat(m[1]);
			const unit = m.pop();
			if (unit) {
				const mul = CONVERSIONS[unit];
				if (mul) {
					return value * mul;
				}
			} else {
				return value;
			}
			throw new Error(`Can not convert to user unit ${src}, [${m}]`);
		} else {
			throw new Error(`Invalid unit ${src}`);
		}
	} else if (default_value != undefined) {
		return default_value;
	}
	throw new Error(`Invalid unit ${src}`);
}

const UNITS = ['', '', '%', 'em', 'ex', 'px', 'cm', 'mm', 'in', 'pt', 'pc'];
const CONVS = [0, 1, 1];

export class SVGNumber {
	_num?: number;

	constructor(value?: string) {
		value && (this._num = parseFloat(value));
	}

	get value() {
		return this._num ?? 0;
	}

	set value(value: number) {
		this._num = value;
	}
}

export class SVGLength {
	_unit?: number;
	_num?: number | string;

	constructor(value?: string) {
		if (value == undefined) {
			this._num = 0;
			this._unit = 1;
		} else this.parse(value);
	}

	get unitType() {
		const { _unit = 1 } = this;
		return _unit;
	}

	get valueInSpecifiedUnits() {
		const { _unit = 1 } = this;
		return _unit < 0 ? 0 : (this._num as number) ?? 0;
		// return this._num ?? 0;
	}

	set valueInSpecifiedUnits(value: number) {
		if (isFinite(value)) {
			this._num = value;
		} else {
			throw new TypeError();
		}
	}

	get valueAsString() {
		const { _num, _unit } = this;
		if (_unit == undefined) {
			//
		} else if (_unit >= 0) {
			return `${_num}${UNITS[_unit] || ''}`;
		} else {
			//
		}
		return '';
	}

	set valueAsString(value: string) {
		this.parse(value, true);
	}

	parse(value: string, fail = false) {
		const m = BOTH_MATCH.exec(value);
		if (m) {
			const num = parseFloat(m[1]);
			const suf = m.pop();
			if (suf) {
				const unit = UNITS.indexOf(suf.toLowerCase());
				if (unit > 1) {
					this._num = num;
					this._unit = unit;
					return true;
				}
			} else {
				this._num = num;
				this._unit = 1;
				return true;
			}
		}
		if (fail) {
			throw DOMException.new('SyntaxError');
		} else {
			this._num = value;
			this._unit = -1;
		}
	}

	get value() {
		const { _num = 0, _unit = 1 } = this;

		switch (_unit) {
			case 0:
			case 1:
			case 5:
				return _num as number;
			case 2: // "%"
				return (this.getRelativeLength() / 100) * (_num as number);
			case 3: //  "em"
			case 4: //  "ex"
				throw DOMException.new('NotSupportedError');
			case 6:
				return ((_num as number) * 4800) / 127;
			case 7:
				return ((_num as number) * 480) / 127;
			case 8:
				return (_num as number) * 96;
			case 9:
				return ((_num as number) * 4) / 3;
			case 10:
				return (_num as number) * 16;
			default:
				throw new TypeError(`Invalid unit: '${_unit}'`);
		}
	}

	set value(value: number) {
		let { _unit = 1 } = this;
		if (isFinite(value)) {
			switch (_unit) {
				case 0:
				case 1:
				case 5:
					this._num = value;
					return;
				case 2:
					this._num = (this.getRelativeLength() * value) / 100;
					return;
				case 3: //  "em"
				case 4: //  "ex"
					throw DOMException.new('NotSupportedError');
				case 6:
					this._num = (127 * value) / 4800;
					return;
				case 7:
					this._num = (127 * value) / 480;
					return;
				case 8:
					this._num = value / 96;
					return;
				case 9:
					this._num = (value * 3) / 4;
					return;
				case 10:
					this._num = 16 / value;
					return;
				default:
					throw new TypeError(`invalid ${_unit}`);
			}
		}
		throw new TypeError(`value=[${value}] unit=[${_unit}]`);
	}

	newValueSpecifiedUnits(unitType: number, valueInSpecifiedUnits: number) {
		if (isFinite(valueInSpecifiedUnits)) {
			this.convertToSpecifiedUnits(unitType);
			this._num = valueInSpecifiedUnits;
		} else {
			throw new TypeError();
		}
	}

	convertToSpecifiedUnits(unitType: number) {
		switch (unitType) {
			case 1:
			case 5:
				this._num = this.value;
				break;
			case 2:
				this._num = (this.getRelativeLength() * this.value) / 100;
				break;
			case 3: //  "em"
			case 4: //  "ex"
				throw DOMException.new('NotSupportedError');
			case 6:
				this._num = (127 * this.value) / 4800;
				break;
			case 7:
				this._num = (127 * this.value) / 480;
				break;
			case 8:
				this._num = this.value / 96;
				break;
			case 9:
				this._num = (this.value * 3) / 4;
				break;
			case 10:
				this._num = 16 / this.value;
				break;
			default:
				if (unitType == undefined) {
					throw new TypeError();
				} else {
					throw DOMException.new('NotSupportedError');
				}
		}
		this._unit = unitType;
	}

	toString() {
		const { _num, _unit } = this;
		if (_unit == undefined) {
			return null;
		} else if (_unit >= 0) {
			return `${_num}${UNITS[_unit] || ''}`;
		} else {
			// _unit === -1;
			return `${_num}`;
		}
	}

	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const g = e.nearestViewportElement as SVGGraphicsElement;
			const w = g?.width.baseVal.value ?? 100;
			const h = g?.height.baseVal.value ?? 100;
			return Math.sqrt(w ** 2 + h ** 2) / Math.sqrt(2);
		} else {
			return 100;
		}
	}

	static SVG_LENGTHTYPE_UNKNOWN = 0;
	static SVG_LENGTHTYPE_NUMBER = 1;
	static SVG_LENGTHTYPE_PERCENTAGE = 2;
	static SVG_LENGTHTYPE_EMS = 3;
	static SVG_LENGTHTYPE_EXS = 4;
	static SVG_LENGTHTYPE_PX = 5;
	static SVG_LENGTHTYPE_CM = 6;
	static SVG_LENGTHTYPE_MM = 7;
	static SVG_LENGTHTYPE_IN = 8;
	static SVG_LENGTHTYPE_PT = 9;
	static SVG_LENGTHTYPE_PC = 10;
}

export class SVGLengthAttr extends Attr {
	_var?: SVGLength | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			_var.parse(value);
		} else if (value != undefined) {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var.valueAsString;
		}
		return _var || '';
	}

	get baseVal(): SVGLength {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var;
		} else {
			// const v = (this._var = new SVGLength(_var));
			// _setAssoc(v, this);
			// return v;
			let v = this.parse(_var);
			_setAssoc(v, this);
			return v;
		}
	}
	parse(s?: string) {
		if (s) {
			let v = new SVGLength();
			if (v.parse(s)) {
				return (this._var = v);
			}
		}
		return new SVGLength('0');
	}
	valueOf() {
		return this._var?.toString();
		// _var == undefined returns undefined
		// _var == string returns string
		// _var == SVGLength returns SVGLength.toString();
	}
	get specified() {
		return this._var != undefined;
	}

	val() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var.value;
		} else if (_var != undefined) {

		}
	}
}

const _wm_assoc = new WeakMap<any, Attr>();

function _setAssoc(that: any, value: Attr) {
	_wm_assoc.set(that, value);
}

function _getAssoc(that: any): SVGGraphicsElement | null | undefined {
	return _wm_assoc.get(that)?.ownerElement as SVGGraphicsElement;
}

export class SVGLengthW extends SVGLength {
	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const v = e.nearestViewportElement as SVGGraphicsElement;
			if (v) {
				return v.viewBox.calcWidth();
				// const n = v.viewBox.calcWidth();
				// // const n = v.width.baseVal.value;
				// // const [p] = v.splitTM();
				// // const scale = p.multiply(v.innerTM).a;
				// // const scale = v.innerTM.a;
				// const scale = v.innerTM.a;
				// return n * scale;
			}
		}
		return 100;
	}
}

export class SVGLengthH extends SVGLength {
	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const v = e.nearestViewportElement as SVGGraphicsElement;
			if (v) {
				return v.viewBox.calcHeight();
				// const n = v.viewBox.calcHeight();
				// const n = v.height.baseVal.value;
				// const scale = v.splitTM()[0].multiply(v.innerTM).a;
				// const scale = v.innerTM.d;
				// return n * scale;
			}
		}
		return 100;
	}
}

export class SVGLengthWAttr extends SVGLengthAttr {
	parse(s?: string) {
		if (s) {
			let v = new SVGLengthW();
			if (v.parse(s)) {
				return (this._var = v);
			}
		}
		return new SVGLengthW('100%');
	}
}

export class SVGLengthHAttr extends SVGLengthAttr {
	parse(s?: string) {
		if (s) {
			let v = new SVGLengthH();
			if (v.parse(s)) {
				return (this._var = v);
			}
		}
		return new SVGLengthH('100%');
	}
}

export class SVGLengthXAttr extends SVGLengthAttr {
	parse(s?: string) {
		if (s) {
			let v = new SVGLengthW();
			if (v.parse(s)) {
				return (this._var = v);
			}
		}
		return new SVGLengthW('0');
	}
}

export class SVGLengthYAttr extends SVGLengthAttr {
	parse(s?: string) {
		if (s) {
			let v = new SVGLengthH();
			if (v.parse(s)) {
				return (this._var = v);
			}
		}
		return new SVGLengthH('0');
	}
}

import { DOMException } from '../event-target.js';
import { Attr } from '../attr.js';
import { SVGGraphicsElement } from './_element.js';
