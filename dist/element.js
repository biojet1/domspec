import { NEXT, PREV, END } from './node.js';
import { ParentNode } from './parent-node.js';
const DATASET = Symbol();
function* attributes(node) {
    let attr = node[NEXT];
    for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
        yield attr;
    }
}
export class Element extends ParentNode {
    _parsed_closed;
    localName;
    _tag;
    _ns;
    _prefix;
    [DATASET];
    constructor(name, ns, prefix, tag) {
        super();
        this.localName = name;
        if (ns) {
            this._ns = ns;
            if (prefix)
                this._prefix = prefix;
        }
    }
    #tagName() {
        const qName = this.qualifiedName;
        return this?.ownerDocument?.isHTML && this._ns === HTML_NS
            ? qName.replace(/([a-z]+)/g, (m, a) => a.toUpperCase())
            : qName;
    }
    get qualifiedName() {
        const { localName, prefix } = this;
        return prefix ? `${prefix}:${localName}` : localName;
    }
    get prefix() {
        return this._prefix || null;
    }
    get namespaceURI() {
        return this._ns || null;
    }
    get nodeType() {
        return 1;
    }
    get nodeName() {
        return this.tagName;
    }
    get tagName() {
        return this._tag || (this._tag = this.#tagName());
    }
    get id() {
        return this.getAttribute('id') || '';
    }
    set id(id) {
        this.setAttribute('id', id);
    }
    get className() {
        return this.getAttribute('class') || '';
    }
    set className(str) {
        this.setAttribute('class', str);
    }
    getAttribute(name) {
        const node = this.getAttributeNode(name);
        return node ? node.value : null;
    }
    popAttribute(name) {
        const node = this.popAttributeNode(name);
        return node?.value;
    }
    getAttributeNS(ns, localName) {
        const node = this.getAttributeNodeNS(ns, localName);
        return node ? node.value : null;
    }
    getAttributeNode(name) {
        if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
            name = name.toLowerCase();
        }
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.name === name)
                return attr;
        }
        return null;
    }
    popAttributeNode(name) {
        if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
            name = name.toLowerCase();
        }
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.name === name) {
                attr.remove();
                return attr;
            }
        }
        return null;
    }
    newAttributeNode(name) {
        return new StringAttr(name);
    }
    newAttributeNodeNS(nsu, name, localName) {
        return new StringAttr(name, localName);
    }
    letAttributeNode(name) {
        const { ownerDocument, _ns } = this;
        if (ownerDocument?.isHTML && _ns === HTML_NS) {
            name = name.toLowerCase();
        }
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.name === name)
                return attr;
        }
        const node = this.newAttributeNode(name);
        node.ownerDocument = ownerDocument;
        const ref = (attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
        node._attach(ref, ref[NEXT] || this[END], this);
        return node;
    }
    getAttributeNodeNS(nsu, localName) {
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.localName === localName) {
                if (nsu ? attr.namespaceURI === nsu : !attr.namespaceURI) {
                    return attr;
                }
            }
        }
        return null;
    }
    setAttribute(name, value) {
        if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
            name = name.toLowerCase();
        }
        checkName(name);
        const attr = this.letAttributeNode(name);
        attr.value = value;
    }
    letAttributeNodeNS(nms, qname) {
        let attr = this[NEXT];
        const [ns, prefix, lname] = validateAndExtract(nms, qname);
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            const { namespaceURI, localName } = attr;
            if (namespaceURI === ns && localName === lname) {
                return attr;
            }
        }
        const { ownerDocument } = this;
        const node = this.newAttributeNodeNS(nms, qname, lname);
        node._ns = ns;
        node._prefix = prefix;
        node.ownerDocument = ownerDocument;
        const ref = (attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
        node._attach(ref, ref[NEXT] || this[END], this);
        return node;
    }
    setAttributeNS(nms, qname, value) {
        this.letAttributeNodeNS(nms, qname).value = value;
    }
    setAttributeNode(node) {
        return this.setAttributeNodeNS(node);
    }
    setAttributeNodeNS(node) {
        const { parentNode } = node;
        const prev = this.getAttributeNodeNS(node.namespaceURI || null, node.localName);
        if (node === prev) {
            return node;
        }
        else if (parentNode) {
            throw DOMException.new(`InUseAttributeError`);
        }
        else if (prev) {
            const ref = prev[PREV] || this;
            prev.remove();
            node.remove();
            node._attach(ref, ref[NEXT] || this[END], this);
        }
        else {
            let attr = this[NEXT];
            for (; attr && attr instanceof Attr; attr = attr[NEXT])
                ;
            const ref = (attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
            node.remove();
            node._attach(ref, ref[NEXT] || this[END], this);
        }
        return prev;
    }
    removeAttribute(qName) {
        this.getAttributeNode(qName)?.remove();
    }
    removeAttributeNS(ns, localName) {
        this.getAttributeNodeNS(ns, localName)?.remove();
    }
    removeAttributeNode(node) {
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr === node) {
                attr.remove();
                return;
            }
        }
        this.removeAttributeNS(node.namespaceURI || null, node.localName);
    }
    hasAttribute(name) {
        if (this.ownerDocument?.isHTML && this.namespaceURI === HTML_NS) {
            name = name.toLowerCase();
        }
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.name === name)
                return true;
        }
        return false;
    }
    hasAttributes() {
        let attr = this[NEXT];
        return attr && attr instanceof Attr;
    }
    hasAttributeNS(ns, localName) {
        return !!this.getAttributeNodeNS(ns, localName);
    }
    toggleAttribute(name, force) {
        checkName(name);
        if (this.hasAttribute(name)) {
            if (!force) {
                this.removeAttribute(name);
            }
            else {
                return true;
            }
        }
        else if (force == true || force === undefined) {
            this.setAttribute(name, '');
            return true;
        }
        return false;
    }
    get attributes() {
        return new Proxy(this, AttributesHandler);
    }
    getAttributeNames() {
        return new Array(...attributes(this)).map((attr) => attr.name);
    }
    matches(selectors) {
        const test = prepareMatch(this, selectors + '');
        return test(this);
    }
    closest(selectors) {
        let cur = this;
        let test;
        try {
            test = prepareMatch(cur, selectors + '');
        }
        catch {
            return null;
        }
        do {
            if (test(cur)) {
                return cur;
            }
            cur = cur.parentElement;
        } while (cur);
        return null;
    }
    get innerText() {
        return this.textContent;
    }
    lookupNamespaceURI(prefix) {
        const { namespaceURI, prefix: this_prefix } = this;
        if (namespaceURI && this_prefix ? this_prefix === prefix : !prefix)
            return namespaceURI || null;
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.namespaceURI === XMLNS) {
                const { prefix: prefixA, localName: localNameA } = attr;
                if ((prefixA === 'xmlns' && localNameA === prefix) ||
                    (!prefix && !prefixA && localNameA === 'xmlns')) {
                    return attr.value || null;
                }
            }
        }
        const { parentElement: parent } = this;
        return parent ? parent.lookupNamespaceURI(prefix) : null;
    }
    lookupPrefix(ns) {
        if (!ns)
            return null;
        const { namespaceURI, prefix } = this;
        if (namespaceURI === ns && prefix)
            return prefix;
        let attr = this[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            if (attr.namespaceURI === XMLNS) {
                const { prefix: prefixA, value: valueA } = attr;
                if (prefixA === 'xmlns' && valueA === ns) {
                    return attr.localName;
                }
            }
        }
        const { parentElement: parent } = this;
        return parent ? parent.lookupPrefix(ns) : null;
    }
    isDefaultNamespace(namespaceURI) {
        const ns1 = this.lookupNamespaceURI('');
        return ns1 ? ns1 === namespaceURI : !namespaceURI;
    }
    insertAdjacentElement(position, element) {
        const { parentNode } = this;
        if (element.nodeType !== 1) {
            throw new TypeError(`Element expected`);
        }
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
        return element;
    }
    insertAdjacentText(position, text) {
        const { ownerDocument, parentNode } = this;
        const node = ownerDocument && ownerDocument.createTextNode(text);
        if (node)
            switch (position) {
                case 'beforebegin':
                    if (parentNode) {
                        parentNode.insertBefore(node, this);
                    }
                    break;
                case 'afterend':
                    if (parentNode) {
                        parentNode.insertBefore(node, this.nextSibling);
                    }
                    break;
                case 'afterbegin':
                    this.insertBefore(node, this.firstChild);
                    break;
                case 'beforeend':
                    this.insertBefore(node, null);
                    break;
                case null:
                case undefined:
                    break;
                default:
                    throw DOMException.new('SyntaxError', `Invalid position ${position}`);
            }
    }
    get _styleAttr() {
        const attr = this.getAttributeNode('style');
        if (!attr) {
            const node = new StyleAttr('style');
            this.setAttributeNode(node);
            return node;
        }
        else if (attr instanceof StyleAttr) {
            return attr;
        }
        else {
            attr.remove();
            const ref = attr[PREV] || this;
            const node = new StyleAttr('style');
            node._attach(ref, ref[NEXT] || this[END], this);
            node.value = attr.value;
            return node;
        }
    }
    get style() {
        return this._styleAttr.proxy;
    }
    set style(value) {
        this.setAttribute('style', value.toString());
    }
    get attributeStyleMap() {
        return this._styleAttr.MAP;
    }
    computedStyleMap() {
        return getComputedStyleMap(this);
    }
    get classList() {
        const attr = this.getAttributeNode('class');
        if (!attr) {
            const node = new ClassAttr('class');
            this.setAttributeNode(node);
            return node.tokens;
        }
        else if (attr instanceof ClassAttr) {
            return attr.tokens;
        }
        else {
            attr.remove();
            const ref = attr[PREV] || this;
            const node = new ClassAttr('class');
            node._attach(ref, ref[NEXT] || this[END], this);
            node.value = attr.value;
            return node.tokens;
        }
    }
    get dataset() {
        return this[DATASET] || (this[DATASET] = new Proxy(this, dsHandler));
    }
    cloneNode(deep) {
        const { ownerDocument, namespaceURI, localName, prefix, tagName, qualifiedName } = this;
        const node = ownerDocument
            ? ownerDocument.createElementNS(namespaceURI, qualifiedName)
            : new this.constructor(localName, namespaceURI, prefix, tagName);
        if (ownerDocument)
            node.ownerDocument = ownerDocument;
        let cur = this;
        const fin = this[END];
        const end = node[END];
        for (cur = this[NEXT] || fin; cur != fin; cur = cur[NEXT] || fin) {
            if (cur instanceof Attr) {
                cur.cloneNode()._attach(end[PREV] || node, end, node);
            }
            else {
                break;
            }
        }
        if (deep) {
            for (; cur != fin; cur = cur.endNode[NEXT] || fin) {
                switch (cur.nodeType) {
                    case 1:
                        cur.cloneNode(deep)._attach(end[PREV] || node, end, node);
                        break;
                    case 3:
                    case 4:
                    case 7:
                    case 8:
                        cur.cloneNode(deep)._attach(end[PREV] || node, end, node);
                        break;
                    case 2:
                    case 9:
                    case 10:
                    case 11:
                    case -1:
                        throw new Error(`Unexpected ${cur.nodeType}`);
                        break;
                }
            }
        }
        return node;
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        let { namespaceURI: nsB, prefix: prefixB, localName: localB, } = node;
        let { namespaceURI: nsA, prefix: prefixA, localName: localA, } = this;
        const attrsA = new Array(...attributes(this));
        const attrsB = new Array(...attributes(node));
        if (!localA !== !localB ||
            localA !== localB ||
            !nsA !== !nsB ||
            nsA !== nsB ||
            !prefixA !== !prefixB ||
            prefixA !== prefixB ||
            attrsB.length !== attrsA.length) {
            return false;
        }
        A: for (const a of attrsA) {
            for (const b of attrsB) {
                if (a.isEqualNode(b)) {
                    continue A;
                }
            }
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
                return !!curA === !!curB;
            }
        }
    }
    letId() {
        let id = this.getAttribute('id');
        if (!id) {
            this.setAttribute('id', (id = nextUniqueId().toString(36)));
        }
        return id;
    }
}
function toCamelCase(name) {
    return name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
}
function fromCamelCase(name) {
    if (/-[a-z]/.test(name)) {
        throw new Error(`Unexpected dataset name`);
    }
    return 'data-' + name.replace(/([A-Z])/g, (_, $1) => `-${$1.toLowerCase()}`);
}
const dsHandler = {
    get(element, name) {
        return element.getAttribute(fromCamelCase(name)) || undefined;
    },
    set(element, name, value) {
        element.setAttribute(fromCamelCase(name), value + '');
        return true;
    },
    has(element, name) {
        return element.hasAttribute(fromCamelCase(name));
    },
    deleteProperty(element, name) {
        const attr = element.getAttributeNode(fromCamelCase(name));
        if (!attr)
            return false;
        element.removeAttributeNode(attr);
        return true;
    },
    ownKeys(element) {
        return Array.from((function* () {
            let attr = element[NEXT];
            for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
                const { namespaceURI, name } = attr;
                if ((!namespaceURI || namespaceURI === '') && name.startsWith('data-')) {
                    yield toCamelCase(name);
                }
            }
        })());
    },
    getOwnPropertyDescriptor(element, name) {
        return {
            enumerable: true,
            configurable: true,
        };
    },
};
let _id_int = 0;
function nextUniqueId() {
    if (_id_int == 0) {
        _id_int = new Date().getTime();
        return _id_int == 0 ? ++_id_int : _id_int;
    }
    return ++_id_int == 0 ? ++_id_int : _id_int;
}
import { XMLNS } from './namespace.js';
import { StringAttr, Attr } from './attr.js';
import { StyleAttr } from './attr-style.js';
import { ClassAttr } from './attr-class.js';
import { NamedNodeMap, AttributesHandler } from './named-node-map.js';
import { validateAndExtract, checkName, HTML_NS } from './namespace.js';
import { prepareMatch } from './css/match.js';
import { DOMException } from './event-target.js';
import { getComputedStyleMap } from './css/domstyle.js';
export { NamedNodeMap };
//# sourceMappingURL=element.js.map