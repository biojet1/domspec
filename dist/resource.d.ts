/// <reference types="node" />
/// <reference types="node" />
export declare class ResourceLoader {
    resolveURL(href: string, baseURI: string): string;
    readURL(url: string): Promise<string>;
    readStream(url: string): Promise<import("fs").ReadStream | NodeJS.ReadableStream | null>;
    fetch(url: RequestInfo, init?: RequestInit): Promise<import("node-fetch").Response>;
    static fetch(url: RequestInfo, init?: RequestInit): Promise<import("node-fetch").Response>;
}
import { RequestInfo, RequestInit } from "node-fetch";
export declare function runScripts(scripts: Element[], res?: ResourceLoader): Promise<Element | undefined>;
export declare function runScript(script: Element, res?: ResourceLoader): Promise<Element>;
import { Element } from "./element.js";
