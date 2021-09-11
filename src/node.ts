export const NEXT = Symbol("next");
export const PREV = Symbol("prev");
export const START = Symbol("start");
export const END = Symbol("end");
export const PARENT = Symbol();

export abstract class Node extends EventTarget {
	[NEXT]?: Node;
	[PREV]?: Node;
	//// Tree

	get endNode(): Node {
		// End node or self
		return this;
	}
	get startNode(): Node {
		// Always this
		return this;
	}
	_attach(prev: Node | null, next: Node, parent: ParentNode) {
		const { startNode, endNode } = this;
		if (this.parentNode || startNode[PREV] || endNode[NEXT]) {
			throw new Error(`Detach first`);
		}
		this.parentNode = parent;
		prev && prev._linkr(startNode);
		next && endNode._linkr(next);
		parent && parent._on_child_attached(this);
		// return startNode;
	}

	_linkr(node: Node) {
		// [THIS]<->node
		if (node === this) {
			throw new Error(`Same node`);
		} else if (node) {
			this[NEXT] = node;
			node[PREV] = this;
		} else {
			delete this[NEXT];
		}
		// return node;
	}

	_linkl(node?: Node) {
		// node<->[THIS]
		if (node === this) {
			throw new Error(`Same node`);
		} else if (node) {
			this[PREV] = node;
			node[NEXT] = this;
		} else {
			delete this[PREV];
		}
		// return node;
	}

	_detach(newOwner?: Document | null) {
		const {
			[PREV]: prev,
			endNode: { [NEXT]: next },
			parentNode,
			nodeType,
		} = this;
		// remove(prev, this, next);
		// [PREV]<->[THIS]<->[NEXT] => [PREV]<->[NEXT]

		prev && next && prev._linkr(next);

		this[PREV] = undefined;
		this.endNode[NEXT] = undefined;

		if (parentNode) {
			this.parentNode = null;
			parentNode._on_child_detached(this);
			// moCallback(this, parentNode);
			// if (nodeType === ELEMENT_NODE) disconnectedCallback(this);
		}
		if (newOwner) {
			newOwner.adoptNode(this);
		}
		return this;
	}
	/// Extra
	formatXML(): string {
		throw new Error(`Not implemented for ${this.nodeType}`);
	}
	toString(): string {
		return this.formatXML();
	}
	//// DOM
	_owner?: Document;
	parentNode?: ParentNode | null;
	abstract get nodeType(): number;
	abstract get nodeName(): string;

	get ownerDocument(): Document | null {
		const { _owner } = this;
		return _owner || null;
	}
	set ownerDocument(doc: Document | null) {
		if (doc) this._owner = doc;
		else delete this._owner;
	}
	get nodeValue(): string | null {
		return null;
	}
	set nodeValue(data: string | null) {}

	get textContent(): string | null {
		return null;
	}
	set textContent(data: string | null) {}

	isSameNode(node: Node) {
		return this === node;
	}
	abstract isEqualNode(node: Node): boolean;

	remove() {
		this._detach();
	}

	getRootNode(): Node {
		let root: Node = this;
		while (root.parentNode) root = root.parentNode;
		return root.nodeType === 9
			? (root as Document).documentElement || root
			: root;
	}
	contains(node?: ChildNode) {
		return false;
		// return this === node;
	}
	appendChild(node: Node) {
		throw new Error(`Not implemented`);
	}

