export abstract class ParentNode extends ChildNode {
	[END]: EndNode;
	// _children?: NodeList;
	// _children?: NodeCollection;
	// _children?: NodeList;

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

	get firstElementChild(): Element | null {
		let { firstChild: cur }: { firstChild: Node | null } = this;
		for (; cur instanceof ChildNode; cur = cur.nextSibling) {
			if (cur instanceof ParentNode && cur.nodeType === 1) {
				return cur as Element;
			}
		}
		return null;
	}

	get lastChild(): ChildNode | null {
		const prev = this[END][PREV];
		if (prev && prev != this) {
			// return prev.startNode as ChildNode;
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

	get lastElementChild(): Element | null {
		let { lastChild: cur }: { lastChild: Node | null } = this;
		for (; cur instanceof ChildNode; cur = cur.previousSibling) {
			if (cur instanceof ParentNode && cur.nodeType === 1) {
				return cur as Element;
			}
		}
		return null;
	}

	prepend(...nodes: Array<ChildNode>) {
		this._before(this.firstChild || this[END], this._toNodes(nodes));
	}

	append(...nodes: Array<ChildNode>) {
		this._before(this[END], this._toNodes(nodes));
	}

	_before(ref: ChildNode | EndNode, nodes: Iterable<ChildNode>) {
		let { ownerDocument, nodeType } = this;
		if (ref.parentNode != this) {
			throw new Error("NotFoundError: unexpected reference child parent");
		} else if (nodeType === 9) {
			ownerDocument = this as unknown as Document;
		}
		for (const node of nodes) {
			if (node instanceof ParentNode) {
				if (node.contains(this)) {
					throw new Error(
						"HierarchyRequestError: node is ancestor of parent."
					);
				}
			}
			switch (node.nodeType) {
				case 11: {
					// DOCUMENT_FRAGMENT_NODE
					if (nodeType === 9) {
						const doc = this as unknown as Document;
						let cur = node.firstChild;
						while (cur) {
							switch (cur.nodeType) {
								case 1: // ELEMENT_NODE
									if (
										doc.firstElementChild ||
										(cur as ParentNode).nextElementSibling
									) {
										break;
									}
								case 7: // PROCESSING_INSTRUCTION_NODE
								case 8: // COMMENT_NODE
								case 10: // DOCUMENT_TYPE_NODE
									cur = cur.nextSibling;
									continue;
							}
							throw new Error(`HierarchyRequestError`);
						}
						if (ref instanceof ChildNode) {
							let cur: ChildNode | null = ref;
							for (; cur; cur = cur.nextSibling) {
								switch (cur.nodeType) {
									case 10: // DOCUMENT_TYPE_NODE
										throw new Error(
											`HierarchyRequestError`
										);
								}
							}
						}
					}
					break;
				}
				case 1: // ELEMENT_NODE
					if (nodeType === 9) {
						if ((this as unknown as Document).firstElementChild) {
							throw new Error(`HierarchyRequestError`);
						}
						if (ref instanceof ChildNode) {
							let cur: ChildNode | null = ref;
							for (; cur; cur = cur.nextSibling) {
								switch (cur.nodeType) {
									case 10: // DOCUMENT_TYPE_NODE
										throw new Error(
											`HierarchyRequestError`
										);
								}
							}
						}
					}
					break;

				case 3: // TEXT_NODE
					if (nodeType === 9) {
						throw new Error(`HierarchyRequestError`);
					}
					break;

				case 4: {
					// CDATA_SECTION_NODE
					// switch (this.nodeType) {
					// 	case 9: // DOCUMENT_NODE
					// 		throw new Error(`HierarchyRequestError`);
					// }
				}
				case 7: // PROCESSING_INSTRUCTION_NODE
				case 8: // COMMENT_NODE
					break;
				case 10: // DOCUMENT_TYPE_NODE
					if (nodeType === 9) {
						const doc = this as unknown as Document;
						if (doc.doctype) {
							throw new Error(`HierarchyRequestError`);
						}
						const first = doc.firstElementChild as unknown as Node;
						if (first && !first.isSameNode(ref)) {
							throw new Error(`HierarchyRequestError`);
						}
						break;
					}
				// fall
				default:
					if (node instanceof ChildNode) {
						throw new Error(`HierarchyRequestError`);
					} else {
						throw new TypeError();
					}
			}
			if (node !== ref) {
				node._detach(ownerDocument);
				node._attach(ref[PREV] || this, ref, this);
			}
		}
		// let { _children } = this;
		// _children && this.childNodes;
		// _children_map.get(this)?.putChildren(this);
	}

	insertBefore(node: ChildNode, before?: ChildNode | EndNode | null) {
		this._before(before || this[END], [node]);
		return node;
	}

	appendChild(node: ChildNode) {
		this._before(this[END], [node]);
		return node;
	}

	contains(node?: ChildNode | null) {
		for (;;) {
			if (node === this) {
				return true;
			} else if (node) {
				if (!(node = node.parentNode)) {
					if (!(arguments[0] instanceof Node)) {
						throw new TypeError();
					}
					break;
				}
			} else {
				if (arguments.length < 1) {
					throw new TypeError();
				}
				break;
			}
		}
		return false;
	}

	removeChild(node: ChildNode) {
		if (!node || !(node instanceof ChildNode)) throw new TypeError();
		if (node.parentNode !== this) throw new Error("NotFoundError");
		node.remove();
		// const { _children } = this;
		// _children && _children.putChildren(this);
		return node;
	}

	replaceChild(node: ChildNode, child: ChildNode) {
		// console.error(
		// 	"replaceChild child.parentNode",
		// 	child.nodeName,
		// 	child.parentNode && child.parentNode.nodeName
		// );
		// if (!node) throw new Error("NotFoundError");
		if (!node || !child) {
			throw new TypeError();
		} else if (child.parentNode !== this) {
			throw new Error("NotFoundError");
		}
		const ref = child.nextSibling || this[END];
		child.remove();
		this._before(ref, [node]);
		return child;
		// this.insertBefore(node, child.endNode[NEXT] as ChildNode);
		// return child;
	}

	_on_child_detached(node: Node) {
		// _children_map?.get(this)?.putChildren(this);
		// _children_map?.get(this)?.length;
	}
	_on_child_attached(node: Node) {
		// _children_map?.get(this)?.putChildren(this);
		// _children_map?.get(this)?.length;
	}

	hasChildNodes() {
		return !!this.lastChild;
	}

	get childNodes(): Children /*NodeList */ {
		// let { _children } = this;
		// return (_children || (this._children = new NodeList())).putChildren(
		// 	this
		// );

		let cm;

		return (
			_children_map.get(this) ||
			// (_children_map.set(this, (cm = new NodeList()).putChildren(this)),
			// cm)
			// (_children_map.set(this, (cm = NodeList.create(this))), cm)
			(_children_map.set(this, (cm = new Children(this))), cm)
		);
	}

	get children() {
		// return new HTMLCollection(this);
		// const nodes = new HTMLCollection();
		// let { firstElementChild: cur } = this;
		// for (; cur; cur = cur.nextElementSibling) {
		// 	nodes.push(cur);
		// }
		// return nodes;
		const self = this;
		// return new HTMLCollectionI({
		// 	[Symbol.iterator]: function () {
		// 		let { firstElementChild: cur } = self;
		// 		return {
		// 			next: () => {
		// 				if (!cur) {
		// 					return { done: true };
		// 				}
		// 				const r = { value: cur, done: false };
		// 				cur = cur.nextElementSibling;
		// 				return r;
		// 			},
		// 		};
		// 	},
		// });
		return new (class extends HTMLCollection {
			*[Symbol.iterator]() {
				let { firstElementChild: cur } = self;
				for (; cur; cur = cur.nextElementSibling) {
					yield cur;
				}
			}
		})();
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
		let { firstChild: cur, lastChild: fin, [END]: end } = this;
		this._before(end, this._toNodes(nodes));
		if (cur && fin) {
			let node;
			do {
				if ((node = cur)) {
					cur = node.nextSibling;
					node.remove();
				}
			} while (node !== fin);
		}
	}

	// *elementsByTagName(name: string) {
	// 	let { [NEXT]: next, [END]: end } = this;
	// 	for (; next && next !== end; next = next[NEXT]) {
	// 		if (next.nodeType === 1) {
	// 			const el = next as any as Element;
	// 			const { localName } = el;
	// 			if (localName === name) {
	// 				yield el;
	// 			}
	// 		}
	// 	}
	// }

	// *elementsByClassName(name: string) {
	// 	let { [NEXT]: next, [END]: end } = this;
	// 	for (; next && next !== end; next = next[NEXT]) {
	// 		if (next.nodeType === 1) {
	// 			const el = next as any as Element;
	// 			if (el.hasAttribute("class") && el.classList.contains(name)) {
	// 				yield el;
	// 			}
	// 		}
	// 	}
	// }

	getElementsByTagName(name: string) {
		// return HTMLCollection.from(this.elementsByTagName(name));
		const self = this;
		if (name === "*") {
			return new (class extends HTMLCollection {
				*[Symbol.iterator]() {
					let { [NEXT]: next, [END]: end } = self;
					for (; next && next !== end; next = next[NEXT]) {
						if (next.nodeType === 1) {
							yield next as any as Element;
						}
					}
				}
			})();
		}
		const pos = name.indexOf(":");
		if (this.ownerDocument?.isHTML) {
			let p: string;
			let n: string;
			let l: string;
			if (pos < 0) {
				n = name;
			} else {
				name = name.replace(/([A-Z]+)/g, (m, a) => a.toLowerCase());
				p = name.substring(0, pos);
				n = name.substring(pos + 1);
				// l = n.replace(/([A-Z]+)/, (m, a) => a.toLowerCase());
			}
			return new (class extends HTMLCollection {
				*[Symbol.iterator]() {
					let { [NEXT]: next, [END]: end } = self;
					for (; next && next !== end; next = next[NEXT]) {
						if (next.nodeType === 1) {
							const el = next as any as Element;
							let { localName, namespaceURI, prefix } = el;
							if (namespaceURI === HTML_NS) {
								localName = localName.replace(
									/([A-Z]+)/g,
									(m, a) => a.toLowerCase()
								);
								if (prefix) {
									prefix = prefix.replace(
										/([A-Z]+)/g,
										(m, a) => a.toLowerCase()
									);
								}
							}
							if (p === undefined) {
								if (localName === n) {
									yield el;
								}
							} else {
								if (localName === n && prefix === p) {
									yield el;
								}
							}
						}
					}
				}
			})();
		}

		let p: string;
		let n: string;
		if (pos < 0) {
			n = name;
		} else {
			p = name.substring(0, pos);
			n = name.substring(pos + 1);
		}
		return new (class extends HTMLCollection {
			*[Symbol.iterator]() {
				let { [NEXT]: next, [END]: end } = self;
				for (; next && next !== end; next = next[NEXT]) {
					if (next.nodeType === 1) {
						const el = next as any as Element;
						const { localName, prefix } = el;
						if (
							localName === n &&
							(p === undefined || (p ? prefix === p : !prefix))
						) {
							yield el;
						}
					}
				}
			}
		})();
	}

	getElementsByClassName(name: string) {
		// return HTMLCollection.from(this.elementsByClassName(name));
		const self = this;
		const names = (name + "")
			.split(/[\t\n\f\r ]+/)
			.filter((v) => v && v.length > 0);
		return new (class extends HTMLCollection {
			*[Symbol.iterator]() {
				let { [NEXT]: next, [END]: end } = self;
				for (; next && next !== end; next = next[NEXT]) {
					if (next.nodeType === 1) {
						const el = next as any as Element;
						if (el.hasAttribute("class")) {
							const cl = el.classList;
							if (names.some((v) => cl.contains(v))) {
								yield el;
							}
						}
					}
				}
			}
		})();
	}

	querySelector(selectors: string): Element | null {
		if (arguments.length > 0) {
			const test = prepareMatch(this, selectors + "");
			for (const node of iterQuery(test, this)) {
				return node;
			}
		} else {
			throw new TypeError();
		}
		return null;
	}

	querySelectorAll(selectors: string): Element[] {
		if (arguments.length > 0) {
			const test = prepareMatch(this, selectors + "");
			return Array.from(iterQuery(test, this));
		} else {
			throw new TypeError();
		}
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

	set textContent(text: string | null) {
		this.replaceChildren();
		if (text) {
			text = "" + text;
			if (text.length > 0) {
				const { ownerDocument } = this;
				if (ownerDocument) {
					this.appendChild(ownerDocument.createTextNode(text));
				}
			}
		}
	}

	get innerHTML(): string {
		const { firstChild, lastChild } = this;
		return firstChild && lastChild
			? Array.from(
					enumXMLDump(firstChild.startNode, lastChild.endNode)
			  ).join("")
			: "";
	}
	set innerHTML(html: string) {
		this.replaceChildren();
		parseDOM(html, this);
	}

	// static childrenOf(parent: ParentNode) {
	// 	const cm = ParentNode._children_map.get(parent);
	// 	if(cm){

	// 	}

	// 	const nodes = (this._children = new NodeList());
	// 	let { firstChild: cur } = this;
	// 	for (; cur; cur = cur.nextSibling) {
	// 		nodes.push(cur);
	// 	}
	// 	return nodes;
	// }

	isEqualNode(node: Node) {
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}

		let { firstChild: curB } = node as ParentNode;
		let { firstChild: curA } = this;
		for (;;) {
			if (curA && curB) {
				if (!curA.isEqualNode(curB)) {
					return false;
				}
				curA = curA.nextSibling;
				curB = curB.nextSibling;
			} else {
				return !curA === !curB;
			}
		}

		return false;
	}
	get qualifiedName() {
		return this.nodeName;
	}
	get outerHTML() {
		return Array.from(enumXMLDump(this, this[END])).join("");
	}

	set outerHTML(html: string) {
		this.replaceChildren();
		parseDOM(html, this);
		this.replaceWith(...this.children);
	}
}
const _children_map = new WeakMap<ParentNode>();

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
	isEqualNode(node: Node) {
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}
		let { parentNode: parentB } = node as EndNode;
		let { parentNode: parentA } = this;
		return parentA && parentB
			? parentA.isEqualNode(parentB)
			: !parentA === !parentB;
	}
}

