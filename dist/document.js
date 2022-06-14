import { NonElementParentNode } from './non-element-parent-node.js';
export class Document extends NonElementParentNode {
    contentType;
    currentScript;
    _domImpl;
    _location;
    #all;
    constructor(contentType) {
        super();
        this.contentType = contentType || 'application/xml';
    }
    get documentURI() {
        const { _location } = this;
        return _location ? _location.toString() : 'about:blank';
    }
    get URL() {
        return this.documentURI;
    }
    get compatMode() {
        return 'CSS1Compat';
    }
    get characterSet() {
        return 'UTF-8';
    }
    get charset() {
        return this.characterSet;
    }
    get inputEncoding() {
        return this.characterSet;
    }
    get nodeType() {
        return 9;
    }
    get nodeName() {
        return '#document';
    }
    get documentElement() {
        return this.firstElementChild;
    }
    get textContent() {
        return null;
    }
    set textContent(text) { }
    get doctype() {
        const { firstChild } = this;
        for (let cur = firstChild; cur; cur = cur.nextSibling) {
            if (cur.nodeType === 10) {
                return cur;
            }
        }
        return null;
    }
    get body() {
        for (const cur of this.getElementsByTagName('body')) {
            return cur;
        }
        return null;
    }
    get title() {
        for (const cur of this.getElementsByTagName('title')) {
            return cur.textContent;
        }
        return '';
    }
    get head() {
        for (const cur of this.getElementsByTagName('head')) {
            return cur;
        }
        return '';
    }
    get implementation() {
        const { _domImpl } = this;
        return _domImpl || (this._domImpl = new DOMImplementation(this));
    }
    lookupNamespaceURI(prefix) {
        if (!prefix) {
            return HTML_NS;
        }
        const { documentElement: node } = this;
        return node && node.lookupNamespaceURI(prefix);
    }
    isDefaultNamespace(ns) {
        if (this.isHTML) {
            return HTML_NS === ns;
        }
        const { documentElement: node } = this;
        return node ? node.isDefaultNamespace(ns) : false;
    }
    lookupPrefix(ns) {
        const { documentElement: node } = this;
        return node && node.lookupPrefix(ns);
    }
    createElement(localName) {
        const node = createElement(this, localName + '');
        node.ownerDocument = this;
        return node;
    }
    createElementNS(ns, qualifiedName) {
        const node = createElement(this, qualifiedName + '', ns || '');
        node.ownerDocument = this;
        return node;
    }
    createTextNode(text) {
        const node = new Text(text);
        node.ownerDocument = this;
        return node;
    }
    createComment(text) {
        const node = new Comment(text);
        node.ownerDocument = this;
        return node;
    }
    createProcessingInstruction(target, data) {
        const node = new ProcessingInstruction(target, data);
        node.ownerDocument = this;
        return node;
    }
    createCDATASection(text) {
        if (this.isHTML) {
            throw DOMException.new('NotSupportedError');
        }
        const node = new CDATASection(text);
        node.ownerDocument = this;
        return node;
    }
    createDocumentFragment() {
        const node = new DocumentFragment(this);
        return node;
    }
    createAttribute(name) {
        if (!name) {
            name += '';
            if (!name) {
                throw DOMException.new('InvalidCharacterError', `name='${name}'`);
            }
        }
        checkName(name);
        if (this.isHTML) {
            name = name.toLowerCase();
        }
        const node = new StringAttr(name, this.isHTML ? name.toLowerCase() : name);
        node.ownerDocument = this;
        return node;
    }
    createAttributeNS(nsu, qualifiedName) {
        const [ns, prefix, localName] = validateAndExtract(nsu, qualifiedName);
        const node = new StringAttr(qualifiedName, localName);
        node._ns = ns;
        node._prefix = prefix;
        node.ownerDocument = this;
        return node;
    }
    createRange() {
        return {};
    }
    createEvent(name) {
        return createEvent(name);
    }
    get isHTML() {
        return this.contentType == 'text/html';
    }
    get isSVG() {
        return this.contentType == 'image/svg+xml';
    }
    cloneNode(deep) {
        const { contentType, defaultView, _location } = this;
        const node = new this.constructor();
        if (contentType)
            node.contentType = contentType;
        if (defaultView)
            node.defaultView = defaultView;
        if (_location)
            node._location = _location;
        if (deep) {
            const end = node[END];
            const fin = this[END];
            for (let cur = this[NEXT] || fin; cur != fin; cur = cur.endNode[NEXT] || fin) {
                switch (cur.nodeType) {
                    case 1:
                    case 7:
                    case 8:
                    case 10:
                        cur.cloneNode()._attach(end[PREV] || node, end, node);
                        break;
                    default:
                        throw new Error(`Unexpected ${cur.nodeType}`);
                }
            }
        }
        return node;
    }
    adoptNode(node) {
        switch (node.nodeType) {
            case 9:
            case -1:
                throw DOMException.new('NotSupportedError');
        }
        let { startNode: cur, endNode: end, parentNode, ownerDocument } = node;
        parentNode && node.remove();
        {
            do {
                cur.ownerDocument = this;
            } while (cur !== end && (cur = cur[NEXT] || end));
        }
        return node;
    }
    importNode(node, deep = false) {
        return this.adoptNode(node.cloneNode(deep));
    }
    *_toNodes(nodes) {
        for (const [i, node] of nodes.entries()) {
            if (typeof node === 'string' || !node) {
                yield this.createTextNode(node + '');
            }
            else
                switch (node.nodeType) {
                    case undefined:
                        throw new Error(`Unexpected ${node}`);
                    case 11:
                        {
                            if (this.firstElementChild) {
                                if (node.firstElementChild) {
                                    throw DOMException.new('HierarchyRequestError');
                                }
                            }
                            else {
                                if (node.firstElementChild?.nextElementSibling) {
                                    throw DOMException.new('HierarchyRequestError');
                                }
                            }
                            for (const cur of node.childNodes) {
                                yield cur;
                            }
                            yield node;
                        }
                        break;
                    case 10: {
                        if (this.doctype) {
                            throw DOMException.new('HierarchyRequestError');
                        }
                        yield node;
                        break;
                    }
                    case 1: {
                        let j = i;
                        for (const C = nodes.length; ++j < C;) {
                            const n = nodes[j];
                            if (n && typeof n !== 'string' && n.nodeType === 1) {
                                throw DOMException.new('HierarchyRequestError');
                            }
                        }
                    }
                    default:
                        yield node;
                }
        }
    }
    get location() {
        const { _location } = this;
        if (_location) {
            if (typeof _location === 'string') {
                return (this._location = new URL(_location));
            }
            return _location;
        }
        return null;
    }
    set location(url) {
        throw new Error(`Not implemented`);
    }
    get baseURI() {
        return documentBaseURL(this);
    }
    get defaultView() {
        let window = _wMapDocWin.get(this);
        if (window) {
            return window;
        }
        window = new Window();
        window.setDocument(this);
        return window;
    }
    set defaultView(window) {
        window ? _wMapDocWin.set(this, window) : _wMapDocWin.delete(this);
    }
    get styleSheets() {
        return StyleSheetList.assign(this);
    }
    get all() {
        return (this.#all ??
            (this.#all = new Proxy(this, {
                get(target, id) {
                    if (typeof id === 'string') {
                        return target.getElementById(id);
                    }
                },
            })));
    }
    static async fetch(url, init) {
        return import('node-fetch').then((mod) => {
            return (Document.fetch = mod.default)(url, init);
        });
    }
    static new(mimeType) {
        switch (mimeType) {
            case 'image/svg+xml':
                return new SVGDocument(mimeType);
            case 'application/xhtml+xml':
                break;
            case 'text/html':
                return new HTMLDocument(mimeType);
        }
        return new XMLDocument(mimeType);
    }
    static get resourceLoader() {
        return _resourceLoader || (_resourceLoader = new ResourceLoader());
    }
    static setWindow(document, window) {
        _wMapDocWin.set(document, window);
    }
    static getWindow(document) {
        return _wMapDocWin.get(document);
    }
}
let _resourceLoader;
let _wMapDocWin = new WeakMap();
export class XMLDocument extends Document {
    constructor(mimeType = 'application/xml') {
        super(mimeType);
    }
}
export class HTMLDocument extends Document {
    constructor(contentType = 'text/html') {
        super(contentType);
    }
    get isHTML() {
        return true;
    }
}
export class SVGDocument extends Document {
    constructor(contentType = 'image/svg+xml') {
        super(contentType);
    }
    get isSVG() {
        return true;
    }
}
import { ResourceLoader } from './resource.js';
import { HTML_NS, validateAndExtract, checkName } from './namespace.js';
import { createElement } from './elements.js';
import { StringAttr } from './attr.js';
import { Comment, Text, CDATASection, ProcessingInstruction } from './character-data.js';
import { DocumentFragment } from './document-fragment.js';
import { DOMImplementation, documentBaseURL } from './dom-implementation.js';
import { Window } from './window.js';
import { NEXT, PREV, END } from './node.js';
import { createEvent } from './event.js';
import { DOMException } from './event-target.js';
import { StyleSheetList } from './css/domstyle.js';
export { DOMImplementation };
//# sourceMappingURL=document.js.map