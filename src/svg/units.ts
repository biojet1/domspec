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
	} else if (default_value !== undefined) {
		return default_value;
	}
	throw new Error(`Invalid unit ${src}`);
}

const UNITS = ["", "", "%", "em", "ex", "px", "cm", "mm", "in", "pt", "pc"];
const CONVS = [0, 1, 1];

// class SVGLength1 {
// 	attr: SVGLengthAttr;
// 	constructor(attr: SVGLengthAttr) {
// 		this.attr = attr;
// 	}
// 	get unitType() {
// 		return this.attr._unit;
// 	}
// 	get valueInSpecifiedUnits() {
// 		return this.attr._num;
// 	}
// 	get valueAsString() {
// 		return this.attr.value;
// 	}
// 	get value() {
// 		let { _num, _unit } = this.attr;
// 		if (_unit) {
// 			switch (_unit) {
// 				// case "":
// 				// case "px":
// 				case 0:
// 				case 1:
// 				case 5:
// 					return _num;
// 			}
// 			return CONVERSIONS[_unit] * (_num || 0);
// 		}
// 		return NaN;
// 	}
// 	// newValueSpecifiedUnits(unitType: number, valueInSpecifiedUnits: number);
// 	// convertToSpecifiedUnits(unitType: number);
// }

export class SVGLength {
	_unit: number;
	_num: number;
	constructor(value?: string) {
		this._num = 0;
		this._unit = 1;
		if (value) this.valueAsString = value;
	}
	get unitType() {
		return this._unit;
	}
	get valueInSpecifiedUnits() {
		return this._num;
	}

	set valueInSpecifiedUnits(value: number) {
		if (isFinite(value)) {
			this._num = value;
		} else {
			throw new TypeError();
		}
	}

	// parse(value: string) {
	// 	if (value) {
	// 		const m = value.match(BOTH_MATCH);
	// 		if (m) {
	// 			const num = parseFloat(m[1]);
	// 			const unit = m.pop();
	// 			this._num = num;
	// 			if (unit) {
	// 				this._unit = UNITS.indexOf(unit);
	// 			} else {
	// 				this._unit = 1;
	// 			}
	// 			// if (num >= 0) {
	// 			// 	this._num = num;
	// 			// }
	// 		} else {
	// 			throw new Error(`Invalid unit ${value}`);
	// 		}
	// 	} else {
	// 		this._num = 0;
	// 		this._unit = 1;
	// 	}
	// }
	get valueAsString() {
		let { _num, _unit } = this;
		return `${_num}${UNITS[_unit] || ""}`;
	}
	set valueAsString(value: string) {
		const m = BOTH_MATCH.exec(value);
		if (m) {
			const num = parseFloat(m[1]);
			const unit = UNITS.indexOf((m.pop() || "").toLowerCase());
			if (unit >= 0) {
				this._num = num;
				this._unit = unit;
				return;
			}
		}
		throw DOMException.new("SyntaxError");
	}
	get value() {
		let { _num, _unit } = this;
		if (_unit) {
			switch (_unit) {
				case 0:
				case 1:
				case 5:
					return _num;
			}
			return CONVERSIONS[_unit] * _num;
		}
		return NaN;
	}
	set value(value: number) {
		let { _num, _unit } = this;
		if (isFinite(value)) {
			switch (_unit) {
				case 1:
				case 5:
					this._num = value;
					return;
				case 2: // "%"
				case 3: //  "em"
				case 4: //  "ex"
					throw DOMException.new("NotSupportedError");
				case 6:
					this._num = (4800 * value) / 127;
					return;
				case 7:
					this._num = (480 * value) / 127;
					return;
				case 8:
					this._num = 96 * value;
					return;
				case 9:
					this._num = (value * 4) / 3;
					return;
				case 9:
					this._num = 16 * value;
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
			// this._unit = unitType;
			this._num = valueInSpecifiedUnits;
		} else {
			throw new TypeError();
		}
	}
	convertToSpecifiedUnits(unitType: number) {
		if (unitType > 0 && unitType < 11) {
			this._unit = unitType;
		} else if (unitType === undefined) {
			throw new TypeError();
		} else {
			throw DOMException.new("NotSupportedError");
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
	// _baseVal?: SVGLength;
	// _unit?: number;
	// _num?: number;
	_var?: SVGLength | string;

	set value(value: string) {
		// const m = value.match(BOTH_MATCH);
		// if (m) {
		// 	const num = parseFloat(m[1]);
		// 	const unit = m.pop();
		// 	this._num = num;
		// 	if (unit) {
		// 		this._unit = UNITS.indexOf(unit);
		// 	} else {
		// 		delete this._unit;
		// 	}
		// 	throw new Error(`Can not convert to user unit ${value}, [${m}]`);
		// } else {
		// 	throw new Error(`Invalid unit ${value}`);
		// }
		const { _var } = this;
		if (_var instanceof SVGLength) {
			_var.valueAsString = value;
		} else {
			this._var = value;
		}
		// if (typeof _var === "string") {
		// 	this._var = value;
		// } else if (_var) {
		// 	_var.parse(value);
		// } else {
		// 	this._var = value;
		// }
	}

	get value() {
		// let { _num, _unit } = this;
		// if (_num === undefined) {
		// 	return _unit ? _unit + "" : "";
		// } else {
		// 	switch (_unit) {
		// 		case undefined:
		// 		case 0:
		// 		case 1:
		// 		case 5:
		// 			return _num + "";
		// 	}
		// 	return `${_num + 0}${_unit}`;
		// }
		const { _var } = this;
		// if (typeof _var === "string") {
		// 	return _var;
		// } else if (_var) {
		// 	return _var.valueAsString;
		// }
		if (_var instanceof SVGLength) {
			return _var.valueAsString;
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof SVGLength) {
			return _var;
		} else {
			return (this._var = new SVGLength(_var));
		}
		// if (typeof _var === "string") {
		// 	return (this._var = new SVGLength(_var));
		// } else if (_var) {
		// 	return _var;
		// } else {
		// 	return (this._var = new SVGLength());
		// }
		// return this._baseVal || (this._baseVal = new SVGLength(this));
	}

	// get baseValQ() {

	// 	return this._baseVal || null;
	// }

	// valueOf() {
	// 	let { tokensQ: tokens } = this;
	// 	return tokens && tokens.size > 0 ? tokens.format() : null;
	// }
}

import { Attr } from "../attr.js";
import { DOMException } from "../event-target.js";
