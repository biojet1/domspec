export class DOMImplementation {
	hasFeature(feature: string, version: string = "") {
		switch (feature) {
			case "xml":
				switch (version) {
					case "":
					case "1.0":
					case "2.0":
						return true;
				}
				break;
			case "core":
				switch (version) {
					case "":
					case "2.0":
						return true;
				}
				break;
			case "html":
				switch (version) {
					case "":
					case "1.0":
					case "2.0":
						return true;
				}
				break;
			case "xhtml":
				switch (version) {
					case "":
					case "1.0":
					case "2.0":
						return true;
				}
				break;
		}
		return false;
	}
	createDocumentType(
		qualifiedName: string,
		publicId: string,
		systemId: string
	): DocumentType {
		return new DocumentType(qualifiedName, publicId, systemId);
	}
	createDocument(
		namespace?: string,
		qualifiedName?: string,
		doctype?: DocumentType
	) {
		var doc = new Document(namespace);
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
			doc.appendChild(doc.createElementNS(namespace||null, qualifiedName));
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

import { HTMLDocument } from "./html/document.js";
import { Document } from "./document.js";
import { DocumentType } from "./document-type.js";