// export class EmptyNodeCollection  {
// 	[Symbol.iterator](){
// 		return NodeCollection.empty;
// 	}
// }

export abstract class HTMLCollection {
	[i: number]: Element;
	// [id: string]: Element;
	constructor() {
		const n = this.length;
	}
	item(index: number) {
		if (index >= 0) {
			for (const cur of this) {
				if (index-- === 0) {
					return cur;
				}
			}
		} else if (index) {
			return this.namedItem(index + "");
		}
		return null;
	}

	namedItem(name: string) {
		for (const cur of this) {
			if (cur.id == name) {
				return cur;
			}
		}
		return null;
	}

	get length() {
		let i = 0;
		let id;
		for (const cur of this) {
			this[i++] = cur;
			if (cur.nodeType === 1 && (id = cur.id) && id.length > 0) {
				(this as any)[id] = cur;
			}
		}
		// this.splice(i);
		// return i;
		const n = i;
		while (i in this) {
			delete this[i++];
		}
		return n;
	}
	abstract [Symbol.iterator](): Iterator<Element>;
}

import {
	Node,
	PREV,
	NEXT,
	START,
	END,
	// NodeCollection,
	NodeList,
	Children,
} from "./node.js";
import { ChildNode } from "./child-node.js";
import { NonElementParentNode } from "./non-element-parent-node.js";
import { Element } from "./element.js";
import { prepareMatch } from "./css/match.js";
import { enumXMLDump } from "./dom-serialize.js";
import { parseDOM } from "./dom-parse.js";
import { Document } from "./document.js";
import { HTML_NS } from "./namespace.js";
