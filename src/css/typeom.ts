export class CSSStyleValue {
	_associatedProperty?: string;
	parse(property: string, cssText: string): CSSStyleValue {
		throw new Error(`Not implemented`);
	}
	parseAll(property: string, cssText: string): CSSStyleValue[] {
		throw new Error(`Not implemented`);
	}

	_parse_css_style_value(property_name: string, css_text: string) {
		if (property_name.startsWith("--")) {
			property_name = property_name.toLowerCase();
		}
		switch (css_text.toLowerCase()) {
			case "currentcolor":
			case "transparent":
			case "default":
			case "inherit":
			case "initial":
			case "revert":
			case "unset":
				css_text = css_text.toLowerCase()
		}
	}
}

export class CSSKeywordValue extends CSSStyleValue {
	value: string;
	constructor(value: string) {
		super();
		this.value = value;
	}
}

type CSSKeywordish = String | CSSKeywordValue | string;
type CSSNumberish = CSSNumericValue | number;

// class CSSVariableReferenceValue {
//     constructor(variable: string, fallback?: CSSUnparsedValue)
//     variable: string;
//     readonly fallback?: CSSUnparsedValue;
// }

export class CSSNumericValue {
	// add(...args) {
	// 	const Constructor = this.constructor
	// 	const result = new Constructor(this.value, this.unit)
	// 	const values = []
	// 	for (let arg of args) {
	// 		if (arg instanceof Constructor) {
	// 			if (values.length || result.unit !== arg.unit) {
	// 				values.push(arg)
	// 			} else {
	// 				result.value += arg.value
	// 			}
	// 		} else if (
	// 			arg instanceof CSSMathProduct ||
	// 			arg instanceof CSSMathMax ||
	// 			arg instanceof CSSMathMin ||
	// 			arg instanceof CSSMathInvert
	// 		 ) {
	// 			values.push(arg)
	// 		} else {
	// 			return null
	// 		}
	// 	}
	// 	return values.length ? new CSSMathSum(result, ...values) : result
	// }
}

export class CSSUnitValue extends CSSNumericValue {
	value: number;
	unit: string;

	override toString() {
		return `${this.value}${this.unit}`;
	}

	constructor(value: number, unit: string) {
		super();
		this.value = value;
		this.unit = unit;
		if (!isFinite(value)) throw new Error(`Invalid value: "${value}"`);
	}
	static parse(text: string) {
		const m = String(text).match(
			/^([-+]?[0-9]*\.?[0-9]+)(|%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|Q|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|fr)?$/
		);
		if (m) {
			const [, value, unit] = m;
			return new CSSUnitValue(
				parseFloat(value),
				unit ? (unit == "%" ? "percent" : unit) : "number"
			);
		}
	}
	to(target_unit: string) {
		const { value, unit } = this;

		// if (unit == target_unit) return new this(value, unit);
		/*
  const canonical_unit = canonicalUnit(this.unit);
  if (canonical_unit != canonicalUnit(target_unit) ||
      !canonical_unit )
    return null;

  const scale_factor =
      toCanonicalUnitsScaleFactor(this.unit) /
      toCanonicalUnitsScaleFactor(target_unit);

  return CSSUnitValue::Create(this.value * scale_factor, target_unit);

*/
	}
}

interface CSSTransformComponent {
	is2D: boolean;
	// toMatrix(): DOMMatrix;
	toString(): string;
}

// class CSSRotate implements CSSTransformComponent {
//     constructor(angle: CSSNumericValue);
//     constructor(x: CSSNumberish, y: CSSNumberish, z: CSSNumberish, angle: CSSNumericValue)
//     x: CSSNumberish;
//     y: CSSNumberish;
//     z: CSSNumberish;
//     angle: CSSNumericValue;
// 	constructor(x: CSSNumberish, y?: CSSNumberish, z?: CSSNumberish, angle?: CSSNumericValue) {
// 		this.value = value;
// 	}
// 	get is2D(){
// 		return this.z != undefined;
// 	}

// }

export class CSSMathValue extends CSSNumericValue {}

export class CSS {
	static ch = (value: number) => new CSSUnitValue(value, "ch");
	static rem = (value: number) => new CSSUnitValue(value, "rem");
	static vw = (value: number) => new CSSUnitValue(value, "vw");
	static vh = (value: number) => new CSSUnitValue(value, "vh");
	static vmin = (value: number) => new CSSUnitValue(value, "vmin");
	static vmax = (value: number) => new CSSUnitValue(value, "vmax");
	static cm = (value: number) => new CSSUnitValue(value, "cm");
	static mm = (value: number) => new CSSUnitValue(value, "mm");
	static in = (value: number) => new CSSUnitValue(value, "in");
	static pt = (value: number) => new CSSUnitValue(value, "pt");
	static pc = (value: number) => new CSSUnitValue(value, "pc");
	static px = (value: number) => new CSSUnitValue(value, "px");
	static Q = (value: number) => new CSSUnitValue(value, "q");
	static deg = (value: number) => new CSSUnitValue(value, "deg");
	static grad = (value: number) => new CSSUnitValue(value, "grad");
	static rad = (value: number) => new CSSUnitValue(value, "rad");
	static turn = (value: number) => new CSSUnitValue(value, "turn");
	static s = (value: number) => new CSSUnitValue(value, "s");
	static ms = (value: number) => new CSSUnitValue(value, "ms");
	static Hz = (value: number) => new CSSUnitValue(value, "hz");
	static kHz = (value: number) => new CSSUnitValue(value, "khz");
	static dpi = (value: number) => new CSSUnitValue(value, "dpi");
	static dpcm = (value: number) => new CSSUnitValue(value, "dpcm");
	static dppx = (value: number) => new CSSUnitValue(value, "dppx");
	static fr = (value: number) => new CSSUnitValue(value, "fr");
}
const category = {
	number: "number",
	percent: "percent",
	length: "px",
	time: "s",
	angle: "deg",
	frequency: "Hz",
};
