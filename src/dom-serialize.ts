export class XMLSerializer {
	serializeToString(node: Node): string {
		return Array.from(enumDOMStr(node)).join("");
	}
}

export function* enumDOMStr(node: Node) {
	let isOpened = false;
	const { endNode: end } = node;
	let cur: Node | null | undefined = node;
	do {
		if (cur instanceof Attr) {
			yield ` ${cur.toString()}`;
		} else if (cur instanceof Element) {
			if (isOpened) {
				yield `><${cur.tagName}`;
			} else {
				yield `<${cur.tagName}`;
			}
			isOpened = true;
		} else if (cur instanceof EndNode) {
			const { [PREV]: prev, [START]: start } = cur;
			if (prev === start || prev instanceof Attr) {
				if (start instanceof Element) {
					if (start._parsed_closed) {
						yield `/>`;
					} else {
						yield `></${start.tagName}>`;
					}
				}
			} else if (start instanceof NonElementParentNode) {
				// pass;
			} else if (!(start instanceof Element)) {
				throw new Error(`Unexpected parent node`);
			} else if (isOpened) {
				yield `></${start.tagName}>`;
			} else {
				yield `</${start.tagName}>`;
			}
			isOpened = false;
		} else if (cur instanceof ParentNode) {
			if (cur instanceof NonElementParentNode) {
				// pass
			} else {
				throw new Error(`Unexpected ParentNode`);
			}
		} else if (cur instanceof ChildNode) {
			if (isOpened) {
				yield ">";
				isOpened = false;
			}
			yield cur.toString();
		} else {
			throw new Error(`Invalid node ${cur}`);
		}
	} while (cur !== end && (cur = cur[NEXT]));
}

import { NEXT, PREV, START, END, Node } from "./node.js";
import { ChildNode } from "./child-node.js";
import { ParentNode, EndNode } from "./parent-node.js";
import { Element } from "./element.js";
import { Document } from "./document.js";
import { NonElementParentNode } from "./non-element-parent-node.js";
import { Attr } from "./attr.js";