	get firstChild(): ChildNode | null {
		return null;
	}
	get lastChild(): ChildNode | null {
		return null;
	}
	get previousSibling(): ChildNode | null {
		return null;
	}
	get nextSibling(): ChildNode | null {
		return null;
	}
	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node && node.nodeType == 1 ? (node as Element) : null;
	}

	get childNodes(): NodeList {
		return new Children(this as any as ChildNode);
	}
	hasChildNodes() {
		return false;
	}

	get baseURI() {
		const { ownerDocument } = this;
		return ownerDocument ? ownerDocument.documentURI : "";
		// return documentBaseURLSerialized(this._ownerDocument);
	}
	lookupNamespaceURI(prefix: string): string | null {
		const { parentElement: node } = this;
		return node ? node.lookupNamespaceURI(prefix) : null;
	}
	isDefaultNamespace(namespaceURI: string): boolean {
		const { parentElement: node } = this;
		return node ? node.isDefaultNamespace(namespaceURI) : !namespaceURI;
	}
	lookupPrefix(ns: string): string | null {
		const { parentElement: node } = this;
		return node ? node.lookupPrefix(ns) : null;
	}

	cloneNode(deep?: boolean): Node {
		throw new Error("Not implemented");
	}
	normalize() {
		let { startNode: next, endNode: end } = this;
		while (next && next !== end) {
			let node = next;
			next = next[NEXT] || end;
			if (node.nodeType === 3) {
				if ((node as Text).length > 0) {
					if (next.nodeType === 3) {
						if ((next as Text).length > 0) {
							(node as Text).data += (next as Text).data;
						}
						node = next;
						next = next[NEXT] || end;
						node.remove();
					}
				} else {
					node.remove();
				}
			}
		}
	}
	compareDocumentPosition(that: Node) {
		if (this === that) return 0;

		// Get arrays of ancestors for this and that
		let these = [],
			those = [],
			n;
		for (n = this; n; n = n.parentNode) these.push(n);
		for (n = that; n; n = n.parentNode) those.push(n);
		let aN = these.length;
		let bN = those.length;
		if (these[--aN] !== those[--bN]) {
			// No common ancestor
			return 1 + 32; // DISCONNECTED + IMPLEMENTATION_SPECIFIC
		}
		for (;;) {
			let a: Node | null = these[--aN];
			let b: Node | null = those[--bN];
			if (a && b) {
				if (a !== b) {
					for (;;) {
						if (a && b) {
							a = a.previousSibling;
							b = b.previousSibling;
						} else if (!a) {
							return 4; // FOLLOWING;
						} else {
							return 2; // PRECEDING; // !b
						}
					}
				}
			} else if (b) {
				return 4 + 16; // FOLLOWING + CONTAINED_BY
			} else {
				return 2 + 8; // PRECEDING + CONTAINS
			}
		}
	}
	/// DOM constants
	static get ELEMENT_NODE() {
		return 1;
	}
	get ELEMENT_NODE() {
		return 1;
	}
	static get ATTRIBUTE_NODE() {
		return 2;
	}
	get ATTRIBUTE_NODE() {
		return 2;
	}
	static get TEXT_NODE() {
		return 3;
	}
	get TEXT_NODE() {
		return 3;
	}
	static get CDATA_SECTION_NODE() {
		return 4;
	}
	get CDATA_SECTION_NODE() {
		return 4;
	}
	static get ENTITY_REFERENCE_NODE() {
		return 5;
	}
	get ENTITY_REFERENCE_NODE() {
		return 5;
	}
	static get ENTITY_NODE() {
		return 6;
	}
	get ENTITY_NODE() {
		return 6;
	}
	static get PROCESSING_INSTRUCTION_NODE() {
		return 7;
	}
	get PROCESSING_INSTRUCTION_NODE() {
		return 7;
	}
	static get COMMENT_NODE() {
		return 8;
	}
	get COMMENT_NODE() {
		return 8;
	}
	static get DOCUMENT_NODE() {
		return 9;
	}
	get DOCUMENT_NODE() {
		return 9;
	}
	static get DOCUMENT_TYPE_NODE() {
		return 10;
	}
	get DOCUMENT_TYPE_NODE() {
		return 10;
	}
	static get DOCUMENT_FRAGMENT_NODE() {
		return 11;
	}
	get DOCUMENT_FRAGMENT_NODE() {
		return 11;
	}
	static get NOTATION_NODE() {
		return 12;
	}
	get NOTATION_NODE() {
		return 12;
	}

	/// Internal // EventTarget
	*_enumAncestorTargets() {
		let node = this.parentNode;
		while (node) {
			yield node;
			node = node.parentNode;
		}
	}
}

// https://dom.spec.whatwg.org/#interface-nodelist
// export class NodeCollection<T> extends Array<T> {
// 	item(i: number): T | null {
// 		return i < this.length ? this[i] : null;
// 	}
// }
export abstract class NodeList {
	abstract get length(): number;
}

export class NodeList2 extends Array<ChildNode> {
	item(i: number): ChildNode | null {
		return i < this.length ? this[i] : null;
	}

