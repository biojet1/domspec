export abstract class ParentNode extends ChildNode {
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
			// return prev.startNode;
			if (prev instanceof EndNode) {
				return prev.parentNode;
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

	prepend(...nodes: Array<ChildNode>) {
		this._insert(this.firstChild || this[END], nodes);
	}

	append(...nodes: Array<ChildNode>) {
		this._insert(this[END], nodes);
	}
	private _insert(ref: ChildNode | EndNode, nodes: Iterable<ChildNode>) {
		let prev: Node = ref[PREV] || this;
		for (const node of nodes) {
			node.remove();
			prev = node._link(prev, ref, this);
		}
	}
	insertBefore(node: ChildNode, before?: ChildNode | EndNode | null) {
		if (node === this) {
			throw new Error("unable to append a node to itself");
		} else if (!before) {
			this.insertBefore(node, this[END]);
		} else if (node === before) {
			this.insertBefore(node, node.nextSibling);
		} else {
			node.remove();
			node._link(before[PREV] || this, before, this);
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
	get childElementCount() {
		let i = 0;
		let { firstElementChild: cur } = this;
		for (; cur; cur = cur.nextElementSibling) {
			++i;
		}
		return i;
	}

	replaceChildren(...nodes: Array<string | ChildNode>) {
		let { [NEXT]: next, [END]: end, ownerDocument: doc } = this;
		let child;
		while (next && next !== end) {
			next = (child = next).endNode[NEXT];
			if (child instanceof ChildNode) {
				child.remove();
			} else if (child instanceof EndNode) {
				throw new Error("Unexpected following EndNode node");
			}
		}

		function* gen() {
			for (const node of nodes) {
				if (typeof node === "string") {
					if (doc) yield doc.createTextNode(node);
				} else {
					yield node;
				}
			}
		}

		this._insert(end, gen());
	}
	get textContent(): string | null {
		const text = [];
		let cur: Node | null | undefined = this[NEXT];
		const end = this[END];
		for (; cur && cur !== end; cur = cur[NEXT]) {
			if (cur.nodeType === 3) text.push(cur.textContent);
		}
		return text.join("");
	}
}

export class EndNode extends Node {
	// [START]: ParentNode;
	parentNode: ParentNode;
	constructor(parent: ParentNode) {
		super();
		// this[START] = this[PREV] = parent;
		this.parentNode = this[PREV] = parent;
	}
	// get [START](): ParentNode {
	// 	return this.parentNode;
	// }
	get startNode(): Node {
		// return this[START];
		return this.parentNode;
	}
	get nodeType() {
		return -1;
	}
	get nodeName() {
		return "#end";
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
import { NonElementParentNode } from "./non-element-parent-node.js";
