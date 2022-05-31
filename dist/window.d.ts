/// <reference types="node" />
import { Document, HTMLDocument } from './document.js';
import { EventTarget } from './event-target.js';
import * as all from './all.js';
export declare class Window extends EventTarget {
    _document?: Document;
    _frames?: any;
    _performance?: any;
    _parent?: Window;
    _first?: Window;
    _next?: Window;
    _name?: string;
    static _top?: Window;
    constructor(doc?: Document);
    setDocument(doc?: Document): Document;
    get document(): Document;
    get self(): this;
    get window(): this;
    get parent(): Window;
    get name(): string;
    get top(): all.Window;
    get frames(): any;
    get performance(): any;
    set location(url: URL | string | null);
    get location(): URL | string | null;
    requestAnimationFrame(callback: any): NodeJS.Timeout;
    cancelAnimationFrame(id: number): void;
    getComputedStyle(node: Element): all.StylePropertyMap;
    postMessage(message: any, targetOrigin: string): void;
    loadURL1(url: string, params?: any): Promise<HTMLDocument | all.SVGDocument | all.XMLDocument | undefined>;
    loadURL(url: string, params?: any): Promise<Document>;
}
export declare class Location extends URL {
    set href(url: string);
    get href(): string;
}
import { Element } from './element.js';
