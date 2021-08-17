import { NonElementParentNode } from "./non-element-parent-node.js";

export class DocumentFragment extends NonElementParentNode {
	// https://dom.spec.whatwg.org/#documentfragment
	get nodeType() {
		return 11;
	}
	get nodeName() {
		return "#document-fragment";
	}

	_link(prev: Node, next: Node, parent: ParentNode) {
		const { firstChild: first, lastChild: last } = this;
		if (first && last) {
			// knownSegment(ref[PREV], first, last, ref);
			// knownAdjacent(this, this[END]);
			for (let cur: ChildNode | null | false = first; cur; ) {
				// children already connected side by side
				cur.parentNode = parent;
				// moCallback(first, null);
				// if (first.nodeType === ELEMENT_NODE)
				// 	connectedCallback(first);
				cur = cur !== last && cur.nextSibling;
			}
			this.linkRight(this[END]); // close
			prev.linkRight(first);
			return last.endNode.linkRight(next);
		}
		return next;
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
}
import { ChildNode } from "./child-node.js";
import { EndNode, ParentNode } from "./parent-node.js";
import { Node, PREV, NEXT, END } from "./node.js";
