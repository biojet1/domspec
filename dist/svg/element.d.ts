import { Vec, Box, Matrix, PathLS } from "svggeom";
export declare class SVGTextContentElement extends SVGGraphicsElement {
}
export declare class SVGGeometryElement extends SVGGraphicsElement {
    describe(): string;
    getPath(): PathLS;
    get path(): PathLS;
    objectBBox(T?: Matrix): Box;
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
    toPathElement(): SVGGeometryElement;
    getTotalLength(): number;
    getPointAtLength(L: number): Vec | undefined;
}
declare class _PathD extends PathLS {
    _node: SVGPathElement;
    constructor(node: SVGPathElement);
    assign(): this;
}
export declare class SVGPathElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
    beginPath(): _PathD;
    fuseTransform(parentT?: Matrix): void;
}
export declare class SVGCircleElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
}
export declare class SVGRectElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
    fuseTransform(parentT?: Matrix): void;
}
export declare class SVGLineElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
    fuseTransform(parentT: Matrix): void;
}
export declare class SVGEllipseElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
}
export declare class SVGPolygonElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
    fuseTransform(parentT?: Matrix): void;
}
export declare class SVGPolylineElement extends SVGGeometryElement {
    static TAGS: string[];
    describe(): string;
    fuseTransform(parentT?: Matrix): void;
}
export declare class SVGAElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGDefsElement extends SVGGraphicsElement {
    static TAGS: string[];
    getBBox(): Box;
}
export declare class SVGForeignObjectElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
}
export declare class SVGGElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGImageElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
}
export declare class SVGSwitchElement extends SVGGraphicsElement {
    static TAGS: string[];
}
export declare class SVGUseElement extends SVGGraphicsElement {
    static TAGS: string[];
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
    objectBBox(T?: Matrix): Box;
}
export declare class SVGSymbolElement extends SVGGraphicsElement {
    static TAGS: string[];
    get _isViewportElement(): number;
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
}
export declare class SVGTextElement extends SVGTextContentElement {
    static TAGS: string[];
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
}
export declare class SVGTSpanElement extends SVGTextContentElement {
    static TAGS: string[];
    shapeBox(T?: Matrix): Box;
    _shapeBox(tm?: Matrix): Box;
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
}
export declare class SVGScriptElement extends SVGElement {
    static TAGS: string[];
    _alreadyStarted?: boolean;
}
import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
export { SVGLength, SVGAnimatedLength } from "./length.js";
export { SVGRect, SVGAnimatedRect } from "./rect.js";
export { SVGLayout } from "./layout.js";
export { SVGElement, SVGGraphicsElement, SVGSVGElement };