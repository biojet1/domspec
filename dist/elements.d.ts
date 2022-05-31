import { Element } from "./element.js";
export declare function newElement(contentType: string, qualifiedName: string, namespace?: string | null): Element;
interface DocLike {
    contentType: string;
    isHTML: boolean;
}
export declare function createElement(doc: DocLike, name: string, namespace?: string): Element;
export {};
