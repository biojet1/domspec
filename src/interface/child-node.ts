import { Node } from "./node.js";

export class ChildNode extends Node {
	//// Tree
	get followingSibling(): Node | null {
		const next = this[NEXT];
		return !next || next instanceof EndNode ? null : next;
		// const { [NEXT]: next } = this;
		// return next ? next.endNode() : null;
	}

	get precedingSibling(): Node | null {
		const { [PREV]: prev } = this;
		return prev ? prev.startNode() : null;
		// [Child][Child] = prev
		// [Attr][Child]  = null
		// [Tag][Child]  = null
		// [End][Child]  = End[START]
		  if (prev instanceof ChildNode) {
		  	// ParentNode | ChildNode only
		  }else{
		  	// EndNode | Attr

		  }
		// if (prev) {
		//  if (prev instanceof EndNode) {
		//      if (!(this instanceof ChildNode)) {
		//          throw new Error(`Unexpected previous Node ${prev}`);
		//      }
		//      return prev[START];
		//  } else if (prev instanceof ChildNode) {
		//      if (this instanceof Attr) {
		//          throw new Error(`Unexpected previous Node ${prev}`);
		//      }
		//      return prev;
		//  }
		// }
		// return null;
	}

	//// Dom
	get nextSibling(): ChildNode | null {
		const { precedingSibling: node } = this;
		return node instanceof ChildNode ? node : null;
	}
	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node instanceof Element ? node : null;
	}
}

import { Element } from "./element.js";
