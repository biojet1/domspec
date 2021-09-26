export abstract class DOMImplementation {
	hasFeature(feature: string = "", version: string = "") {
		// Deprecated,  spec settled to force this method to always return true
		return true;
	}
	createDocumentType(
		qualifiedName: string,
		publicId: string,
		systemId: string
	) {
		return new DocumentType(qualifiedName, publicId, systemId);
	}
	abstract createDocument(
		namespace?: string,
		qualifiedName?: string,
		doctype?: DocumentType
	): Document;
	abstract createHTMLDocument(titleText: string): Document;
}

function documentBaseURL(document: Document): string | undefined {
	// https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url

	const firstBase = document.querySelector("base[href]");
	const fallbackBaseURI = fallbackBaseURL(document);

	if (firstBase === null) {
		return fallbackBaseURI;
	} else if (fallbackBaseURI) {
		return frozenBaseURL(firstBase, fallbackBaseURI);
	}
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
import { Document } from "./document.js";
import { DocumentType } from "./document-type.js";
