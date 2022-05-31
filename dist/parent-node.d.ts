import { Node, END, Children } from './node.js';
import { ChildNode } from './child-node.js';
export declare abstract class ParentNode extends ChildNode {
    [END]: EndNode;
    constructor();
    get endNode(): Node;
    get firstChild(): ChildNode | null;
    get firstElementChild(): Element | null;
    get lastChild(): ChildNode | null;
    get lastElementChild(): Element | null;
    prepend(...nodes: Array<ChildNode>): void;
    append(...nodes: Array<ChildNode>): void;
    _before(child: ChildNode | EndNode, nodes: Iterable<ChildNode>): void;
    insertBefore(node: ChildNode, before?: ChildNode | EndNode | null): ChildNode;
    appendChild(node: ChildNode): ChildNode;
    removeChild(node: ChildNode): ChildNode;
    _replace(node: ChildNode, child: ChildNode): ChildNode;
    hasChildNodes(): boolean;
    get childNodes(): Children;
    get children(): {
        [i: number]: Element;
        [Symbol.iterator](): Generator<Element, void, unknown>;
        item(index: number): Element | null;
        namedItem(name: string): Element | null;
        readonly length: number;
    };
    get childElementCount(): number;
    replaceChildren(...nodes: Array<string | ChildNode>): void;
    getElementsByTagName(name: string): {
        [i: number]: Element;
        [Symbol.iterator](): Generator<Element, void, unknown>;
        item(index: number): Element | null;
        namedItem(name: string): Element | null;
        readonly length: number;
    } | {
        [i: number]: Element;
        [Symbol.iterator](): Generator<Element, void, unknown>;
        item(index: number): Element | null;
        namedItem(name: string): Element | null;
        readonly length: number;
    } | {
        [i: number]: Element;
        [Symbol.iterator](): Generator<Element, void, unknown>;
        item(index: number): Element | null;
        namedItem(name: string): Element | null;
        readonly length: number;
    };
    getElementsByClassName(name: string): {
        [i: number]: Element;
        [Symbol.iterator](): Generator<Element, void, unknown>;
        item(index: number): Element | null;
        namedItem(name: string): Element | null;
        readonly length: number;
    };
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): Element[];
    get textContent(): string | null;
    set textContent(text: string | null);
    get innerHTML(): string;
    set innerHTML(html: string);
    insertAdjacentHTML(position: string, text: string): null | undefined;
    isEqualNode(node: Node): boolean;
    get qualifiedName(): string;
    get outerHTML(): string;
    set outerHTML(html: string);
    toString(): string;
}
export declare class EndNode extends Node {
    parentNode: ParentNode;
    constructor(parent: ParentNode);
    get startNode(): Node;
    get nodeType(): number;
    get nodeName(): string;
    isEqualNode(node: Node): boolean;
}
export declare abstract class HTMLCollection {
    [i: number]: Element;
    constructor();
    item(index: number): Element | null;
    namedItem(name: string): Element | null;
    get length(): number;
    abstract [Symbol.iterator](): Iterator<Element>;
}
import { Element } from './element.js';
