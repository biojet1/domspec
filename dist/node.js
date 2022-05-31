export const NEXT = Symbol("next");
export const PREV = Symbol("prev");
export const START = Symbol("start");
export const END = Symbol("end");
export const PARENT = Symbol();
export class Node extends EventTarget {
    [NEXT];
    [PREV];
    get endNode() {
        return this;
    }
    get startNode() {
        return this;
    }
    _attach(prev, next, parent) {
        const { startNode, endNode, parentNode } = this;
        if (parentNode || startNode[PREV] || endNode[NEXT]) {
            throw new Error(`Detach first`);
        }
        this.parentNode = parent;
        prev && prev._linkr(startNode);
        next && endNode._linkr(next);
    }
    _linkr(node) {
        if (node === this) {
            throw new Error(`Same node`);
        }
        else if (node) {
            this[NEXT] = node;
            node[PREV] = this;
        }
        else {
            delete this[NEXT];
        }
    }
    _linkl(node) {
        if (node === this) {
            throw new Error(`Same node`);
        }
        else if (node) {
            this[PREV] = node;
            node[NEXT] = this;
        }
        else {
            delete this[PREV];
        }
    }
    _detach(newOwner) {
        const { [PREV]: prev, endNode: { [NEXT]: next }, parentNode, nodeType, } = this;
        prev && next && prev._linkr(next);
        this[PREV] = undefined;
        this.endNode[NEXT] = undefined;
        if (parentNode) {
            this.parentNode = null;
        }
        if (newOwner) {
            newOwner.adoptNode(this);
        }
        return this;
    }
    _owner;
    parentNode;
    get ownerDocument() {
        const { _owner } = this;
        return _owner || null;
    }
    set ownerDocument(doc) {
        if (doc)
            this._owner = doc;
        else
            delete this._owner;
    }
    get nodeValue() {
        return null;
    }
    set nodeValue(data) { }
    get textContent() {
        return null;
    }
    set textContent(data) { }
    isSameNode(node) {
        return this === node;
    }
    remove() {
        this._detach();
    }
    getRootNode() {
        let root = this;
        while (root.parentNode)
            root = root.parentNode;
        return root.nodeType === 9
            ? root.documentElement || root
            : root;
    }
    appendChild(node) {
        throw new Error(`Not implemented`);
    }
    get firstChild() {
        return null;
    }
    get lastChild() {
        return null;
    }
    get previousSibling() {
        return null;
    }
    get nextSibling() {
        return null;
    }
    get parentElement() {
        const { parentNode: node } = this;
        return node && node.nodeType == 1 ? node : null;
    }
    get childNodes() {
        return new Children(this);
    }
    hasChildNodes() {
        return false;
    }
    get baseURI() {
        const { ownerDocument } = this;
        return ownerDocument ? ownerDocument.documentURI : "";
    }
    lookupNamespaceURI(prefix) {
        const { parentElement: node } = this;
        return node ? node.lookupNamespaceURI(prefix) : null;
    }
    isDefaultNamespace(namespaceURI) {
        const { parentElement: node } = this;
        return node ? node.isDefaultNamespace(namespaceURI) : !namespaceURI;
    }
    lookupPrefix(ns) {
        const { parentElement: node } = this;
        return node ? node.lookupPrefix(ns) : null;
    }
    cloneNode(deep) {
        throw new Error("Not implemented");
    }
    normalize() {
        let { startNode: next, endNode: end } = this;
        while (next && next !== end) {
            let node = next;
            next = next[NEXT] || end;
            if (node.nodeType === 3) {
                if (node.length > 0) {
                    if (next.nodeType === 3) {
                        if (next.length > 0) {
                            node.data += next.data;
                        }
                        node = next;
                        next = next[NEXT] || end;
                        node.remove();
                    }
                }
                else {
                    node.remove();
                }
            }
        }
    }
    compareDocumentPosition(that) {
        if (this === that)
            return 0;
        let these = [], those = [], n;
        for (n = this; n; n = n.parentNode)
            these.push(n);
        for (n = that; n; n = n.parentNode)
            those.push(n);
        let aN = these.length;
        let bN = those.length;
        if (these[--aN] !== those[--bN]) {
            return 1 + 32 + (2);
        }
        for (;;) {
            let a = these[--aN];
            let b = those[--bN];
            if (a && b) {
                if (a !== b) {
                    for (;;) {
                        if (a && b) {
                            a = a.previousSibling;
                            b = b.previousSibling;
                        }
                        else if (!a) {
                            return 4;
                        }
                        else {
                            return 2;
                        }
                    }
                }
            }
            else if (b) {
                return 4 + 16;
            }
            else {
                return 2 + 8;
            }
        }
    }
    contains(node) {
        for (;;) {
            if (node === this) {
                return true;
            }
            else if (node) {
                if (!(node = node.parentNode)) {
                    if (!(arguments[0] instanceof Node)) {
                        throw new TypeError();
                    }
                    break;
                }
            }
            else {
                if (arguments.length < 1) {
                    throw new TypeError();
                }
                break;
            }
        }
        return false;
    }
    insertBefore(node, before) {
        const { _before } = this;
        if (_before) {
            return _before.call(this, before || this[END], [node]);
        }
        else {
            if (!node || !(node instanceof Node)) {
                throw new TypeError();
            }
            throw DOMException.new("HierarchyRequestError", "Not ParentNode");
        }
    }
    _replace(node, child) {
        throw DOMException.new("HierarchyRequestError", this.nodeType + "");
    }
    replaceChild(node, child) {
        return this._replace(node, child);
    }
    removeChild(node) {
        throw DOMException.new("NotFoundError");
    }
    static get ELEMENT_NODE() {
        return 1;
    }
    get ELEMENT_NODE() {
        return 1;
    }
    static get ATTRIBUTE_NODE() {
        return 2;
    }
    get ATTRIBUTE_NODE() {
        return 2;
    }
    static get TEXT_NODE() {
        return 3;
    }
    get TEXT_NODE() {
        return 3;
    }
    static get CDATA_SECTION_NODE() {
        return 4;
    }
    get CDATA_SECTION_NODE() {
        return 4;
    }
    static get ENTITY_REFERENCE_NODE() {
        return 5;
    }
    get ENTITY_REFERENCE_NODE() {
        return 5;
    }
    static get ENTITY_NODE() {
        return 6;
    }
    get ENTITY_NODE() {
        return 6;
    }
    static get PROCESSING_INSTRUCTION_NODE() {
        return 7;
    }
    get PROCESSING_INSTRUCTION_NODE() {
        return 7;
    }
    static get COMMENT_NODE() {
        return 8;
    }
    get COMMENT_NODE() {
        return 8;
    }
    static get DOCUMENT_NODE() {
        return 9;
    }
    get DOCUMENT_NODE() {
        return 9;
    }
    static get DOCUMENT_TYPE_NODE() {
        return 10;
    }
    get DOCUMENT_TYPE_NODE() {
        return 10;
    }
    static get DOCUMENT_FRAGMENT_NODE() {
        return 11;
    }
    get DOCUMENT_FRAGMENT_NODE() {
        return 11;
    }
    static get NOTATION_NODE() {
        return 12;
    }
    get NOTATION_NODE() {
        return 12;
    }
    *_enumAncestorTargets() {
        let node = this.parentNode;
        while (node) {
            yield node;
            node = node.parentNode;
        }
    }
}
export class NodeList {
}
export class Children extends NodeList {
    parent;
    constructor(parent) {
        super();
        this.parent = parent;
        this.length;
    }
    item(index) {
        if (index >= 0) {
            for (const cur of this) {
                if (index-- === 0) {
                    return cur;
                }
            }
        }
        return null;
    }
    get length() {
        let i = 0;
        let id;
        for (const cur of this) {
            this[i++] = cur;
        }
        const n = i;
        while (i in this) {
            delete this[i++];
        }
        return n;
    }
    *[Symbol.iterator]() {
        let { firstChild: cur } = this.parent;
        for (; cur; cur = cur.nextSibling) {
            yield cur;
        }
    }
    *keys() {
        let i = 0;
        for (const cur of this) {
            yield i++;
        }
    }
    *values() {
        let i = 0;
        for (const cur of this) {
            yield cur;
        }
    }
    *entries() {
        let i = 0;
        for (const cur of this) {
            yield [i++, cur];
        }
    }
    forEach(callback, thisArg) {
        let i = 0;
        for (const cur of this) {
            callback.call(thisArg, cur, i++, this);
        }
    }
}
import { EventTarget, DOMException } from "./event-target.js";
//# sourceMappingURL=node.js.map