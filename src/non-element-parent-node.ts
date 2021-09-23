import { Node, NEXT, END } from "./node.js";
import { ParentNode } from "./parent-node.js";

export abstract class NonElementParentNode extends ParentNode {
	getElementById(id: string) {
		id || (id = "" + id);
		// let { [NEXT]: next, [END]: end } = this;
		let { [END]: end } = this;
		let cur: Node|undefined = this;
		while ((cur = cur[NEXT]) && cur !== end) {
			// for (; next && next !== end; next = next[NEXT]) {
			if (cur.nodeType === 1) {
				if ((cur as Element).getAttribute("id") === id) {
					if (id.length > 0) {
						return cur;
					}
					break;
				}
			}
		}
		return null;
	}
}

import { Element } from "./element.js";