	parent?: ChildNode;
	// constructor(parent: ChildNode) {
	// 	super();
	// 	this.parent = parent;
	// 	this.length;
	// }
	static create(parent: ChildNode): NodeList2 {
		const o = Object.create(NodeList2.prototype);
		o.parent = parent;
		o.length;
		return o;
	}
	// putChildren(parent: ParentNode) {
	// 	let i = 0;
	// 	let { firstChild: cur } = parent;
	// 	for (; cur; cur = cur.nextSibling) {
	// 		this[i++] = cur;
	// 	}
	// 	this.length = i;
	// 	return this;
	// }
	override get length(): number {
		const { parent } = this;
		let i = 0;
		if (parent) {
			let { firstChild: cur } = parent;
			for (; cur; cur = cur.nextSibling) {
				this[i++] = cur;
			}
			super.length = i;
			// this.splice(i);
		}
		console.error(`NodeList2.length ${i} ${parent && parent.nodeName}`);
		return i;
	}
	override set length(n: number) {}

	static empty = new (class extends NodeList2 {
		constructor() {
			super(0 as unknown as ChildNode);
		}
		get length() {
			return 0;
		}
	})();
}

export abstract class NodeCollection extends Array<ChildNode> {
	// [i: number]: ChildNode;
	constructor() {
		super();
		Object.setPrototypeOf(this, Array.prototype);
		const n = this.length;
	}
	item(index: number) {
		if (index >= 0) {
			for (const cur of this.list()) {
				if (index-- === 0) {
					return cur;
				}
			}
		}
		return null;
	}

	get length() {
		// console.log("LEN", Array.from(this.list()));
		let i = 0;
		for (const cur of this.list()) {
			super[i++] = cur;
		}
		return (super.length = i);
		// const n = i;
		// while (i in this) {
		// 	delete this[i++];
		// }
		// return n;
	}

	set length(x: number) {
		super.length = x;
	}

	abstract list(): IterableIterator<ChildNode>;
	static empty = new (class extends NodeCollection {
		*list() {}
	})();
}

export class Children extends NodeList {
	parent: ChildNode;
	constructor(parent: ChildNode) {
		super();
		this.parent = parent;
		this.length;
	}

	[i: number]: ChildNode;
	// [id: string]: Element;
	// constructor() {
	// 	const n = this.length;
	// }
	item(index: number) {
		if (index >= 0) {
			for (const cur of this) {
				if (index-- === 0) {
					return cur;
				}
			}
		}
		return null;
	}

	get length() {
		let i = 0;
		let id;
		for (const cur of this) {
			this[i++] = cur;
		}
		// this.splice(i);
		// return i;
		const n = i;
		while (i in this) {
			delete this[i++];
		}
		return n;
	}

	*[Symbol.iterator](): Iterator<ChildNode> {
		let { firstChild: cur } = this.parent;
		for (; cur; cur = cur.nextSibling) {
			yield cur;
		}
	}
	*keys() {
		let i = 0;
		for (const cur of this) {
			yield i++;
		}
	}
	*values() {
		let i = 0;
		for (const cur of this) {
			yield cur;
		}
	}
	*entries() {
		let i = 0;
		for (const cur of this) {
			yield [i++, cur];
		}
	}

	forEach(callback: any, thisArg: any) {
		let i = 0;
		for (const cur of this) {
			callback.call(thisArg, cur, i++, this);
		}
	}

	// static empty(){

	// }
}
// Node <- ChildNode <- ParentNode
// Node <- EndNode
// Node <- AttrNode

import { EventTarget } from "./event-target.js";
import { ChildNode } from "./child-node.js";
import { Text } from "./character-data.js";
import { EndNode, ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { Document } from "./document.js";

// Tag, Attr, Child, End
// <Tag><Child><End><Tag><End><Tag><Attr><End><Child><Tag><Attr><Child><End>

// <Tag><Child>
// <Tag><End>
// <Tag><Attr>
// <Tag><Tag>

// <Child><Tag>
// <Child><Attr> X
// <Child><End>
// <Child><Child>

// <Attr><Tag>
// <Attr><Attr>
// <Attr><End>
// <Attr><Child>

// <End><Tag>
// <End><Attr> X
// <End><End>
// <End><Child>
