export declare class DocumentType extends ChildNode {
    publicId: string;
    systemId: string;
    name: string;
    constructor(name: string, publicId?: string, systemId?: string);
    get nodeType(): number;
    get nodeName(): string;
    cloneNode(deep?: boolean): DocumentType;
    toString(): string;
    isEqualNode(node: Node): boolean;
}
import { Node } from './node.js';
import { ChildNode } from './child-node.js';
