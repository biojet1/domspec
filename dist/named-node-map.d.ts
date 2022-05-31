export declare class NamedNodeMap {
    #private;
    [i: number]: Attr;
    constructor(ownerElement: Element);
    get ownerElement(): Element;
    getNamedItem(name: string): Attr | null;
    getNamedItemNS(ns: string, name: string): Attr | null;
    removeNamedItem(name: string): Attr | null;
    removeNamedItemNS(ns: string, name: string): Attr | null;
    setNamedItem(attr: Attr): void;
    setNamedItemNS(attr: Attr): void;
    item(index: number): Attr | null;
    get length(): number;
    [Symbol.iterator](): Iterator<Attr>;
}
export declare const AttributesHandler: {
    get(self: Element, key: string | symbol, receiver?: any): number | Attr | ((ns: string, name: string) => Attr | null) | ((attr: Attr) => Attr | null) | ((name: string) => boolean) | (() => string) | (() => Generator<Attr, void, unknown>) | undefined;
    ownKeys(self: Element): string[];
    has(self: Element, key: string): boolean;
    getOwnPropertyDescriptor(self: Element, key: string): {
        configurable: boolean;
        enumerable: boolean;
    } | undefined;
};
import { Element } from "./element.js";
import { Attr } from "./attr.js";
