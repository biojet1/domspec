export class CSSStyleValue {
    _associatedProperty;
    parse(property, cssText) {
        throw new Error(`Not implemented`);
    }
    parseAll(property, cssText) {
        throw new Error(`Not implemented`);
    }
    _parse_css_style_value(property_name, css_text) {
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
                css_text = css_text.toLowerCase();
        }
    }
}
export class CSSKeywordValue extends CSSStyleValue {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export class CSSNumericValue {
}
export class CSSUnitValue extends CSSNumericValue {
    value;
    unit;
    toString() {
        return `${this.value}${this.unit}`;
    }
    constructor(value, unit) {
        super();
        this.value = value;
        this.unit = unit;
        if (!isFinite(value))
            throw new Error(`Invalid value: "${value}"`);
    }
    static parse(text) {
        const m = String(text).match(/^([-+]?[0-9]*\.?[0-9]+)(|%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|Q|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|fr)?$/);
        if (m) {
            const [, value, unit] = m;
            return new CSSUnitValue(parseFloat(value), unit ? (unit == "%" ? "percent" : unit) : "number");
        }
    }
    to(target_unit) {
        const { value, unit } = this;
    }
}
export class CSSMathValue extends CSSNumericValue {
}
export class CSS {
    static ch = (value) => new CSSUnitValue(value, "ch");
    static rem = (value) => new CSSUnitValue(value, "rem");
    static vw = (value) => new CSSUnitValue(value, "vw");
    static vh = (value) => new CSSUnitValue(value, "vh");
    static vmin = (value) => new CSSUnitValue(value, "vmin");
    static vmax = (value) => new CSSUnitValue(value, "vmax");
    static cm = (value) => new CSSUnitValue(value, "cm");
    static mm = (value) => new CSSUnitValue(value, "mm");
    static in = (value) => new CSSUnitValue(value, "in");
    static pt = (value) => new CSSUnitValue(value, "pt");
    static pc = (value) => new CSSUnitValue(value, "pc");
    static px = (value) => new CSSUnitValue(value, "px");
    static Q = (value) => new CSSUnitValue(value, "q");
    static deg = (value) => new CSSUnitValue(value, "deg");
    static grad = (value) => new CSSUnitValue(value, "grad");
    static rad = (value) => new CSSUnitValue(value, "rad");
    static turn = (value) => new CSSUnitValue(value, "turn");
    static s = (value) => new CSSUnitValue(value, "s");
    static ms = (value) => new CSSUnitValue(value, "ms");
    static Hz = (value) => new CSSUnitValue(value, "hz");
    static kHz = (value) => new CSSUnitValue(value, "khz");
    static dpi = (value) => new CSSUnitValue(value, "dpi");
    static dpcm = (value) => new CSSUnitValue(value, "dpcm");
    static dppx = (value) => new CSSUnitValue(value, "dppx");
    static fr = (value) => new CSSUnitValue(value, "fr");
}
const category = {
    number: "number",
    percent: "percent",
    length: "px",
    time: "s",
    angle: "deg",
    frequency: "Hz",
};
//# sourceMappingURL=typeom.js.map