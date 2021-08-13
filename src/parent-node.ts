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
				/* c8 ignore start */
			} else if (next instanceof EndNode) {
				throw new Error("Unexpected following EndNode node");
				/* c8 ignore stop */
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
				/* c8 ignore start */
				throw new Error("Unexpected preceding ParentNode node");
				/* c8 ignore stop */
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
		this._insert(this.firstChild || this[END], this._toNodes(nodes));
	}

	append(...nodes: Array<ChildNode>) {
		this._insert(this[END], this._toNodes(nodes));
	}

	_insert(ref: ChildNode | EndNode, nodes: Iterable<ChildNode>) {
		let prev: Node = ref[PREV] || this;
		if (ref.parentNode != this) {
			throw new Error("NotFoundError: unexpected reference child parent");
		}
		for (const node of nodes) {
			if (node instanceof ParentNode) {
				if (node.contains(this)) {
					throw new Error(
						"HierarchyRequestError: node is ansector of parent."
					);
				}
			}
			if (node !== ref) {
				node.remove();
				node._link(ref[PREV] || this, ref, this);
			}
		}
	}

	insertBefore(node: ChildNode, before?: ChildNode | EndNode | null) {
		if (node === this) {
			throw new Error(
				"HierarchyRequestError: unable to append a node to itself"
			);
		} else if (!before) {
			const cur = this[END];
			node.remove();
			node._link(cur[PREV] || this, cur, this);
			// this.insertBefore(node, this[END]);
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
		if (node.parentNode !== this) throw new Error("NotFoundError");
		node.remove();
		return node;
	}

	replaceChild(node: ChildNode, child: ChildNode) {
		this.insertBefore(node, child.endNode[NEXT] as ChildNode);
		child.remove();
		return child;
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
				/* c8 ignore start */
			} else if (child instanceof EndNode) {
				throw new Error("Unexpected following EndNode node");
				/* c8 ignore stop */
			}
		}

		this._insert(end, this._toNodes(nodes));
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

	*elementsByTagName(name: string) {
		let { [NEXT]: next, [END]: end } = this;
		for (; next && next !== end; next = next[NEXT]) {
			if (next.nodeType === 1) {
				const el = next as any as Element;
				const { localName } = el;
				if (localName === name) {
					yield el;
				}
			}
		}
	}

	*elementsByClassName(name: string) {
		let { [NEXT]: next, [END]: end } = this;
		for (; next && next !== end; next = next[NEXT]) {
			if (next.nodeType === 1) {
				const el = next as any as Element;
				if (el.hasAttribute("class") && el.classList.contains(name)) {
					yield el;
				}
			}
		}
	}

	getElementsByTagName(name: string) {
		return ElementList.from(this.elementsByTagName(name));
	}

	getElementsByClassName(name: string) {
		return ElementList.from(this.elementsByClassName(name));
	}

	querySelector(selectors: string) : Element | null {
		const test = prepareMatch(this, selectors);
		for (const node of iterQuery(test, this)) {
			return node;
		}
		return null;
	}

	querySelectorAll(selectors: string) : Element[] {
		const test = prepareMatch(this, selectors);
		return Array.from(iterQuery(test, this));
	}
}

function* iterQuery(test: (node: Element) => boolean, elem: ParentNode) {
	let { [NEXT]: next, [END]: end } = elem;
	for (; next && next !== end; next = next[NEXT]) {
		if (1 === next.nodeType && test(next as Element)) {
			yield next as Element;
		}
	}
}

export class EndNode extends Node {
	parentNode: ParentNode;
	constructor(parent: ParentNode) {
		super();
		this.parentNode = this[PREV] = parent;
	}
	get startNode(): Node {
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
export class NodeCollection<T> extends Array<T> {
	item(i: number): T | null {
		return i < this.length ? this[i] : null;
	}
}
export class NodeList extends NodeCollection<ChildNode> {}
export class ElementList extends NodeCollection<Element> {}

import { Node, PREV, NEXT, START, END } from "./node.js";
import { ChildNode } from "./child-node.js";
import { NonElementParentNode } from "./non-element-parent-node.js";
import { Element } from "./element.js";
import { prepareMatch } from "./css/match.js";
