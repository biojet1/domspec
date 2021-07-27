// import { IParent, INode, PREV, NEXT, END } from "../tree.js";

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
		// const end = this.endNode;
		// end[NEXT] = node;
		// node[PREV] = end;
		this.endNode.linkRight(node);
		// this[NEXT] = node;
		// node[PREV] = this;
		// if (
		// 	node.parentNode !== this.parentNode &&
		// 	node.parentNode &&
		// 	this.parentNode
		// ) {
		// 	throw new Error(`Unexpected parents`);
		// }
		return this;
	}
	linkRight(node: Node) {
		// [THIS]<->node
		this[NEXT] = node;
		node[PREV] = this;
		// if (
		// 	node.parentNode !== this.parentNode &&
		// 	node.parentNode &&
		// 	this.parentNode
		// ) {
		// 	console.dir(node.parentNode, { depth: 1 });
		// 	console.dir(this.parentNode, { depth: 1 });
		// 	throw new Error(`Unexpected parents`);
		// }
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
		// const start = this.startNode;
		// start[PREV] = node;
		// node[NEXT] = start;
		this.startNode.linkLeft(node);
		// if (
		// 	node.parentNode !== this.parentNode &&
		// 	node.parentNode &&
		// 	this.parentNode
		// ) {
		// 				console.dir([node, this], { depth: 1 });

		// 	throw new Error(`Unexpected parents`);
		// }

		return this;
	}
	linkLeft(node: Node) {
		// node<->[THIS]
		this[PREV] = node;
		node[NEXT] = this;
		// if (
		// 	node.parentNode !== this.parentNode &&
		// 	node.parentNode &&
		// 	this.parentNode
		// ) {
		// 	throw new Error(`Unexpected parents`);
		// }
		// return this;
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

// class Child extends Node {
// 	get followingSibling(): Node | null {
// 		const next = this[NEXT];
// 		// [Child][Child] = next
// 		// [Child][Attr]  = error
// 		// [Child][Tag]  = next
// 		// [Child][End]  = null
// 		if (!next || next instanceof End) {
// 			return null;
// 		} else if (next instanceof Attr) {
// 			throw new Error(`Unexpected next Node ${next}`);
// 		}
// 		return next;
// 	}
// 	get precedingSibling(): Node | null {
// 		const { [PREV]: prev } = this;
// 		// [Child][Child] = prev
// 		// [Attr][Child]  = null
// 		// [Tag][Child]  = null
// 		// [End][Child]  = End[START]
// 		if (!prev || prev instanceof Parent) {
// 			return null;
// 		} else if (prev instanceof Child) {
// 			return prev;
// 		} else if (prev instanceof End) {
// 			return prev[START];
// 		} else {
// 			return null;
// 		}
// 	}
// }
// class End extends Node {}
// class Aux extends Node {}
// class Parent extends Child {
// 	get followingSibling(): Node | null {
// 		const next = this[END][NEXT];
// 		if (!next || next instanceof End) {
// 			// <div>Test <p></p>*</div>
// 			return null;
// 		} else if (next instanceof Child) {
// 			// <p>...<p>*Text
// 			// <p>...<p>*<div></div>
// 			return next;
// 		} else {
// 			throw new Error(`Unexpected next Node ${next}`);
// 		}
// 	}
// 	get precedingSibling(): Node | null {
// 		const { [PREV]: prev } = this;
// 		// [Child][Parent] = prev
// 		// [Attr][Parent]  = null
// 		// [Parent][Parent]  = null
// 		// [End][Parent]  = End[START]
// 		if (!prev || prev instanceof Parent || prev instanceof Attr) {
// 			// <div>*<p></p>...</div>
// 			// <div attr="value">*<p></p>...</div>
// 			return null;
// 		} else if (prev instanceof Child) {
// 			// Text*<p></p>...
// 			return prev;
// 		} else if (prev instanceof End) {
// 			// <div></div>*<p></p>...
// 			return prev[START];
// 		} else {
// 			throw new Error(`Unexpected next Node ${prev}`);
// 		}
// 	}
// }
// Node <- Child <- Parent
// Node <- End
// Node <- Aux

export const setAdjacent = (prev: Node, next: Node) => {
	if (prev) prev[NEXT] = next;
	if (next) next[PREV] = prev;
};
// export const getEnd = node => node.nodeType === ELEMENT_NODE ? node[END] : node;

// export const remove = (prev?: Node, current: Node, next: Node) => {
// 	const { parentNode, nodeType } = current;
// 	if (prev || next) {
// 		prev && next && setAdjacent(prev, next);
// 		delete current[PREV];
// 		delete current.endNode[NEXT];
// 	}
// 	if (parentNode) {
// 		delete current.parentNode;
// 		// moCallback(current, parentNode);
// 		// if (nodeType === ELEMENT_NODE) disconnectedCallback(current);
// 	}
// };
// export const knownAdjacent = (prev: Node, next: Node) => {
// 	prev[NEXT] = next; // prev->next
// 	next[PREV] = prev; // prev<-next
// };

// Put current between prev and next
// export const knownBoundaries = (prev?: Node, current: Node, next: Node) => {
// 	// prev<-->current/END<-->next
// 	prev && knownAdjacent(prev, current);
// 	knownAdjacent(current.endNode, next);
// };

// export const knownSegment = (
// 	prev?: Node,
// 	start: Node,
// 	end: Node,
// 	next: Node
// ) => {
// 	prev && knownAdjacent(prev, start); // prev<-->start
// 	knownAdjacent(end.endNode, next); // end<-->next
// };

// export const knownSiblings = (prev?: Node, current?: Node, next?: Node) => {
// 	prev && knownAdjacent(prev, current);
// 	next && knownAdjacent(current, next);
// };
// export const putBetween = (current: Node, prev?: Node, next?: Node) => {
// 	prev && knownAdjacent(prev, current);
// 	next && knownAdjacent(current, next);
// };

// import { ChildNode } from "./child-node.js";
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
