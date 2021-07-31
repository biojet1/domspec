import { NonElementParentNode } from "./non-element-parent-node.js";

export class Document extends NonElementParentNode {
	//// Dom
	contentType: string;
	implementation: DOMImplementation;
	constructor(contentType?: string) {
		super();
		this.contentType =
			contentType && contentType !== "" ? contentType : "application/xml";
		this.implementation = new DOMImplementation();
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
	// get implementation() {
	// 	return new DOMImplementation();
	// }

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

// exports.NAMESPACE = {
//   HTML: 'http://www.w3.org/1999/xhtml',
//   XML: 'http://www.w3.org/XML/1998/namespace',
//   XMLNS: 'http://www.w3.org/2000/xmlns/',
//   MATHML: 'http://www.w3.org/1998/Math/MathML',
//   SVG: 'http://www.w3.org/2000/svg',
//   XLINK: 'http://www.w3.org/1999/xlink'
// };
import { XMLNS, XML } from "./namespace.js";
// import { Node } from "./node.js"; // prevent circular import
// import { ChildNode } from "./child-node.js"; // prevent circular import
import { Element } from "./element.js";
import { Comment, Text, CDATASection } from "./character-data.js";
import { DocumentFragment } from "./document-fragment.js";

import { DOMImplementation } from "./dom-implementation.js";
// import { HTMLDocument } from "./html/document.js";
