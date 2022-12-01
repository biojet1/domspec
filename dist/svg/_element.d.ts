import { Box, Matrix } from 'svggeom';
export declare class SVGElement extends Element {
    get _isViewportElement(): number;
    get viewportElement(): SVGElement | null;
    get ownerSVGElement(): SVGSVGElement | null;
    createSVGLength(): SVGLength;
    createSVGMatrix(): Matrix;
    createSVGTransformFromMatrix(M: Matrix): SVGTransform;
}
export declare class SVGGraphicsElement extends SVGElement {
    newAttributeNode(name: string): import("../attr.js").Attr;
    get r(): SVGLengthAttr;
    get x(): SVGLengthAttr;
    get y(): SVGLengthAttr;
    get cx(): SVGLengthAttr;
    get cy(): SVGLengthAttr;
    get rx(): SVGLengthAttr;
    get ry(): SVGLengthAttr;
    get x1(): SVGLengthAttr;
    get x2(): SVGLengthAttr;
    get y1(): SVGLengthAttr;
    get y2(): SVGLengthAttr;
    get width(): SVGLengthAttr;
    get height(): SVGLengthAttr;
    get viewBox(): SVGRectAttr;
    get transform(): SVGTransformListAttr;
    get nearestViewportElement(): SVGElement | null;
    get farthestViewportElement(): SVGElement | null;
    get ownTM(): Matrix;
    set ownTM(T: Matrix);
    get clipElement(): SVGGraphicsElement | null;
    set clipElement(target: SVGElement | null);
    get hrefElement(): SVGElement | null;
    set hrefElement(target: SVGElement | null);
    canRender(): boolean;
    get innerTM(): Matrix;
    get rootTM(): Matrix;
    localTM(): Matrix;
    docTM(): Matrix;
    pairTM(): Matrix[];
    getScreenCTM(): Matrix;
    composeTM(root?: SVGElement | null): Matrix;
    _composeTM(root?: SVGElement | null): Matrix | null;
    _pairTM(root?: SVGElement | null): Matrix[];
    shapeBox(T?: Matrix): Box;
    boundingBox(T?: Matrix): Box;
    getBBox(): Box;
    fuseTransform(parentT?: Matrix): void;
    objectBBox(T?: Matrix): Box;
    _objectBBox(T?: Matrix): Box;
    _boundingBox(tm?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
    _viewportBox(tm?: Matrix): Box;
    calcWidth(): void;
    _placeChild(ref: ChildNode | null | undefined, nodes: SVGGraphicsElement[]): void;
    _placePriorTo(ref: ChildNode | null | undefined, ...nodes: SVGGraphicsElement[]): void;
    _placeAppend(...nodes: SVGGraphicsElement[]): void;
    _placeBefore(...nodes: SVGGraphicsElement[]): false | void;
    _placeAfter(...nodes: SVGGraphicsElement[]): false | void;
    _layout(): SVGLayout;
    _relTM(tm: Matrix, root?: SVGElement | null): Matrix;
}
export declare class SVGSVGElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    get innerTM(): Matrix;
    viewportTM(): Matrix;
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
    defs(): Element;
    geom2UU(): void;
}
import { Element } from '../element.js';
import { ChildNode } from '../child-node.js';
import { SVGLength, SVGLengthAttr } from './length.js';
import { SVGRectAttr } from './rect.js';
import { SVGLayout } from './layout.js';
import { SVGTransformListAttr, SVGTransform } from './attr-transform.js';