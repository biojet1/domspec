import { Ray, Box, Matrix, Vec } from 'svggeom';
import { SVGGraphicsElement } from './_element.js';
export declare class SVGLayout {
    _root: SVGGraphicsElement;
    constructor(node: SVGGraphicsElement);
    getTM(node: SVGGraphicsElement): Matrix;
    setTM(node: SVGGraphicsElement, m: Matrix): this;
    innerTM(node: SVGGraphicsElement): Matrix;
    relTM(parent: SVGGraphicsElement, tm: Matrix, root?: SVGGraphicsElement | null): Matrix;
    pairTM(node: SVGGraphicsElement): Matrix[];
    localTM(node: SVGGraphicsElement): Matrix;
    boundingBox(...args: Array<SVGGraphicsElement | Box | Vec | Ray | Array<SVGGraphicsElement | Box | Vec | Ray>>): Box;
}
