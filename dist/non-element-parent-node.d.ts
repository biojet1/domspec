import { Node } from "./node.js";
import { ParentNode } from "./parent-node.js";
export declare abstract class NonElementParentNode extends ParentNode {
    getElementById(id: string): Node | null;
}
