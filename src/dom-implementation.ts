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
	// createDocument(
	// 	namespace?: string,
	// 	qualifiedName?: string,
	// 	doctype?: DocumentType
	// ) {
	// 	var doc = new Document(namespace);
	// 	if (doctype) {
	// 		if (doctype.ownerDocument) {
	// 			throw new Error(
	// 				"the object is in the wrong Document, a call to importNode is required"
	// 			);
	// 		}
	// 		doctype.ownerDocument = doc;
	// 		doc.appendChild(doctype);
	// 	}
	// 	if (qualifiedName) {
	// 		doc.appendChild(doc.createElementNS(namespace||null, qualifiedName));
	// 	}
	// 	return doc;
	// }
	abstract createHTMLDocument(titleText:string): Document;
	// createHTMLDocument(titleText = "") {
	// 	const d = new HTMLDocument();
	// 	const root = d.createElement("html");
	// 	const head = d.createElement("head");
	// 	const title = d.createElement("title");
	// 	title.appendChild(d.createTextNode(titleText));
	// 	head.appendChild(title);
	// 	root.appendChild(head);
	// 	root.appendChild(d.createElement("body"));
	// 	d.appendChild(root);
	// 	return d;
	// }
}

import { Document } from "./document.js";
// import { HTMLDocument } from "./html/document.js";
import { DocumentType } from "./document-type.js";
