import { Element } from '../element.js';
import { Document } from '../document.js';
import { CSSStyleSheet, CSSStyleRule } from './stylesheet.js';
import { StylePropertyMap } from './stylemap.js';
export declare function parseStyleSheet(node: Element): CSSStyleSheet;
export declare class StyleSheetList extends Array<CSSStyleSheet> {
    static create(document: Document): StyleSheetList;
    static assign(document: Document): StyleSheetList;
    forEachMatchingSheetRuleOfElement(element: Element, handleRule: (rule: CSSStyleRule) => void): void;
    getCascadedPropertyValue(element: Element, property: string): string;
    resolvedValueImpl(property: string): {
        initial: string;
        inherited: boolean;
        computedValue: string;
    };
    getSpecifiedValue(element: Element, property: string): string;
    getComputedValue(element: Element, property: string): string;
    getComputedStyle(element: Element, names?: string[]): StylePropertyMap;
}
export declare function getStyleSheets(document: Document): StyleSheetList;
export declare function getComputedStyleMap(node: Element): StylePropertyMapReadOnly;
declare class StylePropertyMapReadOnly {
    sheets: StyleSheetList;
    element: Element;
    constructor(node: Element);
    get(name: string): string;
}
export {};
