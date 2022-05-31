import { Point, Ray, Box, Matrix } from 'svggeom';
import { SVGGraphicsElement } from './_element.js';
export declare class SVGLayout {
    _root: SVGGraphicsElement;
    constructor(node: SVGGraphicsElement);
    boundingBox(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>): Box;
    rootTM(node: SVGGraphicsElement): Matrix;
    pairTM(node: SVGGraphicsElement): Matrix[];
    localTM(node: SVGGraphicsElement): Matrix;
    transform(m: Matrix, ...nodes: Array<SVGGraphicsElement>): void;
    toParent(parent: SVGGraphicsElement, node: SVGGraphicsElement): void;
}
