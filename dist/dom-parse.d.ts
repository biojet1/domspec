export declare function getNamespace(prefix: string, cur: Element, attribs?: {
    [key: string]: string;
}): string | null;
export declare function htmlParser2(doc: Document, top: ParentNode, options?: any): Promise<import("htmlparser2").Parser>;
export declare const pushDOMParser: (parent: ParentNode, opt?: any) => SaxesParser<any>;
export declare const parseDOM: (str: string, parent: ParentNode, opt?: {}) => void;
export declare class DOMParser {
    static parseString(markup: string, type?: string): Document;
    parseFromString(markup: string, type?: string): Document;
    parseFile(path: string, type?: string): Promise<Document>;
    static loadXML(src: string | URL, opt?: {
        xinclude?: boolean | string;
        select?: string;
        type?: string;
    }): Promise<Document>;
}
import { SaxesParser } from "saxes";
import { ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { Document } from "./document.js";
