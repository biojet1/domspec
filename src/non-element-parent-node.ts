import { NEXT, END } from "./node.js";
import { ParentNode } from "./parent-node.js";

export abstract class NonElementParentNode extends ParentNode {
	getElementById(id: string) {
		if (!id) {
			id = "" + id;
		}
		let { [NEXT]: next, [END]: end } = this;
		for (; next && next !== end; next = next[NEXT]) {
			if (next.nodeType === 1) {
				if ((next as Element).getAttribute("id") === id) {
					if (id.length > 0) {
						return next;
					}
					break;
				}
			}
		}
		return null;
	}
}

import { Element } from "./element.js";
