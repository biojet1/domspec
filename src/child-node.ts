import { Node, NEXT, PREV, END } from "./node.js";

export abstract class ChildNode extends Node {
	//// Tree
	_link(prev: Node, next: Node, parent: ParentNode) {
		this.parentNode = parent;
		prev.linkRight(this.startNode);
		return this.endNode.linkRight(next);
	}
	//// Dom
	get nextSibling(): ChildNode | null {
		const node = this.endNode[NEXT];
		if (node instanceof EndNode) {
			/* c8 ignore start */
			if (node.parentNode !== this.parentNode) {
				console.log([node.parentNode, this.parentNode]);
				throw new Error("Unexpected following EndNode");
			}
			/* c8 ignore stop */
		} else if (node instanceof ChildNode) {
			return node;
			/* c8 ignore start */
		} else if (node) {
			throw new Error("Unexpected following node");
		}
		/* c8 ignore stop */
		return null;
	}
	get previousSibling(): ChildNode | null {
		const node = this.startNode[PREV];
		if (node instanceof EndNode) {
			// ...<child/></end>
			return node.parentNode;
		} else if (node instanceof ParentNode) {
			/* c8 ignore start */
			if (node !== this.parentNode) {
				throw new Error("Unexpected previous node : ParentNode");
			}
			/* c8 ignore stop */
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

	after(...nodes: Array<string | ChildNode>) {
		const { parentNode, nextSibling } = this;
		if (parentNode) {
			parentNode._insert(
				nextSibling || parentNode[END],
				this._toNodes(nodes)
			);
		}
	}

	before(...nodes: Array<string | ChildNode>) {
		const { parentNode: node } = this;
		if (node) {
			node._insert(this, this._toNodes(nodes));
		}
	}

	replaceWith(...nodes: Array<string | ChildNode>) {
		const { parentNode: node } = this;
		if (node) {
			node._insert(this, this._toNodes(nodes));
			this.remove();
		}
	}

	*_toNodes(
		nodes: Iterable<string | ChildNode>
	): IterableIterator<ChildNode> {
		const { ownerDocument: doc } = this;
		for (const node of nodes) {
			if (typeof node === "string") {
				if (doc) yield doc.createTextNode(node) as ChildNode;
			} else if (11 === node.nodeType) {
				// DOCUMENT_FRAGMENT_NODE (11).
				for (const cur of node._toNodes(
					(node as ParentNode).childNodes
				)) {
					yield cur;
				}
			} else {
				yield node;
			}
		}
	}
}

import { ParentNode, EndNode } from "./parent-node.js";
import { Element } from "./element.js";
// import { Element } from "./element.js";
