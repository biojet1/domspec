import { Vec, Box, Matrix, SVGTransform } from "svggeom";
export interface SVGBoundingBoxOptions {
    fill?: boolean;
    stroke?: boolean;
    markers?: boolean;
    clipped?: boolean;
}
export declare class SVGElement extends Element {
    _newAttributeNode(name: string): import("../attr.js").Attr;
    get r(): SVGAnimatedLength;
    get x(): SVGAnimatedLength;
    get y(): SVGAnimatedLength;
    get cx(): SVGAnimatedLength;
    get cy(): SVGAnimatedLength;
    get rx(): SVGAnimatedLength;
    get ry(): SVGAnimatedLength;
    get x1(): SVGAnimatedLength;
    get x2(): SVGAnimatedLength;
    get y1(): SVGAnimatedLength;
    get y2(): SVGAnimatedLength;
    get width(): SVGAnimatedLength;
    get height(): SVGAnimatedLength;
    get viewBox(): SVGAnimatedRect;
    get transform(): SVGAnimatedTransformList;
    get _isViewportElement(): number;
    get viewportElement(): SVGElement | null;
    get ownerSVGElement(): SVGSVGElement | null;
    get _ownTM(): Matrix;
    set _ownTM(T: Matrix);
    get _subTM(): Matrix;
    _viewportBox(tm?: Matrix): Box;
    get _rootTM(): Matrix;
}
export declare class SVGGraphicsElement extends SVGElement {
    get nearestViewportElement(): SVGElement | null;
    get farthestViewportElement(): SVGElement | null;
    get _clipElement(): SVGGraphicsElement | null;
    set _clipElement(target: SVGElement | null);
    get _hrefElement(): SVGElement | null;
    set _hrefElement(target: SVGElement | null);
    _canRender(): boolean;
    _relTM(tm: Matrix, root?: SVGGraphicsElement | null): Matrix;
    _pairTM(root?: SVGGraphicsElement | null): Matrix[];
    get _innerTM(): Matrix;
    _objectBBox(T?: Matrix): Box;
    _boundingBox(tm?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
    _fuseTransform(parentT?: Matrix): void;
    getScreenCTM(): Matrix;
    getCTM(): Matrix;
    getBBox(): Box;
    _placeChild(ref: ChildNode | null | undefined, nodes: SVGGraphicsElement[]): void;
    _placePriorTo(ref: ChildNode | null | undefined, ...nodes: SVGGraphicsElement[]): void;
    _placeAppend(...nodes: SVGGraphicsElement[]): void;
    _placeBefore(...nodes: SVGGraphicsElement[]): false | void;
    _placeAfter(...nodes: SVGGraphicsElement[]): false | void;
    _layout(): SVGLayout;
    _viewportTM(): Matrix;
    _subBBox(m: Matrix, params: SVGBoundingBoxOptions): Box;
    _ownBBox(m: Matrix, params: SVGBoundingBoxOptions): Box;
}
export declare class SVGSVGElement extends SVGGraphicsElement {
    static TAGS: string[];
    createSVGPoint(): Vec;
    createSVGRect(): import("svggeom").BoxMut;
    createSVGLength(): SVGLength;
    createSVGMatrix(): Matrix;
    createSVGTransform(): SVGTransform;
    createSVGTransformFromMatrix(M: Matrix): SVGTransform;
    get _isViewportElement(): number;
    get _subTM(): Matrix;
    _shapeBox(tm?: Matrix): Box;
    _ownBBox(tm?: Matrix): Box;
    _defs(): Element;
}
import { Element } from "../element.js";
import { ChildNode } from "../child-node.js";
import { SVGLength, SVGAnimatedLength } from "./length.js";
import { SVGAnimatedRect } from "./rect.js";
import { SVGLayout } from "./layout.js";
import { SVGAnimatedTransformList } from "./attr-transform.js";
