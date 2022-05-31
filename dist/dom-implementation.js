export class DOMImplementation {
    hasFeature(feature = "", version = "") {
        return true;
    }
    ownerDocument;
    constructor(ownerDocument) {
        this.ownerDocument = ownerDocument;
    }
    createDocument(namespace, qualifiedName, doctype) {
        const doc = new XMLDocument();
        if (doctype) {
            doctype.ownerDocument = doc;
            doc.appendChild(doctype);
        }
        if (qualifiedName) {
            doc.appendChild(doc.createElementNS(namespace || null, qualifiedName));
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
    createDocumentType(qualifiedName, publicId, systemId) {
        const node = new DocumentType(qualifiedName, publicId, systemId);
        node.ownerDocument = this.ownerDocument;
        return node;
    }
    static createHTMLDocument(titleText) {
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
export function documentBaseURL(document) {
    const firstBase = document.querySelector("base[href]");
    const fallbackBaseURI = fallbackBaseURL(document);
    if (!firstBase)
        return fallbackBaseURI;
    return frozenBaseURL(firstBase, fallbackBaseURI);
}
function fallbackBaseURL(document) {
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
function frozenBaseURL(baseElement, fallbackBaseURL) {
    const href = baseElement.getAttributeNS(null, "href");
    return href ? new URL(href, fallbackBaseURL).href : fallbackBaseURL;
}
import { XMLDocument, HTMLDocument } from "./document.js";
import { DocumentType } from "./document-type.js";
//# sourceMappingURL=dom-implementation.js.map