export class ParentNode extends ChildNode {
	[END]: EndNode;

	//// Tree
	constructor() {
		super();
		this[END] = this[NEXT] = new EndNode(this);
	}

	get endNode(): Node {
		// End node or self
		return this[END];
	}
	hasChildNodes() {
		return !!this.lastChild;
	}
	get childNodes() {
		const nodes = new NodeList();
		let { firstChild: cur } = this;
		for (; cur; cur = cur.nextSibling) {
			nodes.push(cur);
		}
		return nodes;
	}

	get children() {
		const nodes = new NodeList();
		let { firstElementChild: cur } = this;
		for (; cur; cur = cur.nextElementSibling) {
			nodes.push(cur);
		}
		return nodes;
	}

	//// DOM
	get firstChild(): ChildNode | null {
		// Tag -> Attr* -> ChildNode* -> END
		let { [NEXT]: next, [END]: end } = this;
		for (; next && next !== end; next = next.endNode[NEXT]) {
			if (next instanceof ChildNode) {
				return next;
			} else if (next instanceof EndNode) {
				throw new Error("Unexpected following EndNode node");
			}
		}
		return null;
	}

	get firstElementChild(): ParentNode | null {
		let { firstChild: cur }: { firstChild: Node | null } = this;
		for (; cur instanceof ChildNode; cur = cur.nextSibling) {
			if (cur instanceof ParentNode && cur.nodeType === 1) {
				return cur;
			}
		}
		return null;
	}

	get lastChild(): ChildNode | null {
		const prev = this[END][PREV];
		if (prev && prev != this) {
			if (prev instanceof EndNode) {
				return prev[START];
			} else if (prev instanceof ParentNode) {
				throw new Error("Unexpected preceding ParentNode node");
			} else if (prev instanceof ChildNode) {
				return prev;
			}
		}
		return null;
	}

	get lastElementChild(): ChildNode | null {
		let { lastChild: cur }: { lastChild: Node | null } = this;
		for (; cur instanceof ChildNode; cur = cur.previousSibling) {
			if (cur instanceof ParentNode && cur.nodeType === 1) {
				return cur;
			}
		}
		return null;
	}

	insertBefore(node: ChildNode, before?: ChildNode | null) {
		if (node === this) throw new Error("unable to append a node to itself");
		if (before && node === before) before = node.nextSibling;

		const ref = before ?? this[END];

		const prev = ref[PREV];

		if (node instanceof ParentNode) {
			if (node.nodeType === 11) {
				// DOCUMENT_FRAGMENT_NODE = 11;
				const { firstChild, lastChild } = node;
				// TODO: adopt
				if (firstChild && lastChild) {
					prev && firstChild.linkPrior(prev);
					lastChild.linkNext(ref);
					// knownSegment(ref[PREV], firstChild, lastChild, ref);
					// knownAdjacent(node, node[END]);
					node.linkRight(node[END]);
					for (
						let cur: ChildNode | null | false = firstChild;
						cur;

					) {
						// children already connected side by side
						cur.parentNode = this;
						// moCallback(firstChild, null);
						// if (firstChild.nodeType === ELEMENT_NODE)
						// 	connectedCallback(firstChild);
						cur = cur !== lastChild && cur.nextSibling;
					}
				}
			} else {
				node.remove();
				node.parentNode = this;
				prev && node.linkPrior(prev);
				node.linkNext(ref);
				// moCallback(node, null);
				// connectedCallback(node);
			}
		} else if (node instanceof ChildNode) {
			node.remove();
			node.parentNode = this;
			prev && node.linkPrior(prev);
			node.linkNext(ref);
			// moCallback(node, null);
		} else {
			throw new Error(`Unexpected node`);
		}

		return node;
	}
	appendChild(node: ChildNode) {
		return this.insertBefore(node);
	}

	contains(node?: ChildNode) {
		while (node && node !== this) node = node.parentNode;
		return node === this;
	}

	removeChild(node: ChildNode) {
		if (node.parentNode !== this) throw new Error("node is not a child");
		node.remove();
		return node;
	}

	replaceChild(node: ChildNode, replaced: ChildNode) {
		const next = replaced.endNode[NEXT] as ChildNode;
		replaced.remove();
		this.insertBefore(node, next);
		return replaced;
	}
}

export class EndNode extends Node {
	[START]: ParentNode;
	constructor(parent: ParentNode) {
		super();
		this[START] = this[PREV] = parent;
	}
	get startNode(): Node {
		return this[START];
	}
	get nodeType() {
		return -1;
	}
}

// https://dom.spec.whatwg.org/#interface-nodelist

/**
 *NodeList
 */
export class NodeList extends Array<ChildNode> {
	item(i: number) {
		return i < this.length ? this[i] : null;
	}
}

import { Node, PREV, NEXT, START, END } from "./node.js";

import { ChildNode } from "./child-node.js";
