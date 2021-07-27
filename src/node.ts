export const NEXT = Symbol("next");
export const PREV = Symbol("prev");
export const START = Symbol("start");
export const END = Symbol("end");

export class Node {
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
	linkNext(node: Node) {
		return this.endNode.linkRight(node);
	}
	linkRight(node: Node) {
		// [THIS]<->node
		this[NEXT] = node;
		node[PREV] = this;
		return this;
	}
	insertRight(node: Node) {
		// [THIS]<node>[NEXT]
		const next = this[NEXT];
		node.linkLeft(this);
		next && node.linkRight(next);
		if (
			node.parentNode !== this.parentNode &&
			node.parentNode &&
			this.parentNode
		) {
			console.dir(node.parentNode, { depth: 1 });
			console.dir(this.parentNode, { depth: 1 });
			throw new Error(`Unexpected parents`);
		}
		return this;
	}

	linkPrior(node: Node) {
		// <node>[THIS]
		return this.startNode.linkLeft(node);
	}
	linkLeft(node: Node) {
		// node<->[THIS]
		this[PREV] = node;
		node[NEXT] = this;
	}
	insertLeft(node: Node) {
		// [PREV]<node>[THIS]
		const prev = this[PREV];
		prev && node.linkLeft(prev); // prev<->node
		node.linkRight(this); // node<->this
		if (
			node.parentNode !== this.parentNode &&
			node.parentNode &&
			this.parentNode
		) {
			throw new Error(`Unexpected parents`);
		}
		return this;
	}

	remove() {
		const {
			[PREV]: prev,
			endNode: { [NEXT]: next },
			parentNode,
			nodeType,
		} = this;
		// remove(prev, this, next);
		// [PREV]<->[THIS]<->[NEXT] => [PREV]<->[NEXT]

		prev && next && prev.linkRight(next);

		this[PREV] = undefined;
		this.endNode[NEXT] = undefined;

		if (parentNode) {
			this.parentNode = undefined;
			// moCallback(this, parentNode);
			// if (nodeType === ELEMENT_NODE) disconnectedCallback(this);
		}
	}

	//// DOM
	ownerDocument?: Document;
	parentNode?: ParentNode;
	get nodeType() {
		return 0;
	}
	get nodeValue(): string | null {
		return null;
	}
	get nodeName(): string | null {
		return null;
	}
	lookupNamespaceURI(prefix: string | null): string | null {
		return null;
	}
	assertParent(node: ParentNode) {
		const { parentNode } = this;
		if (!parentNode) {
			this.parentNode = node;
		} else if (parentNode !== node) {
			throw new Error(`Invalid parent`);
		}
		return this;
	}
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

export const setAdjacent = (prev: Node, next: Node) => {
	if (prev) prev[NEXT] = next;
	if (next) next[PREV] = prev;
};

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
