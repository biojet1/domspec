import { NonElementParentNode } from "./non-element-parent-node.js";

export abstract class Document extends NonElementParentNode {
	//// Dom
	contentType: string;
	defaultView?: Window;
	currentScript?: Element;
	_domImpl?: DOMImplementation;
	_location?: URL | string;
	// documentURI?: string;

	protected constructor(contentType?: string) {
		super();
		// this.documentURI = "about:blank";
		this.contentType = contentType || "application/xml";
	}
	get documentURI() {
		const { _location } = this;
		return _location ? _location.toString() : "about:blank";
	}
	get URL() {
		return this.documentURI;
	}
	get compatMode() {
		return "CSS1Compat";
	}
	get characterSet() {
		return "UTF-8";
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
		return "#document";
	}
	get documentElement() {
		return this.firstElementChild;
	}
	get textContent() {
		return null;
	}
	set textContent(text: string | null) {}
	get doctype() {
		const { firstChild } = this;
		for (let cur = firstChild; cur; cur = cur.nextSibling) {
			if (cur.nodeType === 10) {
				return cur as DocumentType;
			}
		}
		// return this.insertBefore(
		// 	new DocumentType("html"),
		// 	firstChild
		// ) as DocumentType;
		return null;
	}
	get body() {
		for (const cur of this.getElementsByTagName("body")) {
			return cur as Element;
		}
		return null;
	}
	get title() {
		for (const cur of this.getElementsByTagName("title")) {
			return cur.textContent;
		}
		return "";
	}
	get head() {
		for (const cur of this.getElementsByTagName("head")) {
			return cur;
		}
		return "";
	}
	get implementation() {
		const { _domImpl } = this;
		return _domImpl || (this._domImpl = new DOMImplementation(this));
	}
	lookupNamespaceURI(prefix: string): string | null {
		if (!prefix) {
			return HTML_NS;
		}
		const { documentElement: node } = this;
		return node && node.lookupNamespaceURI(prefix);
	}
	isDefaultNamespace(ns: string) {
		if (this.isHTML) {
			return HTML_NS === ns;
		}
		const { documentElement: node } = this;
		return node ? node.isDefaultNamespace(ns) : false;
	}
	lookupPrefix(ns: string) {
		const { documentElement: node } = this;
		return node && node.lookupPrefix(ns);
	}

	createElement(localName: string) {
		const node = createElement(this, localName + "");
		node.ownerDocument = this;
		return node;
	}

	createElementNS(
		ns: string | null | undefined,
		qualifiedName: string
	): Element {
		const node = createElement(this, qualifiedName + "", ns || "");
		node.ownerDocument = this;
		return node;
	}
	createTextNode(text: string) {
		const node = new Text(text);
		node.ownerDocument = this;
		return node;
	}
	createComment(text: string) {
		const node = new Comment(text);
		node.ownerDocument = this;
		return node;
	}
	createProcessingInstruction(target: string, data: string) {
		const node = new ProcessingInstruction(target, data);
		node.ownerDocument = this;
		return node;
	}
	createCDATASection(text: string) {
		if (this.isHTML) {
			throw DOMException.new("NotSupportedError");
		}
		const node = new CDATASection(text);
		node.ownerDocument = this;
		return node;
	}
	createDocumentFragment() {
		const node = new DocumentFragment(this);
		// node.ownerDocument = this;
		return node;
	}
	createAttribute(name: string) {
		// console.log("createAttribute:", name, this.contentType);
		// const node = Attr.create(name + "", this.contentType);
		if (!name) {
			name += "";
			if (!name) {
				throw DOMException.new(
					"InvalidCharacterError",
					`name='${name}'`
				);
			}
		}
		// if (!/^[A-Za-z:_]+[\w:\.\xB7-]*$/.test(name)) {
		// 	throw DOMException.new("InvalidCharacterError", `name='${name}'`);
		// }
		checkName(name);
		if (this.isHTML) {
			name = name.toLowerCase();
		}

		const node = new StringAttr(
			name,
			this.isHTML ? name.toLowerCase() : name
		);
		node.ownerDocument = this;
		return node;
	}
	createAttributeNS(nsu: string | null, qualifiedName: string) {
		const [ns, prefix, localName] = validateAndExtract(nsu, qualifiedName);
		const node = new StringAttr(qualifiedName, localName);
		node._ns = ns;
		node._prefix = prefix;
		// console.log("createAttributeNS:", ns, qualifiedName, this.contentType);
		// const node = Attr.createNS(qualifiedName + "", ns, this.contentType);
		node.ownerDocument = this;
		return node;
	}

	createRange() {
		// TODO
		/* c8 ignore next */
		return {};
	}
	createEvent(name: string) {
		return createEvent(name);
	}

	get isHTML() {
		return this.contentType == "text/html";
	}
	get isSVG() {
		return this.contentType == "image/svg+xml";
	}

