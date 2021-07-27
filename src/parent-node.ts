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

	//// DOM
	get firstChild(): ChildNode | null {
		// Tag -> Attr* -> ChildNode* -> END
		let { [NEXT]: next, [END]: end } = this;
		do {
			if (next instanceof ChildNode) {
				return next;
			}
		} while (next && (next = next[NEXT]) !== end);
		return null;
	}

	get firstElementChild(): ParentNode | null {
		// let { [NEXT]: next, [END]: end } = this;
		// do {
		// 	if (next instanceof ParentNode && next.nodeType === 1) {
		// 		return next;
		// 	}
		// } while (next && (next = next[NEXT]) !== end);
		// return null;

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
		return prev && prev instanceof ChildNode ? prev : null;
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
}

// type RemoveKindField<Type> = {
//     [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
// };

// type Mapper<T extends SimplePOJO> = Omit<{
//     [K in keyof T]: {
//       name: K;
//       type: T[K];
//     };
// }, 'last_name'>;

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

import { Node, PREV, NEXT, START, END } from "./node.js";

import { ChildNode } from "./child-node.js";
