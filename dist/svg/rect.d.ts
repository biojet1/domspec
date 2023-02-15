export declare class SVGRect extends BoxMut {
    owner?: SVGSVGElement;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
}
export declare class SVGAnimatedRect extends Attr {
    _var?: SVGRect | string;
    set value(value: string);
    get value(): string;
    get baseVal(): BoxMut;
    get animVal(): BoxMut;
    get specified(): boolean;
    valueOf(): string | undefined;
    contain(...args: Array<SVGGraphicsElement | Box | Vec | Ray | Array<SVGGraphicsElement | Box | Vec | Ray>>): this;
    contain2(...args: Array<SVGGraphicsElement | Box | Vec | Ray | Array<SVGGraphicsElement | Box | Vec | Ray>>): this;
    calcWidth(): number;
    calcHeight(): number;
    calcBox(): Box;
}
import { BoxMut, Box, Vec, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement, SVGSVGElement } from "./element.js";
