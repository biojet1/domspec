import { Node, PREV, NEXT, START, END } from "./node.js";
import { ChildNode } from "./child-node.js";

export class ParentNode extends ChildNode {
	[END]: EndNode;
	//// Tree
	get endNode() {
		// End node or self
		return this[END];
	}
	get followingSibling() {
		const next = this[END][NEXT];
		return !next || next instanceof EndNode ? null : next;
	}
	// get followingNode() {
	// 	const end = this.getEnd(node);
	// 	if (end) {
	// 		const next = end[NEXT];
	// 		return next && (next instanceof EndNode ? null : next);
	// 	}
	// }

	//// DOM
}
export class EndNode extends Node {
	[START]: ParentNode;
}
