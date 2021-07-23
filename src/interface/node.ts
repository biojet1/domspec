// import { IParent, INode, PREV, NEXT, END } from "../tree.js";

export const NEXT = Symbol("next");
export const PREV = Symbol("prev");
export const START = Symbol("start");
export const END = Symbol("end");

export class Node {
	[NEXT]?: Node;
	[PREV]?: Node;
	//// Tree
	// get endNode() {
	// 	// End node or self
	// 	return this;
	// }

	get followingSibling(): Node | null {
		const next = this[NEXT];
		return !next || next instanceof EndNode ? null : next;
	}

	get precedingSibling(): Node | null {
		const { [PREV]: prev } = this;
		if (prev) {
			if (prev instanceof EndNode) {
				return prev[START];
			} else if (prev instanceof ChildNode) {
				return prev;
			}
		}
		return null;
	}
	//// DOM
	get nodeType() {
		return 0;
	}
}

// Node <- ChildNode <- ParentNode
// Node <- EndNode

import { ChildNode } from "./child-node.js";
import { EndNode } from "./parent-node.js";
