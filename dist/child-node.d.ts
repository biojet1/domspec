import { Node } from "./node.js";
export declare abstract class ChildNode extends Node {
    constructor();
    get nextSibling(): ChildNode | null;
    get previousSibling(): ChildNode | null;
    get nextElementSibling(): Element | null;
    get previousElementSibling(): Element | null;
    protected viableNextSibling(nodes: Array<string | ChildNode>): ChildNode | null;
    after(...nodes: Array<string | ChildNode>): void;
    before(...nodes: Array<string | ChildNode>): void;
    replaceWith(...nodes: Array<string | ChildNode>): void;
    appendChild(node: Node): void;
    _toNodes(nodes: Array<string | ChildNode>): IterableIterator<ChildNode>;
}
import { Element } from "./element.js";
