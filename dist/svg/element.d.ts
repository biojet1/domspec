import { Vector, BoundingBox, Matrix, PathLC } from "svggeom";
export declare class SVGMarkerElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    _shapeBox(tm?: Matrix): BoundingBox;
}
export declare class SVGTextContentElement extends SVGGraphicsElement {
}
export declare class SVGGeometryElement extends SVGGraphicsElement {
    _describe(): string;
    get _path(): PathLC;
    _objectBBox(T?: Matrix): BoundingBox;
    _shapeBox(tm?: Matrix): BoundingBox;
    _toPathElement(): SVGGeometryElement;
    getTotalLength(): number;
    getPointAtLength(L: number): Vector | undefined;
}
declare class _PathD extends PathLC {
    _node: SVGPathElement;
    constructor(node: SVGPathElement);
    assign(): this;
}
export declare class SVGPathElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
    _beginPath(): _PathD;
    _fuseTransform(parentT?: Matrix): void;
}
export declare class SVGCircleElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
}
export declare class SVGRectElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
    _fuseTransform(parentT?: Matrix): void;
}
export declare class SVGLineElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
    _fuseTransform(parentT: Matrix): void;
}
export declare class SVGEllipseElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
}
export declare class SVGPolygonElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
    _fuseTransform(parentT?: Matrix): void;
}
export declare class SVGPolylineElement extends SVGGeometryElement {
    static TAGS: string[];
    _describe(): string;
    _fuseTransform(parentT?: Matrix): void;
}
export declare class SVGAElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGDefsElement extends SVGGraphicsElement {
    static TAGS: string[];
    _objectBBox(): BoundingBox;
}
export declare class SVGForeignObjectElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    _shapeBox(tm?: Matrix): BoundingBox;
}
export declare class SVGGElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGImageElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    _shapeBox(tm?: Matrix): BoundingBox;
    _objectBBox(tm?: Matrix): BoundingBox;
}
export declare class SVGSwitchElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGUseElement extends SVGGraphicsElement {
    static TAGS: string[];
    _shapeBox(tm?: Matrix): BoundingBox;
    _objectBBox(T?: Matrix): BoundingBox;
}
export declare class SVGSymbolElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    _shapeBox(tm?: Matrix): BoundingBox;
}
export declare class SVGTextElement extends SVGTextContentElement {
    static TAGS: string[];
    _shapeBox(tm?: Matrix): BoundingBox;
}
export declare class SVGTSpanElement extends SVGTextContentElement {
    static TAGS: string[];
    _shapeBox(tm?: Matrix): BoundingBox;
}
export declare class SVGTRefElement extends SVGTextContentElement {
    static TAGS: string[];
}
export declare class SVGTextPathElement extends SVGTextContentElement {
    static TAGS: string[];
}
export declare class SVGClipPathElement extends SVGElement {
    static TAGS: string[];
}
export declare class SVGMaskElement extends SVGElement {
    static TAGS: string[];
}
export declare class SVGMissingGlyphElement extends SVGElement {
    static TAGS: string[];
}
export declare class SVGGlyphElement extends SVGElement {
    static TAGS: string[];
}
export declare class SVGPatternElement extends SVGElement {
    static TAGS: string[];
    _shapeBox(tm?: Matrix): BoundingBox;
}
import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
export { SVGLength, SVGAnimatedLength } from "./length.js";
export { SVGRect, SVGAnimatedRect } from "./rect.js";
export { SVGLayout } from "./layout.js";
export { SVGElement, SVGGraphicsElement, SVGSVGElement };
