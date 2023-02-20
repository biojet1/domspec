import { Element } from "./element.js";
interface DocLike {
    contentType: string;
    isHTML: boolean;
}
export declare function createElement(doc: DocLike, name: string, namespace?: string): Element;
export {};
