declare const VALUE: unique symbol;
export declare abstract class Attr extends Node {
    name: string;
    localName: string;
    _ns?: string | null;
    _prefix?: string | null;
    constructor(name: string, localName?: string);
    get textContent(): string;
    set textContent(value: string);
    get nodeType(): number;
    get nodeValue(): string;
    abstract get value(): string;
    abstract set value(value: string);
    get specified(): boolean;
    get namespaceURI(): string | null;
    get prefix(): string | null;
    get nodeName(): string;
    get ownerElement(): import("./parent-node.js").ParentNode | null;
    isDefaultNamespace(namespaceURI: string): boolean;
    lookupNamespaceURI(prefix: string): string | null;
    lookupPrefix(ns: string): string | null;
    cloneNode(deep?: boolean): any;
    isEqualNode(node: Node): boolean;
}
export declare class StringAttr extends Attr {
    [VALUE]?: string;
    valueOf(): string | null;
    get value(): string;
    set value(value: string);
}
import { Node } from './node.js';
export {};
