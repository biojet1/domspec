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
	"": 1.0,
};

const UNITS = ["", "", "%", "em", "ex", "px", "cm", "mm", "in", "pt", "pc"];
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
			return `${_num}${UNITS[_unit] || ""}`;
		} else if (_num != undefined) {
			return `${_num}`;
		}
		return "";
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
			throw DOMException.new("SyntaxError");
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
				throw DOMException.new("NotSupportedError");
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
			case -1:
				return 0;
			default:
				throw new TypeError(`Invalid unit: '${_unit}'`);
		}
	}

	set value(value: number) {
		const { _unit = 1 } = this;
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
					throw DOMException.new("NotSupportedError");
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
				case -1:
					this._unit = 1;
					this._num = 0;
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
				throw DOMException.new("NotSupportedError");
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
					throw DOMException.new("NotSupportedError");
				}
		}
		this._unit = unitType;
	}

	toString() {
		const { _num, _unit } = this;
		if (_unit == undefined) {
			return null;
		} else if (_unit >= 0) {
			return `${_num}${UNITS[_unit] || ""}`;
		} else {
			// _unit === -1;
			return `${_num}`;
		}
	}

	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const v = e.nearestViewportElement as SVGGraphicsElement;
			if (v) {
				const b = v.viewBox;
				const w = b._calcWidth();
				const h = b._calcHeight();
				// return Math.sqrt(w ** 2 + h ** 2) / Math.sqrt(2);
				return Math.sqrt((w ** 2 + h ** 2) / 2);
			}
		}
		return 0;
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

export class SVGAnimatedLength extends Attr {
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
		return _var || "";
	}

	get baseVal(): SVGLength {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var;
		} else {
			let v = this._parse(_var);
			_setAssoc(v, this);
			return (this._var = v);
		}
	}
	_parse(s?: string) {
		if (s) {
			let v = new SVGLength();
			if (v.parse(s)) {
				return v;
			}
		}
		return new SVGLength();
	}

	valueOf() {
		return this._var?.toString();
		// _var == undefined returns undefined
		// _var == string returns String.toString()
		// _var == SVGLength returns SVGLength.toString();
	}

	get specified() {
		return this._var != undefined;
	}

	toUU() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			_var.convertToSpecifiedUnits(1);
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

// https://svgwg.org/svg2-draft/geometry.html#Sizing
export class SVGLengthW extends SVGLength {
	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const v = e.nearestViewportElement as SVGGraphicsElement;
			if (v) {
				return v.viewBox._calcWidth();
			} else if (e instanceof SVGSVGElement) {
				const a = e.viewBox;
				if (a.specified) {
					return a._calcWidth();
				}
			}
		}
		return 0;
	}
}

export class SVGLengthH extends SVGLength {
	getRelativeLength(): number {
		const e = _getAssoc(this);
		if (e) {
			const v = e.nearestViewportElement as SVGGraphicsElement;
			if (v) {
				return v.viewBox._calcHeight();
			} else if (e instanceof SVGSVGElement) {
				const a = e.viewBox;
				if (a.specified) {
					return a._calcHeight();
				}
			}
		}
		return 0;
	}
}

export class SVGLengthWAttr extends SVGAnimatedLength {
	_parse(s?: string) {
		if (s) {
			let v = new SVGLengthW();
			if (v.parse(s)) {
				return v;
			}
		}
		return new SVGLengthW("100%");
	}
	toUU() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			_var.convertToSpecifiedUnits(1);
		} else {
			//(this._var = _var = this.auto())
		}
	}
}

export class SVGLengthHAttr extends SVGAnimatedLength {
	_parse(s?: string) {
		if (s) {
			let v = new SVGLengthH();
			if (v.parse(s)) {
				return v;
			}
		}
		return new SVGLengthH("100%");
	}
}

export class SVGLengthXAttr extends SVGAnimatedLength {
	_parse(s?: string) {
		if (s) {
			let v = new SVGLengthW();
			if (v.parse(s)) {
				return v;
			}
		}
		return new SVGLengthW();
	}
}

export class SVGLengthYAttr extends SVGAnimatedLength {
	_parse(s?: string) {
		if (s) {
			let v = new SVGLengthH();
			if (v.parse(s)) {
				return v;
			}
		}
		return new SVGLengthH();
	}
}

import { DOMException } from "../event-target.js";
import { Attr } from "../attr.js";
import { SVGGraphicsElement, SVGSVGElement } from "./_element.js";
