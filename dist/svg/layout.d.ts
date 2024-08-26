import { Ray, BoundingBox, Matrix, Vector } from "svggeom";
import { SVGGraphicsElement } from "./_element.js";
export declare class SVGLayout {
    _root: SVGGraphicsElement;
    constructor(node: SVGGraphicsElement);
    getTM(node: SVGGraphicsElement): Matrix;
    setTM(node: SVGGraphicsElement, m: Matrix): this;
    _subTM(node: SVGGraphicsElement): Matrix;
    protected relTM(parent: SVGGraphicsElement, tm: Matrix, root?: SVGGraphicsElement | null): Matrix;
    _pairTM(node: SVGGraphicsElement): Matrix[];
    _localTM(node: SVGGraphicsElement): Matrix;
    _rootTM(node: SVGGraphicsElement): Matrix;
    catTM(m: Matrix, ...nodes: Array<SVGGraphicsElement>): void;
    _boundingBox(...args: Array<SVGGraphicsElement | BoundingBox | Vector | Ray | Array<SVGGraphicsElement | BoundingBox | Vector | Ray>>): BoundingBox;
}
