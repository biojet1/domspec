export declare class SVGNumber {
    _num?: number;
    constructor(value?: string);
    get value(): number;
    set value(value: number);
}
export declare class SVGLength {
    _unit?: number;
    _num?: number | string;
    constructor(value?: string);
    get unitType(): number;
    get valueInSpecifiedUnits(): number;
    set valueInSpecifiedUnits(value: number);
    get valueAsString(): string;
    set valueAsString(value: string);
    parse(value: string, fail?: boolean): true | undefined;
    get value(): number;
    set value(value: number);
    newValueSpecifiedUnits(unitType: number, valueInSpecifiedUnits: number): void;
    convertToSpecifiedUnits(unitType: number): void;
    toString(): string | null;
    getRelativeLength(): number;
    static SVG_LENGTHTYPE_UNKNOWN: number;
    static SVG_LENGTHTYPE_NUMBER: number;
    static SVG_LENGTHTYPE_PERCENTAGE: number;
    static SVG_LENGTHTYPE_EMS: number;
    static SVG_LENGTHTYPE_EXS: number;
    static SVG_LENGTHTYPE_PX: number;
    static SVG_LENGTHTYPE_CM: number;
    static SVG_LENGTHTYPE_MM: number;
    static SVG_LENGTHTYPE_IN: number;
    static SVG_LENGTHTYPE_PT: number;
    static SVG_LENGTHTYPE_PC: number;
}
export declare class SVGAnimatedLength extends Attr {
    _var?: SVGLength | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGLength;
    _parse(s?: string): SVGLength;
    valueOf(): string | null | undefined;
    get specified(): boolean;
    toUU(): void;
}
export declare class SVGLengthW extends SVGLength {
    getRelativeLength(): number;
}
export declare class SVGLengthH extends SVGLength {
    getRelativeLength(): number;
}
export declare class SVGLengthWAttr extends SVGAnimatedLength {
    _parse(s?: string): SVGLengthW;
    toUU(): void;
}
export declare class SVGLengthHAttr extends SVGAnimatedLength {
    _parse(s?: string): SVGLengthH;
}
export declare class SVGLengthXAttr extends SVGAnimatedLength {
    _parse(s?: string): SVGLengthW;
}
export declare class SVGLengthYAttr extends SVGAnimatedLength {
    _parse(s?: string): SVGLengthH;
}
import { Attr } from "../attr.js";
