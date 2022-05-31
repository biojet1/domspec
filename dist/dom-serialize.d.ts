export declare class XMLSerializer {
    serializeToString(node: Node): string;
}
export declare function enumXMLDump(start: Node, end: Node): Generator<string, void, unknown>;
export declare function enumFlatDOM(node: Node): Generator<string | number | null, void, unknown>;
import { Node } from './node.js';
