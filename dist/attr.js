const VALUE = Symbol();
const RE_NAME = /^[_:A-Za-z][\w:_-]*$/;
export class Attr extends Node {
    name;
    localName;
    _ns;
    _prefix;
    constructor(name, localName) {
        super();
        this.name = name;
        this.localName = localName || name;
    }
    get textContent() {
        return this.value;
    }
    set textContent(value) {
        this.value = value;
    }
    get nodeType() {
        return 2;
    }
    get nodeValue() {
        return this.value;
    }
    get specified() {
        return true;
    }
    get namespaceURI() {
        return this._ns || null;
    }
    get prefix() {
        return this._prefix || null;
    }
    get nodeName() {
        return this.name;
    }
    get ownerElement() {
        const { parentNode: node } = this;
        return node || null;
    }
    isDefaultNamespace(namespaceURI) {
        const { parentElement: node } = this;
        return node ? node.isDefaultNamespace(namespaceURI) : false;
    }
    lookupNamespaceURI(prefix) {
        const { parentElement: node } = this;
        return node && node.lookupNamespaceURI(prefix);
    }
    lookupPrefix(ns) {
        const { parentElement: node } = this;
        return node && node.lookupPrefix(ns);
    }
    cloneNode(deep) {
        const { ownerDocument, name, _ns, value, localName, _prefix } = this;
        const attr = new this.constructor(name, localName);
        if (ownerDocument)
            attr.ownerDocument = ownerDocument;
        if (_ns || _ns === null)
            attr._ns = _ns;
        if (_prefix || _prefix === null)
            attr._prefix = _prefix;
        if (value)
            attr.value = value;
        return attr;
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        let { namespaceURI: nsB, prefix: prefixB, localName: localB, value: valB } = node;
        let { namespaceURI: nsA, prefix: prefixA, localName: localA, value: valA } = this;
        return (localA === localB &&
            (nsA ? nsA === nsB : !nsB) &&
            valA === valB);
    }
}
export class StringAttr extends Attr {
    [VALUE];
    valueOf() {
        return this[VALUE] ?? null;
    }
    get value() {
        return this[VALUE] || '';
    }
    set value(value) {
        this[VALUE] = value;
    }
}
import { Node } from './node.js';
//# sourceMappingURL=attr.js.map