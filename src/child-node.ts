import { Node, NEXT, PREV, START } from "./node.js";

export class ChildNode extends Node {
	//// Tree
	//// Dom
	get nextSibling(): ChildNode | null {
		const node = this.endNode[NEXT];
		if (node instanceof EndNode) {
			if (node[START] !== this.parentNode) {
				throw new Error("Unexpected following node");
			}
		} else if (node instanceof ChildNode) {
			return node;
		} else if (node) {
			throw new Error("Unexpected following node");
		}
		return null;
	}
	get previousSibling(): ChildNode | null {
		const node = this.startNode[PREV];
		if (node instanceof EndNode) {
			// ...<child/></end>
			return node[START];
		} else if (node instanceof ParentNode) {
			if (node !== this.parentNode) {
				throw new Error("Unexpected previous node : ParentNode");
			}
		} else if (node instanceof ChildNode) {
			return node;
		}
		return null;
	}

	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node && node.nodeType == 1 ? (node as Element) : null;
	}

	get nextElementSibling(): Element | null {
		let { nextSibling: node } = this;
		for (; node; node = node.nextSibling) {
			if (node.nodeType == 1) {
				return node as Element;
			}
		}
		return null;
	}

	get previousElementSibling(): Element | null {
		let { previousSibling: node } = this;
		for (; node; node = node.previousSibling) {
			if (node.nodeType == 1) {
				return node as Element;
			}
		}
		return null;
	}
}

import { ParentNode, EndNode } from "./parent-node.js";
import { Element } from "./element.js";
