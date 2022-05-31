export declare class SVGRectAttr extends Attr {
    _var?: BoxMut | string;
    set value(value: string);
    get value(): string;
    get baseVal(): BoxMut | null | undefined;
    get specified(): boolean;
    valueOf(): string | undefined;
    contain(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>): this;
    contain2(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>): this;
    calcWidth(): number;
    calcHeight(): number;
    calcBox(): Box;
}
import { BoxMut, Box, Point, Ray } from 'svggeom';
import { Attr } from '../attr.js';
import { SVGGraphicsElement } from './element.js';
