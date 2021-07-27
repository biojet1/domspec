import { Node, NEXT, PREV } from "./node.js";

export class ChildNode extends Node {
	//// Tree
	//// Dom
	get nextSibling(): ChildNode | null {
		const node = this.endNode[NEXT];
		return node instanceof ChildNode ? node : null;
	}
	get previousSibling(): ChildNode | null {
		const node = this.startNode[PREV];
		return node instanceof ChildNode ? node : null;
	}

	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node && node.nodeType == 1 ? (node as Element) : null;
	}
}

import { ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
