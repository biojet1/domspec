export declare class CSSStyleValue {
    _associatedProperty?: string;
    parse(property: string, cssText: string): CSSStyleValue;
    parseAll(property: string, cssText: string): CSSStyleValue[];
    _parse_css_style_value(property_name: string, css_text: string): void;
}
export declare class CSSKeywordValue extends CSSStyleValue {
    value: string;
    constructor(value: string);
}
export declare class CSSNumericValue {
}
export declare class CSSUnitValue extends CSSNumericValue {
    value: number;
    unit: string;
    toString(): string;
    constructor(value: number, unit: string);
    static parse(text: string): CSSUnitValue | undefined;
    to(target_unit: string): void;
}
export declare class CSSMathValue extends CSSNumericValue {
}
export declare class CSS {
    static ch: (value: number) => CSSUnitValue;
    static rem: (value: number) => CSSUnitValue;
    static vw: (value: number) => CSSUnitValue;
    static vh: (value: number) => CSSUnitValue;
    static vmin: (value: number) => CSSUnitValue;
    static vmax: (value: number) => CSSUnitValue;
    static cm: (value: number) => CSSUnitValue;
    static mm: (value: number) => CSSUnitValue;
    static in: (value: number) => CSSUnitValue;
    static pt: (value: number) => CSSUnitValue;
    static pc: (value: number) => CSSUnitValue;
    static px: (value: number) => CSSUnitValue;
    static Q: (value: number) => CSSUnitValue;
    static deg: (value: number) => CSSUnitValue;
    static grad: (value: number) => CSSUnitValue;
    static rad: (value: number) => CSSUnitValue;
    static turn: (value: number) => CSSUnitValue;
    static s: (value: number) => CSSUnitValue;
    static ms: (value: number) => CSSUnitValue;
    static Hz: (value: number) => CSSUnitValue;
    static kHz: (value: number) => CSSUnitValue;
    static dpi: (value: number) => CSSUnitValue;
    static dpcm: (value: number) => CSSUnitValue;
    static dppx: (value: number) => CSSUnitValue;
    static fr: (value: number) => CSSUnitValue;
}
