export declare class DOMImplementation {
    hasFeature(feature?: string, version?: string): boolean;
    ownerDocument: Document;
    constructor(ownerDocument: Document);
    createDocument(namespace?: string, qualifiedName?: string, doctype?: DocumentType): XMLDocument;
    createHTMLDocument(titleText?: string): HTMLDocument;
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): DocumentType;
    static createHTMLDocument(titleText?: string): HTMLDocument;
}
export declare function documentBaseURL(document: Document): string;
import { Document, XMLDocument, HTMLDocument } from "./document.js";
import { DocumentType } from "./document-type.js";
