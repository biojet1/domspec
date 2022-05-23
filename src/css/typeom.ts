export class CSSStyleValue {
	_associatedProperty?: string;
	parse(property: string, cssText: string): CSSStyleValue {
		throw new Error(`Not implemented`);
	}
	parseAll(property: string, cssText: string): CSSStyleValue[] {
		throw new Error(`Not implemented`);
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

	toString() {
		return `${this.value}${this.unit}`;
	}

	constructor(value: number, unit: string) {
		super();
		this.value = value;
		this.unit = unit;
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

/** /
const units = {
	ch: 'ch',
	rem: 'rem',
	vw: 'vw',
	vh: 'vh',
	vmin: 'vmin',
	vmax: 'vmax',
	cm: 'cm',
	mm: 'mm',
	in: 'in',
	pt: 'pt',
	pc: 'pc',
	px: 'px',
	Q: 'Q',
	deg: 'deg',
	grad: 'grad',
	rad: 'rad',
	turn: 'turn',
	s: 's',
	ms: 'ms',
	Hz: 'Hz',
	kHz: 'kHz',
	dpi: 'dpi',
	dpcm: 'dpcm',
	dppx: 'dppx',
	fr: 'fr'
}
for(const [k, v] of Object.entries(units)){
	console.info(`export const ${k} = (value: number) => new CSSUnitValue(value, '${v}');`)
}
*/

export const ch = (value: number) => new CSSUnitValue(value, 'ch');
export const rem = (value: number) => new CSSUnitValue(value, 'rem');
export const vw = (value: number) => new CSSUnitValue(value, 'vw');
export const vh = (value: number) => new CSSUnitValue(value, 'vh');
export const vmin = (value: number) => new CSSUnitValue(value, 'vmin');
export const vmax = (value: number) => new CSSUnitValue(value, 'vmax');
export const cm = (value: number) => new CSSUnitValue(value, 'cm');
export const mm = (value: number) => new CSSUnitValue(value, 'mm');
// export const 'in' = (value: number) => new CSSUnitValue(value, 'in');
export const pt = (value: number) => new CSSUnitValue(value, 'pt');
export const pc = (value: number) => new CSSUnitValue(value, 'pc');
export const px = (value: number) => new CSSUnitValue(value, 'px');
export const Q = (value: number) => new CSSUnitValue(value, 'Q');
export const deg = (value: number) => new CSSUnitValue(value, 'deg');
export const grad = (value: number) => new CSSUnitValue(value, 'grad');
export const rad = (value: number) => new CSSUnitValue(value, 'rad');
export const turn = (value: number) => new CSSUnitValue(value, 'turn');
export const s = (value: number) => new CSSUnitValue(value, 's');
export const ms = (value: number) => new CSSUnitValue(value, 'ms');
export const Hz = (value: number) => new CSSUnitValue(value, 'Hz');
export const kHz = (value: number) => new CSSUnitValue(value, 'kHz');
export const dpi = (value: number) => new CSSUnitValue(value, 'dpi');
export const dpcm = (value: number) => new CSSUnitValue(value, 'dpcm');
export const dppx = (value: number) => new CSSUnitValue(value, 'dppx');
export const fr = (value: number) => new CSSUnitValue(value, 'fr');
