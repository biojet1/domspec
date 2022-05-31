import { SVGLength } from "./length.js";
export declare class SVGLengthList extends Array<SVGLength> {
    clear(): void;
    initialize(newItem: SVGLength): SVGLength;
    getItem(i: number): SVGLength;
    removeItem(i: number): SVGLength;
    appendItem(newItem: SVGLength): SVGLength;
    insertItemBefore(newItem: SVGLength, i: number): SVGLength;
    replaceItem(newItem: SVGLength, i: number): void;
    toString(): string;
    get numberOfItems(): number;
    static parse(d: string): SVGLengthList;
    parse(d: string): SVGLengthList;
}
export declare class SVGLengthListAttr extends Attr {
    _var?: SVGLengthList | string;
    set value(value: string);
    get value(): string;
    get baseVal(): SVGLengthList;
    valueOf(): string | undefined;
}
import { Attr } from "../attr.js";
