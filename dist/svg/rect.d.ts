export declare class SVGAnimatedRect extends Attr {
    _var?: SVGRect | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGRect;
    get animVal(): SVGRect;
    get specified(): boolean;
    valueOf(): string | undefined;
    _closeIn(...args: Array<SVGGraphicsElement | Box | Vec | Ray | Array<SVGGraphicsElement | Box | Vec | Ray>>): this;
    _calcWidth(): number;
    _calcHeight(): number;
    _calcBox(): Box;
}
import { BoxMut as SVGRect } from "svggeom";
import { Box, Vec, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement } from "./element.js";
export { SVGRect };
