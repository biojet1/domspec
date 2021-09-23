import { Node, NEXT, PREV, END } from "./node.js";

export abstract class ChildNode extends Node {
	//// Tree
	//// Dom
	constructor() {
		super();
		this.parentNode = null;
	}
	get nextSibling(): ChildNode | null {
		const node = this.endNode[NEXT];
		if (node instanceof EndNode) {
			/* c8 ignore start */
			if (node.parentNode !== this.parentNode) {
				// console.log([node.parentNode, this.parentNode]);
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

	protected viableNextSibling(nodes: Array<string | ChildNode>) {
		let next = this.nextSibling;
		while (next) {
			if (nodes.indexOf(next) < 0) {
				break;
			} else {
				next = next.nextSibling;
			}
		}
		return next;
	}

	// protected viablePreviousSibling(nodes: Array<string | ChildNode>) {
	// 	let cur = this.previousSibling;
	// 	while (cur) {
	// 		if (nodes.indexOf(cur) < 0) {
	// 			break;
	// 		} else {
	// 			cur = cur.previousSibling;
	// 		}
	// 	}
	// 	return cur;
	// }

	after(...nodes: Array<string | ChildNode>) {
		// this.parentNode?._after(this, this._toNodes(nodes));
		const { parentNode: node } = this;
		node?._before(
			this.viableNextSibling(nodes) || node[END],
			node._toNodes(nodes)
		);
	}

	before(...nodes: Array<string | ChildNode>) {
		const { parentNode: node } = this;
		node?._before(this, node._toNodes(nodes));
	}

	replaceWith(...nodes: Array<string | ChildNode>) {
		const { parentNode: parent } = this;
		if (parent) {
			const next = this.viableNextSibling(nodes);
			this.remove();
			parent._before(next || parent[END], parent._toNodes(nodes));
		} else {
			// throw new Error(`No parent: ${this.nodeName}`);
			// const { ownerDocument, [PREV]: prev } = this;
			// for (const node of this._toNodes(nodes)) {
			// 	const { startNode, endNode } = node;
			// 	node._detach(ownerDocument);
			// 	this._linkl(endNode);
			// 	startNode._linkl(prev);
			// }
			// this.remove();
		}
	}

	contains(node?: ChildNode) {
		return this === node;
	}

	appendChild(node: Node) {
		if (node) {
			throw new Error(`HierarchyRequestError: Not implemented`);
		} else {
			throw new TypeError();
		}
	}

	*_toNodes(nodes: Array<string | ChildNode>): IterableIterator<ChildNode> {
		const { ownerDocument: doc } = this;
		for (const node of nodes) {
			if (typeof node === "string" || !node) {
				if (doc) {
					yield doc.createTextNode(node + "") as ChildNode;
				}
			} else {
				switch (node.nodeType) {
					case undefined:
						throw new Error(`Unexpected ${node}`);
					case 11: {
						let { firstChild: cur } = node;
						while (cur) {
							const next = cur.nextSibling;
							yield cur;
							cur = next;
						}
						break;
					}
					default:
						yield node;
				}
			}
		}
	}
}

import { ParentNode, EndNode } from "./parent-node.js";
import { Element } from "./element.js";
// import { Element } from "./element.js";
// import { Text } from "./character-data.js";
import { Document } from "./document.js";
