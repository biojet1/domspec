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
	_attach(prev: Node, next: Node, parent: ParentNode) {
		this.parentNode = parent;
		prev._linkr(this.startNode);
		return this.endNode._linkr(next);
	}
	_linkr(node: Node) {
		// [THIS]<->node
		if (node === this) {
			throw new Error(`Same node`);
		}
		this[NEXT] = node;
		node[PREV] = this;
		return this;
	}
	_detach(newOwner?: Document) {
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
	ownerDocument?: Document;
	parentNode?: ParentNode | null;
	abstract get nodeType(): number;
	abstract get nodeName(): string;
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

	// isEqualNode(node) {
	// 	if (this === node) return true;
	// 	if (this.nodeType === node.nodeType) {
	// 		switch (this.nodeType) {
	// 			case DOCUMENT_NODE:
	// 			case DOCUMENT_FRAGMENT_NODE: {
	// 				const aNodes = this.childNodes;
	// 				const bNodes = node.childNodes;
	// 				return (
	// 					aNodes.length === bNodes.length &&
	// 					aNodes.every((node, i) => node.isEqualNode(bNodes[i]))
	// 				);
	// 			}
	// 			case 1:
	// 				return this.toString() === node.toString();
	// 		}
	// 	}
	// 	return false;
	// }
	lookupNamespaceURI(prefix: string | null): string | null {
		return null;
	}
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

	abstract cloneNode(deep?: boolean): Node;
	/// DOM constants
	static ELEMENT_NODE = 1;
	static ATTRIBUTE_NODE = 2;
	static TEXT_NODE = 3;
	static CDATA_SECTION_NODE = 4;
	static ENTITY_REFERENCE_NODE = 5;
	static ENTITY_NODE = 6;
	static PROCESSING_INSTRUCTION_NODE = 7;
	static COMMENT_NODE = 8;
	static DOCUMENT_NODE = 9;
	static DOCUMENT_TYPE_NODE = 10;
	static DOCUMENT_FRAGMENT_NODE = 11;
	static NOTATION_NODE = 12;
}

// Node <- ChildNode <- ParentNode
// Node <- EndNode
// Node <- AttrNode

// export const setAdjacent = (prev: Node, next: Node) => {
// 	if (prev) prev[NEXT] = next;
// 	if (next) next[PREV] = prev;
// };

import { EventTarget } from "./event-target.js";
import { ChildNode } from "./child-node.js";
import { EndNode, ParentNode } from "./parent-node.js";
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
