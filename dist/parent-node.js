import { Node, PREV, NEXT, END, Children, } from './node.js';
import { ChildNode } from './child-node.js';
export class ParentNode extends ChildNode {
    [END];
    constructor() {
        super();
        this[END] = this[NEXT] = new EndNode(this);
    }
    get endNode() {
        return this[END];
    }
    get firstChild() {
        let { [NEXT]: next, [END]: end } = this;
        for (; next && next !== end; next = next.endNode[NEXT]) {
            if (next instanceof ChildNode) {
                return next;
            }
            else if (next instanceof EndNode) {
                throw new Error('Unexpected following EndNode node');
            }
        }
        return null;
    }
    get firstElementChild() {
        let { firstChild: cur } = this;
        for (; cur instanceof ChildNode; cur = cur.nextSibling) {
            if (cur instanceof ParentNode && cur.nodeType === 1) {
                return cur;
            }
        }
        return null;
    }
    get lastChild() {
        const prev = this[END][PREV];
        if (prev && prev != this) {
            if (prev instanceof EndNode) {
                return prev.parentNode;
            }
            else if (prev instanceof ParentNode) {
                throw new Error('Unexpected preceding ParentNode node');
            }
            else if (prev instanceof ChildNode) {
                return prev;
            }
        }
        return null;
    }
    get lastElementChild() {
        let { lastChild: cur } = this;
        for (; cur instanceof ChildNode; cur = cur.previousSibling) {
            if (cur instanceof ParentNode && cur.nodeType === 1) {
                return cur;
            }
        }
        return null;
    }
    prepend(...nodes) {
        this._before(this.firstChild || this[END], this._toNodes(nodes));
    }
    append(...nodes) {
        this._before(this[END], this._toNodes(nodes));
    }
    _before(child, nodes) {
        let { ownerDocument, nodeType } = this;
        if (child.parentNode != this) {
            for (const node of nodes) {
                if (!node || !(node instanceof Node)) {
                    throw new TypeError('wIAXm1');
                }
                else if (node.contains(this)) {
                    throw DOMException.new('HierarchyRequestError', `node is ancestor of parent`);
                }
            }
            throw DOMException.new('NotFoundError', `unexpected reference child parent`);
        }
        else if (nodeType === 9) {
            ownerDocument = this;
        }
        for (const node of nodes) {
            if (node instanceof ParentNode) {
                if (node.contains(this)) {
                    throw DOMException.new('HierarchyRequestError', `node is ancestor of parent`);
                }
            }
            S1: switch (node.nodeType) {
                case 11: {
                    if (nodeType === 9) {
                        const doc = this;
                        let cur = node.firstChild;
                        while (cur) {
                            switch (cur.nodeType) {
                                case 1:
                                    if (doc.firstElementChild || cur.nextElementSibling) {
                                        break;
                                    }
                                case 7:
                                case 8:
                                case 10:
                                    cur = cur.nextSibling;
                                    continue;
                            }
                            throw DOMException.new('HierarchyRequestError', 'A');
                        }
                        if (child instanceof ChildNode) {
                            let cur = child;
                            for (; cur; cur = cur.nextSibling) {
                                switch (cur.nodeType) {
                                    case 10:
                                        throw DOMException.new('HierarchyRequestError', 'B');
                                }
                            }
                        }
                    }
                    break;
                }
                case 1:
                    if (nodeType === 9) {
                        if (this.firstElementChild) {
                            throw DOMException.new('HierarchyRequestError', 'C');
                        }
                        if (child instanceof ChildNode) {
                            let cur = child;
                            for (; cur; cur = cur.nextSibling) {
                                switch (cur.nodeType) {
                                    case 10:
                                        throw DOMException.new('HierarchyRequestError', 'D');
                                }
                            }
                        }
                    }
                    break;
                case 3:
                    if (nodeType === 9) {
                        throw DOMException.new('HierarchyRequestError', 'E');
                    }
                    break;
                case 4:
                case 7:
                case 8:
                    break;
                case 10:
                    if (9 === nodeType) {
                        const doc = this;
                        if (doc.doctype) {
                            throw DOMException.new('HierarchyRequestError', 'F');
                        }
                        const first = doc.firstElementChild;
                        if (first && !first.isSameNode(child)) {
                            throw DOMException.new('HierarchyRequestError', 'G');
                        }
                        break S1;
                    }
                default:
                    if (node instanceof ChildNode) {
                        throw DOMException.new('HierarchyRequestError', `${nodeType} ${node.nodeType}`);
                    }
                    else {
                        throw new TypeError();
                    }
            }
            if (node !== child) {
                node._detach(ownerDocument);
                node._attach(child[PREV] || this, child, this);
            }
        }
    }
    insertBefore(node, before) {
        this._before(before || this[END], [node]);
        return node;
    }
    appendChild(node) {
        this._before(this[END], [node]);
        return node;
    }
    removeChild(node) {
        if (!(node instanceof ChildNode))
            throw new TypeError();
        if (node.parentNode !== this)
            throw DOMException.new('NotFoundError');
        node.remove();
        return node;
    }
    _replace(node, child) {
        if (!node) {
            throw new TypeError();
        }
        else if (node.contains(this)) {
            throw DOMException.new('HierarchyRequestError', 'Not ParentNode');
        }
        else if (!child) {
            throw new TypeError();
        }
        else if (child.parentNode !== this) {
            throw DOMException.new('NotFoundError', 'X');
        }
        let { ownerDocument, nodeType: parentType } = this;
        let { nodeType } = node;
        switch (nodeType) {
            case 1:
                if (9 === parentType) {
                    if (child !== this.firstElementChild || child.nextSibling?.nodeType === 10) {
                        throw DOMException.new('HierarchyRequestError');
                    }
                }
                break;
            case 3:
                if (9 === parentType) {
                    throw DOMException.new('HierarchyRequestError', `${nodeType} not allowed in ${parentType}`);
                }
                break;
            case 4:
            case 7:
            case 8:
                break;
            case 10:
                if (9 === parentType) {
                    let seen_elem = 0;
                    let cur = this.firstChild;
                    for (; cur; cur = cur.nextSibling) {
                        switch (cur.nodeType) {
                            case 10:
                                if (child !== cur) {
                                    throw DOMException.new('HierarchyRequestError', 'already has doctype child');
                                }
                                if (seen_elem > 0) {
                                    throw DOMException.new('HierarchyRequestError', 'element is preceding doctype child');
                                }
                                break;
                            case 1:
                                ++seen_elem;
                            default:
                                if (child === cur && seen_elem > 0) {
                                    throw DOMException.new('HierarchyRequestError', 'element is preceding child');
                                }
                        }
                    }
                }
                else {
                    throw DOMException.new('HierarchyRequestError', `${nodeType} not allowed in ${parentType}`);
                }
                break;
            case 11:
                if (9 === parentType) {
                    let seen_elem = 0;
                    let cur = node.firstChild;
                    for (; cur; cur = cur.nextSibling) {
                        switch (cur.nodeType) {
                            case 10:
                                if (seen_elem > 0) {
                                    throw DOMException.new('HierarchyRequestError', 'doctype is following child');
                                }
                                break;
                            case 1:
                                if (++seen_elem > 1) {
                                    throw DOMException.new('HierarchyRequestError', 'more than one element child');
                                }
                                break;
                            case 3:
                                throw DOMException.new('HierarchyRequestError', 'has a Text node child');
                                break;
                        }
                    }
                    cur = this.firstChild;
                    let seen_child = 0;
                    for (; cur; cur = cur.nextSibling) {
                        switch (cur.nodeType) {
                            case 10:
                                if (seen_child > 0 && seen_elem > 0) {
                                    throw DOMException.new('HierarchyRequestError', 'element before the doctype');
                                }
                                break;
                            case 1: {
                                if (seen_elem > 0) {
                                    if (child !== cur) {
                                        throw DOMException.new('HierarchyRequestError', 'DocumentFragment with an element element child already');
                                    }
                                }
                                break;
                            }
                        }
                        if (child === cur) {
                            seen_child++;
                        }
                    }
                }
                break;
            default:
                throw DOMException.new('HierarchyRequestError');
        }
        if (child === node) {
            return child;
        }
        else if (parentType === 9) {
            ownerDocument = this;
        }
        if (1) {
            let referenceChild = child.nextSibling;
            if (referenceChild === node) {
                referenceChild = node.nextSibling;
            }
            let previousSibling = child.previousSibling;
            let removedNodes = child.parentNode ? [child] : [];
            child._detach(ownerDocument);
            const ref = referenceChild || this[END];
            node._detach(ownerDocument);
            node._attach(ref[PREV] || this, ref, this);
        }
        return child;
    }
    hasChildNodes() {
        return !!this.lastChild;
    }
    get childNodes() {
        let cm;
        return (_children_map.get(this) ||
            (_children_map.set(this, (cm = new Children(this))), cm));
    }
    get children() {
        const self = this;
        return new (class extends HTMLCollection {
            *[Symbol.iterator]() {
                let { firstElementChild: cur } = self;
                for (; cur; cur = cur.nextElementSibling) {
                    yield cur;
                }
            }
        })();
    }
    get childElementCount() {
        let i = 0;
        let { firstElementChild: cur } = this;
        for (; cur; cur = cur.nextElementSibling) {
            ++i;
        }
        return i;
    }
    replaceChildren(...nodes) {
        let { firstChild: cur, lastChild: fin, [END]: end } = this;
        this._before(end, this._toNodes(nodes));
        if (cur && fin) {
            let node;
            do {
                if ((node = cur)) {
                    cur = node.nextSibling;
                    node.remove();
                }
            } while (node !== fin);
        }
    }
    getElementsByTagName(name) {
        const self = this;
        if (name === '*') {
            return new (class extends HTMLCollection {
                *[Symbol.iterator]() {
                    let { [NEXT]: next, [END]: end } = self;
                    for (; next && next !== end; next = next[NEXT]) {
                        if (next.nodeType === 1) {
                            yield next;
                        }
                    }
                }
            })();
        }
        const q = name;
        const pos = name.indexOf(':');
        let { ownerDocument, nodeType } = this;
        const isHTML = ownerDocument ? ownerDocument.isHTML : nodeType === 9 && this.isHTML;
        if (isHTML) {
            let p;
            let n;
            let l;
            if (pos < 0) {
                n = name;
            }
            else {
                p = name.substring(0, pos);
                n = name.substring(pos + 1);
            }
            return new (class extends HTMLCollection {
                *[Symbol.iterator]() {
                    let { [NEXT]: next, [END]: end } = self;
                    for (; next && next !== end; next = next[NEXT]) {
                        if (next.nodeType === 1) {
                            const el = next;
                            let { localName, namespaceURI, prefix } = el;
                            if (namespaceURI === HTML_NS) {
                                if (el.qualifiedName === q) {
                                    yield el;
                                }
                            }
                            else {
                                if (el.qualifiedName === q) {
                                    yield el;
                                }
                            }
                        }
                    }
                }
            })();
        }
        let p;
        let n;
        if (pos < 0) {
            n = name;
        }
        else {
            p = name.substring(0, pos);
            n = name.substring(pos + 1);
        }
        return new (class extends HTMLCollection {
            *[Symbol.iterator]() {
                let { [NEXT]: next, [END]: end } = self;
                for (; next && next !== end; next = next[NEXT]) {
                    if (next.nodeType === 1) {
                        const el = next;
                        const { localName, prefix } = el;
                        if (el.qualifiedName === q) {
                            yield el;
                        }
                    }
                }
            }
        })();
    }
    getElementsByClassName(name) {
        const self = this;
        const names = (name + '').split(/[\t\n\f\r ]+/).filter((v) => v && v.length > 0);
        return new (class extends HTMLCollection {
            *[Symbol.iterator]() {
                let { [NEXT]: next, [END]: end } = self;
                for (; next && next !== end; next = next[NEXT]) {
                    if (next.nodeType === 1) {
                        const el = next;
                        if (el.hasAttribute('class')) {
                            const cl = el.classList;
                            if (names.some((v) => cl.contains(v))) {
                                yield el;
                            }
                        }
                    }
                }
            }
        })();
    }
    querySelector(selectors) {
        if (arguments.length > 0) {
            const test = prepareMatch(this, selectors + '');
            for (const node of iterQuery(test, this)) {
                return node;
            }
        }
        else {
            throw new TypeError();
        }
        return null;
    }
    querySelectorAll(selectors) {
        if (arguments.length > 0) {
            const test = prepareMatch(this, selectors + '');
            return Array.from(iterQuery(test, this));
        }
        else {
            throw new TypeError();
        }
    }
    get textContent() {
        const text = [];
        let cur = this[NEXT];
        const end = this[END];
        for (; cur && cur !== end; cur = cur[NEXT]) {
            switch (cur.nodeType) {
                case 3:
                case 4:
                    text.push(cur.textContent);
            }
        }
        return text.join('');
    }
    set textContent(text) {
        this.replaceChildren();
        if (text) {
            text = '' + text;
            if (text.length > 0) {
                const { ownerDocument } = this;
                if (ownerDocument) {
                    this.appendChild(ownerDocument.createTextNode(text));
                }
            }
        }
    }
    get innerHTML() {
        const { firstChild, lastChild } = this;
        return firstChild && lastChild ? Array.from(enumXMLDump(firstChild.startNode, lastChild.endNode)).join('') : '';
    }
    set innerHTML(html) {
        this.replaceChildren();
        parseDOM(html, this);
    }
    insertAdjacentHTML(position, text) {
        const { parentNode, ownerDocument } = this;
        const element = ownerDocument?.createDocumentFragment();
        if (!element) {
            throw new Error('');
        }
        parseDOM(text, element);
        switch (position) {
            case 'beforebegin':
                if (parentNode) {
                    parentNode.insertBefore(element, this);
                }
                else {
                    return null;
                }
                break;
            case 'afterend':
                if (parentNode) {
                    parentNode.insertBefore(element, this.nextSibling);
                }
                else {
                    return null;
                }
                break;
            case 'afterbegin':
                this.insertBefore(element, this.firstChild);
                break;
            case 'beforeend':
                this.insertBefore(element, null);
                break;
            default:
                throw DOMException.new('SyntaxError', `Invalid position ${position}`);
        }
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        let { firstChild: curB } = node;
        let { firstChild: curA } = this;
        for (;;) {
            if (curA && curB) {
                if (!curA.isEqualNode(curB)) {
                    return false;
                }
                curA = curA.nextSibling;
                curB = curB.nextSibling;
            }
            else {
                return !curA === !curB;
            }
        }
        return false;
    }
    get qualifiedName() {
        return this.nodeName;
    }
    get outerHTML() {
        return Array.from(enumXMLDump(this, this[END])).join('');
    }
    set outerHTML(html) {
        this.replaceChildren();
        parseDOM(html, this);
        this.replaceWith(...this.children);
    }
    toString() {
        return this.outerHTML;
    }
}
const _children_map = new WeakMap();
function* iterQuery(test, elem) {
    let { [NEXT]: next, [END]: end } = elem;
    for (; next && next !== end; next = next[NEXT]) {
        if (1 === next.nodeType && test(next)) {
            yield next;
        }
    }
}
function _removeChild(parent, child) { }
export class EndNode extends Node {
    parentNode;
    constructor(parent) {
        super();
        this.parentNode = this[PREV] = parent;
    }
    get startNode() {
        return this.parentNode;
    }
    get nodeType() {
        return -1;
    }
    get nodeName() {
        return '#end';
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        let { parentNode: parentB } = node;
        let { parentNode: parentA } = this;
        return (parentA && parentB && parentA.isEqualNode(parentB)) || false;
    }
}
export class HTMLCollection {
    constructor() {
        const n = this.length;
    }
    item(index) {
        if (index >= 0) {
            for (const cur of this) {
                if (index-- === 0) {
                    return cur;
                }
            }
        }
        else if (index) {
            return this.namedItem(index + '');
        }
        return null;
    }
    namedItem(name) {
        for (const cur of this) {
            if (cur.id == name) {
                return cur;
            }
        }
        return null;
    }
    get length() {
        let i = 0;
        let id;
        for (const cur of this) {
            this[i++] = cur;
            if (cur.nodeType === 1 && (id = cur.id) && id.length > 0) {
                this[id] = cur;
            }
        }
        const n = i;
        while (i in this) {
            delete this[i++];
        }
        return n;
    }
}
function _insert(parent, node, child) {
    if (child) {
    }
    else {
    }
}
import { prepareMatch } from './css/match.js';
import { enumXMLDump } from './dom-serialize.js';
import { parseDOM } from './dom-parse.js';
import { HTML_NS } from './namespace.js';
import { DOMException } from './event-target.js';
//# sourceMappingURL=parent-node.js.map