import { Matrix, SVGTransformList } from "svggeom";
export declare class SVGTransformListAttr extends Attr {
    _var?: SVGTransformList | Matrix | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGTransformList;
    get specified(): boolean;
    valueOf(): string | undefined;
    apply(m: Matrix): Matrix | this;
}
import { Attr } from "../attr.js";
export declare function viewbox_transform(e_x: number, e_y: number, e_width: number, e_height: number, vb_x: number, vb_y: number, vb_width: number, vb_height: number, aspect?: string | null): number[];
