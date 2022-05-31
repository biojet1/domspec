import { NonElementParentNode } from './non-element-parent-node.js';
export declare abstract class Document extends NonElementParentNode {
    #private;
    contentType: string;
    currentScript?: Element;
    _domImpl?: DOMImplementation;
    _location?: URL | string;
    protected constructor(contentType?: string);
    get documentURI(): string;
    get URL(): string;
    get compatMode(): string;
    get characterSet(): string;
    get charset(): string;
    get inputEncoding(): string;
    get nodeType(): number;
    get nodeName(): string;
    get documentElement(): Element | null;
    get textContent(): string | null;
    set textContent(text: string | null);
    get doctype(): DocumentType | null;
    get body(): Element | null;
    get title(): string | null;
    get head(): "" | Element;
    get implementation(): DOMImplementation;
    lookupNamespaceURI(prefix: string): string | null;
    isDefaultNamespace(ns: string): boolean;
    lookupPrefix(ns: string): string | null;
    createElement(localName: string): Element;
    createElementNS(ns: string | null | undefined, qualifiedName: string): Element;
    createTextNode(text: string): Text;
    createComment(text: string): Comment;
    createProcessingInstruction(target: string, data: string): ProcessingInstruction;
    createCDATASection(text: string): CDATASection;
    createDocumentFragment(): DocumentFragment;
    createAttribute(name: string): StringAttr;
    createAttributeNS(nsu: string | null, qualifiedName: string): StringAttr;
    createRange(): {};
    createEvent(name: string): import("./event-target.js").Event;
    get isHTML(): boolean;
    get isSVG(): boolean;
    cloneNode(deep?: boolean): any;
    adoptNode(node: Node): Node;
    importNode(node: Node, deep?: boolean): Node;
    _toNodes(nodes: Array<string | ChildNode>): IterableIterator<ChildNode>;
    get location(): URL | string | null;
    set location(url: URL | string | null);
    get baseURI(): string;
    get defaultView(): Window | null;
    set defaultView(window: Window | null);
    get styleSheets(): StyleSheetList;
    get all(): any;
    static fetch(url: RequestInfo, init?: RequestInit): Promise<import("node-fetch").Response>;
    static new(mimeType?: string): HTMLDocument | SVGDocument | XMLDocument;
    static get resourceLoader(): ResourceLoader;
    static setWindow(document: Document, window: Window): void;
    static getWindow(document: Document): Window | undefined;
}
import { RequestInfo, RequestInit } from 'node-fetch';
export declare class XMLDocument extends Document {
    constructor(mimeType?: string);
}
export declare class HTMLDocument extends Document {
    constructor(contentType?: string);
    get isHTML(): boolean;
}
export declare class SVGDocument extends Document {
    constructor(contentType?: string);
    get isSVG(): boolean;
}
import { ResourceLoader } from './resource.js';
import { ChildNode } from './child-node.js';
import { Element } from './element.js';
import { StringAttr } from './attr.js';
import { Comment, Text, CDATASection, ProcessingInstruction } from './character-data.js';
import { DocumentFragment } from './document-fragment.js';
import { DOMImplementation } from './dom-implementation.js';
import { Window } from './window.js';
import { DocumentType } from './document-type.js';
import { Node } from './node.js';
import { StyleSheetList } from './css/domstyle.js';
export { DOMImplementation };