	cloneNode(deep?: boolean) {
		const { contentType, defaultView, _location } = this;
		const node = new (this.constructor as any)();

		if (contentType) node.contentType = contentType;
		if (defaultView) node.defaultView = defaultView;
		if (_location) node._location = _location;
		// if (characterSet) node.characterSet = characterSet;
		if (deep) {
			const end = node[END];
			const fin = this[END];
			for (
				let cur: Node = this[NEXT] /* c8 ignore next */ || fin;
				cur != fin;
				cur = cur.endNode[NEXT] /* c8 ignore next */ || fin
			) {
				switch (cur.nodeType) {
					case 1: // ELEMENT_NODE
					case 7: // PROCESSING_INSTRUCTION_NODE
					case 8: // COMMENT_NODE
					case 10: // DOCUMENT_TYPE_NODE
						cur.cloneNode()._attach(
							end[PREV] /* c8 ignore next */ || node,
							end,
							node
						);
						break;
					// case 3: // TEXT_NODE
					// case 4: // CDATA_SECTION_NODE
					// case 2: // ATTRIBUTE_NODE
					// case 9: // DOCUMENT_NODE
					// case 11: // DOCUMENT_FRAGMENT_NODE
					// case -1:
					/* c8 ignore next 2*/
					default:
						throw new Error(`Unexpected ${cur.nodeType}`);
					// break;
				}
			}
		}
		return node;
	}
	adoptNode(node: Node) {
		switch (node.nodeType) {
			// case 10: // DOCUMENT_TYPE_NODE
			// 	node.remove();
			// 	break;
			case 9: // DOCUMENT_NODE
			case -1:
				throw DOMException.new("NotSupportedError");
		}
		let { startNode: cur, endNode: end, parentNode, ownerDocument } = node;
		parentNode /* c8 ignore next */ && node.remove();
		/*if (this.isHTML && (!ownerDocument || !ownerDocument.isHTML)) {
			do {
				cur.ownerDocument = this;
				if (cur instanceof Element) {
					const { tagName, namespaceURI } = cur;
					if (namespaceURI === "http://www.w3.org/1999/xhtml") {
						cur.tagName = tagName.toUpperCase();
					}
				}
			} while (cur !== end && (cur = cur[NEXT] || end));
		} else*/ {
			do {
				cur.ownerDocument = this;
			} while (
				cur !== end &&
				(cur = cur[NEXT] || /* c8 ignore next */ end)
			);
		}
		return node;
	}
	importNode(node: Node, deep = false) {
		return this.adoptNode(node.cloneNode(deep));
	}
	*_toNodes(nodes: Array<string | ChildNode>): IterableIterator<ChildNode> {
		for (const [i, node] of nodes.entries()) {
			if (typeof node === "string" || !node) {
				yield this.createTextNode(node + "") as ChildNode;
			} else
				switch (node.nodeType) {
					case undefined:
						throw new Error(`Unexpected ${node}`);
					case 11:
						{
							if (this.firstElementChild) {
								if ((node as ParentNode).firstElementChild) {
									throw DOMException.new(
										"HierarchyRequestError"
									);
								}
							} else {
								if (
									(node as ParentNode).firstElementChild
										?.nextElementSibling
								) {
									throw DOMException.new(
										"HierarchyRequestError"
									);
								}
							}
							for (const cur of (node as ParentNode).childNodes) {
								yield cur;
							}
							yield node;
						}
						break;
					case 10: {
						// DOCUMENT_TYPE_NODE
						if (this.doctype) {
							throw DOMException.new("HierarchyRequestError");
						}
						yield node;
						break;
					}
					case 1: {
						let j = i;
						for (const C = nodes.length; ++j < C; ) {
							const n = nodes[j];
							if (
								n &&
								typeof n !== "string" &&
								n.nodeType === 1
							) {
								throw DOMException.new("HierarchyRequestError");
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
			if (typeof _location === "string") {
				return (this._location = new URL(_location));
			}
			return _location;
		}
		return null;
	}

	set location(url: URL | string | null) {
		throw new Error(`Not implemented`);
	}

	get baseURI() {
		return documentBaseURL(this);
	}
	static _fetcher?: (
		url: RequestInfo,
		init?: RequestInit
	) => Promise<Response>;

	static async fetch(url: RequestInfo, init?: RequestInit) {
		console.info("Document.fetch");
		return import("node-fetch").then((mod) => {
			console.info("node-fetch imported");
			Document.fetch = mod.default;
			return mod.default(url, init);
		});
	}

	static new(mimeType?: string) {
		switch (mimeType) {
			case "image/svg+xml":
				return new SVGDocument(mimeType);
			case "application/xhtml+xml":
				break;
			case "text/html":
				return new HTMLDocument(mimeType);
		}
		return new XMLDocument(mimeType);
	}
	static get resourceLoader() {
		return _resourceLoader || (_resourceLoader = new ResourceLoader());
	}
	//  html: "text/html",
	// xhtml: "application/xhtml+xml",
	// xml: "application/xml",
	// svg: "image/svg+xml",
}

let _resourceLoader: ResourceLoader;

import { RequestInfo, RequestInit } from "node-fetch";

export class XMLDocument extends Document {
	constructor(mimeType = "application/xml") {
		super(mimeType);
	}
}

export class HTMLDocument extends Document {
	constructor(contentType = "text/html") {
		super(contentType);
	}
	get isHTML() {
		return true;
	}
}

export class SVGDocument extends Document {
	constructor(contentType = "image/svg+xml") {
		super(contentType);
	}
	get isSVG() {
		return true;
	}
}
import { ResourceLoader } from "./resource.js";
import { HTML_NS, SVG_NS, validateAndExtract, checkName } from "./namespace.js";
import { ChildNode } from "./child-node.js";
import { EndNode, ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { createElement } from "./elements.js";
import { Attr, StringAttr } from "./attr.js";
import {
	Comment,
	Text,
	CDATASection,
	ProcessingInstruction,
} from "./character-data.js";
import { DocumentFragment } from "./document-fragment.js";
import { DOMImplementation, documentBaseURL } from "./dom-implementation.js";
import { Window } from "./window.js";
import { DocumentType } from "./document-type.js";
import { NEXT, PREV, END, Node } from "./node.js";
import { createEvent } from "./event.js";
import { DOMException } from "./event-target.js";
export { DOMImplementation };
