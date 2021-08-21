export class XMLSerializer {
	serializeToString(node: Node): string {
		// return Array.from(enumDOMStr(node)).join("");
		const { endNode, startNode } = node;
		return Array.from(enumXMLDump(startNode, endNode)).join("");
	}
}

// export function* enumDOMStr(node: Node) {
// 	let isOpened = false;
// 	const { endNode: end } = node;
// 	let cur: Node | null | undefined = node;
// 	do {
// 		if (cur instanceof Attr) {
// 			const xml = cur.formatXML();
// 			if (xml.length > 0) yield ` ${xml}`;
// 		} else if (cur instanceof Element) {
// 			if (isOpened) {
// 				yield `><${cur.tagName}`;
// 			} else {
// 				yield `<${cur.tagName}`;
// 			}
// 			isOpened = true;
// 		} else if (cur instanceof EndNode) {
// 			const { [PREV]: prev, parentNode: start } = cur;
// 			if (prev === start || prev instanceof Attr) {
// 				if (start instanceof Element) {
// 					if (start._parsed_closed) {
// 						yield `/>`;
// 					} else {
// 						yield `></${start.tagName}>`;
// 					}
// 				}
// 			} else if (start instanceof NonElementParentNode) {
// 				// pass;
// 			} else if (!(start instanceof Element)) {
// 				throw new Error(`Unexpected parent node`);
// 			} else if (isOpened) {
// 				yield `></${start.tagName}>`;
// 			} else {
// 				yield `</${start.tagName}>`;
// 			}
// 			isOpened = false;
// 		} else if (cur instanceof ParentNode) {
// 			if (cur instanceof NonElementParentNode) {
// 				// pass
// 			} else {
// 				throw new Error(`Unexpected ParentNode`);
// 			}
// 		} else if (cur instanceof ChildNode) {
// 			if (isOpened) {
// 				yield ">";
// 				isOpened = false;
// 			}
// 			yield cur.toString();
// 		} else {
// 			throw new Error(`Invalid node ${cur}`);
// 		}
// 	} while (cur !== end && (cur = cur[NEXT]));
// }

export function* enumXMLDump(start: Node, end: Node) {
	let isOpened = false;
	let cur: Node | undefined = start;
	const { ownerDocument } = start;
	let voidElements =
		ownerDocument &&
		ownerDocument.isHTML &&
		/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

	do {
		switch (cur.nodeType) {
			case 2: // ATTRIBUTE_NODE
				{
					const s = cur.formatXML();
					if (s !== "") yield ` ${cur.formatXML()}`;
				}
				break;
			case 3: // TEXT_NODE
			case 4: // CDATA_SECTION_NODE
			case 7: // PROCESSING_INSTRUCTION_NODE
			case 8: // COMMENT_NODE
				if (isOpened) {
					yield ">";
					isOpened = false;
				}
				yield cur.formatXML();
				break;

			case -1: // End Tag
				const { [PREV]: prev, parentNode: start } = cur as EndNode;
				if (start.nodeType === 1) {
					if (prev === start || prev instanceof Attr) {
						if (
							!voidElements ||
							voidElements.test((start as Element).localName)
						) {
							yield `/>`;
						} else {
							yield `></${(start as Element).qualifiedName}>`;
						}
					} else if (isOpened) {
						yield `></${(start as Element).qualifiedName}>`;
					} else {
						yield `</${(start as Element).qualifiedName}>`;
					}
					isOpened = false;
				}
				break;

			case 11: // DOCUMENT_FRAGMENT_NODE
			case 1: // ELEMENT_NODE
				if (isOpened) {
					yield `><${(cur as Element).qualifiedName}`;
				} else {
					yield `<${(cur as Element).qualifiedName}`;
				}
				isOpened = true;
				break;

			case 10: // DOCUMENT_TYPE_NODE
				yield cur.formatXML();
			 	break;
			case 9: // DOCUMENT_NODE
				break;
			// ENTITY_REFERENCE_NODE 	5
			// ENTITY_NODE 	6
			// NOTATION_NODE 	12
			default:
				throw new Error(`Unexpected nodeType ${cur.nodeType}`);
		}
	} while (cur !== end && (cur = cur[NEXT]));
}

export function* enumFlatDOM(node: Node) {
	const { endNode: end } = node;
	let cur: Node | null | undefined = node;
	do {
		if (cur instanceof Attr) {
			const { nodeType, name, value } = cur;
			yield nodeType;
			yield name;
			yield value;
		} else if (cur instanceof ParentNode) {
			const { nodeType, nodeName } = cur;
			yield nodeType;
			yield nodeName;
		} else if (cur instanceof EndNode) {
			yield -1;
		} else if (cur instanceof ChildNode) {
			const { nodeType, nodeValue } = cur;
			yield nodeType;
			yield nodeValue;
		} else {
			throw new Error(`Invalid node ${cur}`);
		}
	} while (cur !== end && (cur = cur[NEXT]));
}

import { NEXT, PREV, END, Node } from "./node.js";
import { ChildNode } from "./child-node.js";
import { ParentNode, EndNode } from "./parent-node.js";
// import { NonElementParentNode } from "./non-element-parent-node.js";
import { Element } from "./element.js";
import { Attr } from "./attr.js";
// import { Document } from "./document.js";
