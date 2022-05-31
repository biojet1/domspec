import { NonElementParentNode } from "./non-element-parent-node.js";
export declare class DocumentFragment extends NonElementParentNode {
    get nodeType(): number;
    get nodeName(): string;
    _attach(prev: Node, next: Node, parent: ParentNode): void;
    cloneNode(deep?: boolean): Node;
    constructor(owner?: Document | null);
    static fromTemplate(self: ParentNode): TemplateFragment;
}
export declare class TemplateFragment extends DocumentFragment {
    self: ParentNode;
    constructor(self: ParentNode);
    get firstChild(): ChildNode | null;
    get lastChild(): ChildNode | null;
    _attach(prev: Node, next: Node, parent: ParentNode): void | Node;
}
import { ChildNode } from "./child-node.js";
import { ParentNode } from "./parent-node.js";
import { Node } from "./node.js";
import { Document } from "./document.js";
