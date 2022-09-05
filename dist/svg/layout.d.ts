import { Ray, Box, Matrix, Vec } from "svggeom";
import { SVGGraphicsElement } from "./_element.js";
export declare class SVGLayout {
    _root: SVGGraphicsElement;
    constructor(node: SVGGraphicsElement);
    getTM(node: SVGGraphicsElement): Matrix;
    setTM(node: SVGGraphicsElement, m: Matrix): this;
    innerTM(node: SVGGraphicsElement): Matrix;
    protected relTM(parent: SVGGraphicsElement, tm: Matrix, root?: SVGGraphicsElement | null): Matrix;
    pairTM(node: SVGGraphicsElement): Matrix[];
    localTM(node: SVGGraphicsElement): Matrix;
    rootTM(node: SVGGraphicsElement): Matrix;
    catTM(m: Matrix, ...nodes: Array<SVGGraphicsElement>): void;
    boundingBox(...args: Array<SVGGraphicsElement | Box | Vec | Ray | Array<SVGGraphicsElement | Box | Vec | Ray>>): Box;
}
