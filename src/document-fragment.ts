import { NonElementParentNode } from "./non-element-parent-node.js";

export class DocumentFragment extends NonElementParentNode {
	// https://dom.spec.whatwg.org/#documentfragment
	get nodeType() {
		return 11;
	}
	get nodeName() {
		return "#document-fragment";
	}

	_attach(prev: Node, next: Node, parent: ParentNode) {
		const { firstChild: first, lastChild: last } = this;
		if (first && last) {
			// knownSegment(ref[PREV], first, last, ref);
			// knownAdjacent(this, this[END]);
			// for (let cur: ChildNode | null | false = first; cur; ) {
			// 	// children already connected side by side
			// 	cur.parentNode = parent;
			// 	// moCallback(first, null);
			// 	// if (first.nodeType === ELEMENT_NODE)
			// 	// 	connectedCallback(first);
			// 	cur = cur !== last && cur.nextSibling;
			// }
			if (parent) {
				let cur: ChildNode | null = first;
				do {
					cur.parentNode = parent;
				} while (cur !== last && (cur = cur.nextSibling || last));
			}

			this._linkr(this[END]); // close
			prev._linkr(first);
			if (parent) {
				let cur: ChildNode | null = first;
				do {
					this._on_child_detached(cur);
				} while (cur !== last && (cur = cur.nextSibling || last));
			}
			last.endNode._linkr(next);
		}
		// return next;
	}

	cloneNode(deep?: boolean): Node {
		if (deep) {
			throw new Error(`Not implemented`);
		} else {
			const { ownerDocument } = this;
			if (ownerDocument) {
				return ownerDocument.createDocumentFragment();
			}
			return new DocumentFragment();
		}
	}

	static fromTemplate(self: ParentNode) {
		return new TemplateFragment(self);
	}
}

class TemplateFragment extends DocumentFragment {
	self: ParentNode;
	constructor(self: ParentNode) {
		super();
		this[END] = self[END];
		this[NEXT] = self[NEXT];
		this.self = self;
	}
	get firstChild() {
		return this.self.firstChild;
	}
	get lastChild() {
		return this.self.lastChild;
	}
	_attach(prev: Node, next: Node, parent: ParentNode) {
		const { self } = this;
		const { firstChild: first, lastChild: last } = self;
		if (first && last) {
			if (parent) {
				let cur: ChildNode | null = first;
				do {
					cur.parentNode = parent;
				} while (cur !== last && (cur = cur.nextSibling));
			}
			self._linkr(self[END]); // close
			prev._linkr(first);
			return last.endNode._linkr(next);
		}
		return next;
	}
}

import { ChildNode } from "./child-node.js";
import { EndNode, ParentNode } from "./parent-node.js";
import { Node, PREV, NEXT, END } from "./node.js";
