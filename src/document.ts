import { NonElementParentNode } from "./non-element-parent-node.js";

export class Document extends NonElementParentNode {
	//// Dom
	contentType: string;
	// implementation: DOMImplementation;
	defaultView?: Window;

	constructor(contentType?: string) {
		super();
		this.contentType =
			contentType && contentType !== "" ? contentType : "application/xml";
		// this.implementation = new DOMImplementation();
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
	get implementation() {
		// return new DOMImplementationA();
		const doc = this;
		return new (class extends DOMImplementationA {
			createDocumentType(
				qualifiedName: string,
				publicId: string,
				systemId: string
			) {
				const node = super.createDocumentType(
					qualifiedName,
					publicId,
					systemId
				);
				node.ownerDocument = doc;
				return node;
			}
		})();
	}

	lookupNamespaceURI(prefix: string | null): string | null {
		const { documentElement: node } = this;
		return node && node.lookupNamespaceURI(prefix);
	}

	createElement(localName: string) {
		const node = new Element();
		node.localName = node.tagName = localName;
		node.ownerDocument = this;
		return node;
	}
	createElementNS(ns: string | null, qualifiedName: string) {
		const [namespace, prefix, localName] = validateAndExtract(
			ns,
			qualifiedName
		);
		const node = new Element();
		if (localName) {
			node.localName = localName;
			if (prefix) {
				node.tagName = `${prefix}:${localName}`;
			} else {
				node.tagName = localName;
			}
			if (namespace) node.namespaceURI = namespace;
		} else {
			// TODO: error
		}
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
	createCDATASection(text: string) {
		const node = new CDATASection(text);
		node.ownerDocument = this;
		return node;
	}
	createDocumentFragment() {
		const node = new DocumentFragment();
		node.ownerDocument = this;
		return node;
	}
	createAttribute(name: string) {
		const node = Attr.create(name);
		node.ownerDocument = this;
		return node;
	}
	static fromNS(ns?: string) {
		switch (ns) {
			case "http://www.w3.org/1999/xhtml":
				return new HTMLDocument();
			case "http://www.w3.org/2000/svg":
				return new SVGDocument();
			default:
				return new XMLDocument();
		}
	}
}

function validateAndExtract(namespace: string | null, qualifiedName: string) {
	let prefix = null,
		localName = qualifiedName,
		pos = qualifiedName.indexOf(":");

	const ns = namespace === "" || !namespace ? null : namespace;

	if (pos >= 0) {
		prefix = qualifiedName.substring(0, pos);
		localName = qualifiedName.substring(pos + 1);
	}
	if (
		(prefix !== null && ns === null) ||
		(prefix === "xml" && ns !== XML) ||
		((prefix === "xmlns" || qualifiedName === "xmlns") && ns !== XMLNS) ||
		(ns === XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
	) {
		throw new Error("NamespaceError");
	}

	return [ns, prefix, localName];
}

export class XMLDocument extends Document {
	constructor(mimeType: string = "application/xml") {
		super(mimeType);
	}
}

export class HTMLDocument extends Document {
	constructor() {
		super("text/html");
	}
}

export class SVGDocument extends Document {
	constructor() {
		super("image/svg+xml");
	}
}

export abstract class DOMImplementationA extends DOMImplementation {
	createDocument(
		namespace?: string,
		qualifiedName?: string,
		doctype?: DocumentType
	) {
		var doc = Document.fromNS(namespace);
		if (doctype) {
			if (doctype.ownerDocument) {
				throw new Error(
					"the object is in the wrong Document, a call to importNode is required"
				);
			}
			doctype.ownerDocument = doc;
			doc.appendChild(doctype);
		}
		if (qualifiedName) {
			doc.appendChild(
				doc.createElementNS(namespace || null, qualifiedName)
			);
		}
		return doc;
	}
	createHTMLDocument(titleText = "") {
		const d = new HTMLDocument();
		const root = d.createElement("html");
		const head = d.createElement("head");
		const title = d.createElement("title");
		title.appendChild(d.createTextNode(titleText));
		head.appendChild(title);
		root.appendChild(head);
		root.appendChild(d.createElement("body"));
		d.appendChild(root);
		return d;
	}
}

import { XMLNS, XML } from "./namespace.js";
import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { Comment, Text, CDATASection } from "./character-data.js";
import { DocumentFragment } from "./document-fragment.js";
import { DOMImplementation } from "./dom-implementation.js";
import { Window } from "./window.js";
import { DocumentType } from "./document-type.js";
