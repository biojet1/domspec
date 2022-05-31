export declare abstract class CharacterData extends ChildNode {
    _data: string;
    constructor(data?: string);
    get nodeValue(): string;
    get textContent(): string;
    get data(): string;
    set data(data: string);
    set textContent(data: string);
    set nodeValue(data: string);
    appendData(data: string): void;
    deleteData(offset: number, count: number): void;
    insertData(offset: number, data: string): void;
    replaceData(offset: number, count: number, data?: string): void;
    substringData(offset: number, count: number): string;
    get length(): number;
    cloneNode(deep?: boolean): any;
    isEqualNode(node: Node): boolean;
}
export declare class TextNode extends CharacterData {
    get nodeType(): number;
    get nodeName(): string;
    toString(): string;
    splitText(offset: number): ChildNode | this;
    get wholeText(): string;
}
export declare class Text extends TextNode {
    constructor(data?: string);
}
export declare class CDATASection extends Text {
    constructor(data: string);
    toString(): string;
    get nodeName(): string;
    get nodeType(): number;
}
export declare class Comment extends CharacterData {
    constructor(data: string);
    get nodeType(): number;
    get nodeName(): string;
    toString(): string;
}
export declare class ProcessingInstruction extends CharacterData {
    readonly target: string;
    constructor(target: string, data: string);
    get nodeType(): number;
    get nodeName(): string;
    toString(): string;
    cloneNode(): ProcessingInstruction;
    isEqualNode(node: Node): boolean;
}
import { Node } from "./node.js";
import { ChildNode } from "./child-node.js";
