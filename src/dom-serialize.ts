export class XMLSerializer {
	serializeToString(node: Node): string {
		// return Array.from(enumDOMStr(node)).join("");
		const { endNode, startNode } = node;
		switch (node.nodeType) {
			default: {
				return Array.from(enumXMLDump(startNode, endNode)).join("");
			}
			case 9: {
				// DOCUMENT_NODE
				return Array.from(
					enumXMLDump(
						startNode[NEXT] || startNode,
						endNode[PREV] || endNode
					)
				).join("");
			}
		}
	}
}

export function* enumXMLDump(start: Node, end: Node) {
	let isOpened = false;
	let cur: Node | undefined = start;
	const { ownerDocument } = start;
	let voidElements =
		ownerDocument &&
		ownerDocument.isHTML &&
		/^(?:\w+:)?(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

	do {
		switch (cur.nodeType) {
			case 2: // ATTRIBUTE_NODE
				{
					const v = cur.valueOf();
					if (v !== null) {
						const { name } = cur as Attr;
						if (name)
							yield ` ${name}="${(v as string).replace(
								/[<>&"\xA0\t\n\r]/g,
								rep
							)}"`;
					}
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
				yield cur.toString();
				break;

			case -1: // End Tag
				const { [PREV]: prev, parentNode: start } = cur as EndNode;
				switch (start.nodeType) {
					default:
						throw new Error(
							`Unexpected nodeType ${start.nodeType}`
						);
					case 11: // DOCUMENT_FRAGMENT_NODE
					case 1: // ELEMENT_NODE
					case 9: {
						// DOCUMENT_NODE
						if (prev === start || prev instanceof Attr) {
							if (
								!voidElements ||
								voidElements.test(
									(start as ParentNode).qualifiedName
								)
							) {
								yield `/>`;
							} else {
								yield `></${
									(start as ParentNode).qualifiedName
								}>`;
							}
						} else if (isOpened) {
							yield `></${(start as ParentNode).qualifiedName}>`;
						} else {
							yield `</${(start as ParentNode).qualifiedName}>`;
						}
						isOpened = false;
					}
				}
				break;

			case 11: // DOCUMENT_FRAGMENT_NODE
			case 1: // ELEMENT_NODE
			case 9: // DOCUMENT_NODE
				if (isOpened) {
					yield `><${(cur as ParentNode).qualifiedName}`;
				} else {
					yield `<${(cur as ParentNode).qualifiedName}`;
				}
				isOpened = true;
				break;

			case 10: // DOCUMENT_TYPE_NODE
				if (isOpened) {
					yield ">";
					isOpened = false;
				}
				yield cur.toString();
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

const rep = function (m: string) {
	switch (m) {
		// '   &apos;
		// case "\xA0":
		// 	return "&nbsp;";
		case "&":
			return "&amp;";
		case "<":
			return "&lt;";
		case ">":
			return "&gt;";
		case '"':
			return "&quot;";


		// case "\t":
		// 	return "&#x9;";
		// case "\n":
		// 	return "&#x9;";
		// case '\r':
		// 	return "&#x9;";
	}
	return `&#${m.charCodeAt(0)};`;

		// return m;
};

import { NEXT, PREV, END, Node } from "./node.js";
import { ChildNode } from "./child-node.js";
import { ParentNode, EndNode } from "./parent-node.js";
// import { NonElementParentNode } from "./non-element-parent-node.js";
import { Element } from "./element.js";
import { Attr } from "./attr.js";
// import { Document } from "./document.js";
