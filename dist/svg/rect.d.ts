export declare class SVGAnimatedRect extends Attr {
    _var?: SVGRect | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGRect;
    get animVal(): SVGRect;
    get specified(): boolean;
    valueOf(): string | undefined;
    _closeIn(...args: Array<SVGGraphicsElement | BoundingBox | Vector | Ray | Array<SVGGraphicsElement | BoundingBox | Vector | Ray>>): this;
    _calcWidth(): number;
    _calcHeight(): number;
    _calcBox(): BoundingBox;
}
import { BoundingBox, Vector, Ray } from "svggeom";
declare class SVGRect extends BoundingBox {
    static parse(s: string): BoundingBox;
    set x(n: number);
    get x(): number;
    set y(n: number);
    get y(): number;
    set width(n: number);
    get width(): number;
    set height(n: number);
    get height(): number;
    copy(that: BoundingBox): this;
}
import { Attr } from "../attr.js";
import { SVGGraphicsElement } from "./element.js";
export { SVGRect };
