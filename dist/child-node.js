import { Node, NEXT, PREV, END } from "./node.js";
export class ChildNode extends Node {
    constructor() {
        super();
        this.parentNode = null;
    }
    get nextSibling() {
        const node = this.endNode[NEXT];
        if (node instanceof EndNode) {
            if (node.parentNode !== this.parentNode) {
                throw new Error("Unexpected following EndNode");
            }
        }
        else if (node instanceof ChildNode) {
            return node;
        }
        else if (node) {
            throw new Error("Unexpected following node");
        }
        return null;
    }
    get previousSibling() {
        const node = this.startNode[PREV];
        if (node instanceof EndNode) {
            return node.parentNode;
        }
        else if (node instanceof ParentNode) {
            if (node !== this.parentNode) {
                throw new Error("Unexpected previous node : ParentNode");
            }
        }
        else if (node instanceof ChildNode) {
            return node;
        }
        return null;
    }
    get nextElementSibling() {
        let { nextSibling: node } = this;
        for (; node; node = node.nextSibling) {
            if (node.nodeType == 1) {
                return node;
            }
        }
        return null;
    }
    get previousElementSibling() {
        let { previousSibling: node } = this;
        for (; node; node = node.previousSibling) {
            if (node.nodeType == 1) {
                return node;
            }
        }
        return null;
    }
    viableNextSibling(nodes) {
        let next = this.nextSibling;
        while (next) {
            if (nodes.indexOf(next) < 0) {
                break;
            }
            else {
                next = next.nextSibling;
            }
        }
        return next;
    }
    after(...nodes) {
        const { parentNode: node } = this;
        node?._before(this.viableNextSibling(nodes) || node[END], node._toNodes(nodes));
    }
    before(...nodes) {
        const { parentNode: node } = this;
        node?._before(this, node._toNodes(nodes));
    }
    replaceWith(...nodes) {
        const { parentNode: parent } = this;
        if (parent) {
            const next = this.viableNextSibling(nodes);
            this.remove();
            parent._before(next || parent[END], parent._toNodes(nodes));
        }
        else {
        }
    }
    appendChild(node) {
        if (node) {
            throw DOMException.new("HierarchyRequestError");
        }
        else {
            throw new TypeError();
        }
    }
    *_toNodes(nodes) {
        const { ownerDocument: doc } = this;
        for (const node of nodes) {
            if (typeof node === "string" || !node) {
                if (doc) {
                    yield doc.createTextNode(node + "");
                }
            }
            else {
                switch (node.nodeType) {
                    case undefined:
                        throw new Error(`Unexpected ${node}`);
                    case 11: {
                        let { firstChild: cur } = node;
                        while (cur) {
                            const next = cur.nextSibling;
                            yield cur;
                            cur = next;
                        }
                        break;
                    }
                    default:
                        yield node;
                }
            }
        }
    }
}
import { DOMException } from "./event-target.js";
import { ParentNode, EndNode } from "./parent-node.js";
//# sourceMappingURL=child-node.js.map