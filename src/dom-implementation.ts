export class DOMImplementation {
	hasFeature(feature: string = "", version: string = "") {
		// Deprecated,  spec settled to force this method to always return true
		return true;
	}
	ownerDocument: Document;
	// createDocumentType(
	// 	qualifiedName: string,
	// 	publicId: string,
	// 	systemId: string
	// ) {
	// 	return new DocumentType(qualifiedName, publicId, systemId);
	// }
	// abstract createDocument(
	// 	namespace?: string,
	// 	qualifiedName?: string,
	// 	doctype?: DocumentType
	// ): Document;
	// abstract createHTMLDocument(titleText: string): Document;	ownerDocument: Document;
	constructor(ownerDocument: Document) {
		// super();
		this.ownerDocument = ownerDocument;
	}
	createDocument(
		namespace?: string,
		qualifiedName?: string,
		doctype?: DocumentType
	) {
		// const doc = Document.fromNS(namespace);
		const doc = new XMLDocument();
		if (doctype) {
			// if (doctype.ownerDocument) {
			// 	throw new Error(
			// 		"the object is in the wrong Document, a call to importNode is required"
			// 	);
			// }
			doctype.ownerDocument = doc;
			doc.appendChild(doctype);
		}
		if (qualifiedName) {
			doc.appendChild(
				doc.createElementNS(namespace || null, qualifiedName)
			);
		}
		switch (namespace) {
			case "http://www.w3.org/1999/xhtml":
				doc.contentType = "application/xhtml+xml";
				break;
			case "http://www.w3.org/2000/svg":
				doc.contentType = "image/svg+xml";
				break;
		}
		return doc;
	}
	createHTMLDocument(titleText = "") {
		return DOMImplementation.createHTMLDocument(titleText);
	}
	createDocumentType(
		qualifiedName: string,
		publicId: string,
		systemId: string
	) {
		const node = new DocumentType(qualifiedName, publicId, systemId);

		// const node = super.createDocumentType(
		// 	qualifiedName,
		// 	publicId,
		// 	systemId
		// );
		node.ownerDocument = this.ownerDocument;
		return node;
	}
	static createHTMLDocument(titleText?: string) {
		const d = new HTMLDocument();
		const root = d.createElement("html");
		const head = d.createElement("head");
		const title = d.createElement("title");
		d.appendChild(new DocumentType("html"));
		if (titleText) {
			title.appendChild(d.createTextNode(titleText));
			head.appendChild(title);
		}
		root.appendChild(head);
		root.appendChild(d.createElement("body"));
		d.appendChild(root);
		return d;
	}
}

export function documentBaseURL(document: Document): string {
	// https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url

	const firstBase = document.querySelector("base[href]");
	const fallbackBaseURI = fallbackBaseURL(document);

	if (!firstBase) return fallbackBaseURI;

	return frozenBaseURL(firstBase, fallbackBaseURI);
}

function fallbackBaseURL(document: Document) {
	// https://html.spec.whatwg.org/multipage/infrastructure.html#fallback-base-url

	// Unimplemented: <iframe srcdoc>
	const { URL, defaultView } = document;

	if (URL === "about:blank" && defaultView) {
		const { _parent } = defaultView;
		if (_parent && _parent !== defaultView) {
			const { document } = _parent;
			return documentBaseURL(document);
		}
	}

	return document.documentURI;
}

function frozenBaseURL(baseElement: Element, fallbackBaseURL: string) {
	// https://html.spec.whatwg.org/multipage/semantics.html#frozen-base-url
	// The spec is eager (setting the frozen base URL when things change); we are lazy (getting it when we need to)

	const href = baseElement.getAttributeNS(null, "href");
	return href ? new URL(href, fallbackBaseURL).href : fallbackBaseURL;
}

import { Element } from "./element.js";
import { Document, XMLDocument, HTMLDocument } from "./document.js";
import { DocumentType } from "./document-type.js";
