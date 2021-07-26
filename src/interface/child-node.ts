import { Node, NEXT, PREV } from "./node.js";

export class ChildNode extends Node {
	//// Tree
	// get followingSibling(): Node|undefined {
	// 	const { [NEXT]: next } = this;
	// 	const node = next ?? next.endNode();
	// 	if (node instanceof ChildNode) {
	// 		return node;
	// 	}
	// }

	// get precedingSibling(): Node|undefined {
	// 	const { [PREV]: prev } = this;
	// 	const node = prev ?? prev.startNode();
	// 	if (node instanceof ChildNode) {
	// 		return node;
	// 	}
	// }
	//// Dom
	get nextSibling(): ChildNode | null {
		// const { precedingSibling: node } = this;
		// return node instanceof ChildNode ? node : null;
		const node = this.endNode[NEXT];
		if (node instanceof ChildNode) {
			return node;
		}
		return null;
	}
	get previousSibling(): ChildNode | null {
		// const { precedingSibling: node } = this;
		// return node instanceof ChildNode ? node : null;

		const node = this.startNode[PREV];
		if (node instanceof ChildNode) {
			return node;
		}
		return null;
	}

	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node && node.nodeType == 1 ? (node as Element) : null;
		// return node instanceof Element ? node : null;
	}
}

import { Element } from "./element.js";
