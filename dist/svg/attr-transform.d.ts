export declare class SVGTransformList extends Array<SVGTransform> {
    clear(): void;
    getItem(i: number): SVGTransform;
    removeItem(i: number): SVGTransform;
    appendItem(newItem: SVGTransform): SVGTransform;
    initialize(newItem: SVGTransform): SVGTransform;
    insertItemBefore(newItem: SVGTransform, i: number): void;
    replaceItem(newItem: SVGTransform, i: number): void;
    createSVGTransformFromMatrix(newItem: Matrix): SVGTransform;
    consolidate(): SVGTransform;
    toString(): string;
    get numberOfItems(): number;
    static parse(d: string): SVGTransformList;
    static new(m: SVGTransform): SVGTransformList;
}
export declare class SVGTransform extends MatrixMut {
    θ?: number;
    get matrix(): this;
    get type(): 1 | 3 | 2 | 4 | 5 | 6;
    get angle(): number;
    toString(): string;
    setTranslate(x?: number, y?: number): void;
    setScale(sx: number, sy: number): void;
    setRotate(ang: number, x?: number, y?: number): void;
    setSkewX(x: number): void;
    setSkewY(y: number): void;
    setMatrix(matrix: Matrix): void;
    static parse(desc: string): SVGTransform;
    static translate(x?: number, y?: number): SVGTransform;
    static scale(sx: number, sy?: number): SVGTransform;
    static rotate(ang: number, x?: number, y?: number): SVGTransform;
    static skewX(x: number): SVGTransform;
    static skewY(y: number): SVGTransform;
    static matrix(a: number, b: number, c: number, d: number, e: number, f: number): SVGTransform;
    [shot: string]: any;
    static readonly SVG_TRANSFORM_UNKNOWN = 0;
    static readonly SVG_TRANSFORM_MATRIX = 1;
    static readonly SVG_TRANSFORM_TRANSLATE = 2;
    static readonly SVG_TRANSFORM_SCALE = 3;
    static readonly SVG_TRANSFORM_ROTATE = 4;
    static readonly SVG_TRANSFORM_SKEWX = 5;
    static readonly SVG_TRANSFORM_SKEWY = 6;
}
export declare class SVGTransformListAttr extends Attr {
    _var?: SVGTransformList | Matrix | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGTransformList;
    get specified(): boolean;
    valueOf(): string | undefined;
    apply(m: Matrix): Matrix | this;
}
import { Matrix, MatrixMut } from 'svggeom';
import { Attr } from '../attr.js';
export declare function viewbox_transform(e_x: number, e_y: number, e_width: number, e_height: number, vb_x: number, vb_y: number, vb_width: number, vb_height: number, aspect?: string | null): number[];
