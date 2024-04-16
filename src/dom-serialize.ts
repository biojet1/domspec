export class XMLSerializer {
	serializeToString(node: Node): string {
		const { endNode, startNode, nodeType } = node;
		switch (nodeType) {
			default:
				return Array.from(enumXMLDump(startNode, endNode)).join("");
			case 9: // DOCUMENT_NODE
				return Array.from(
					enumXMLDump(startNode[NEXT] || startNode, endNode[PREV] || endNode)
				).join("");
		}
	}
}
function _lookupNamespaceURI(
	cur: Element,
	prefix: string,
	map: WeakMap<Element, any>
): string | null {
	const { namespaceURI, prefix: this_prefix } = cur;

	if (namespaceURI && this_prefix ? this_prefix === prefix : !prefix)
		return namespaceURI || null;

	const am = map.get(cur);
	if (am) {
		const ns = am[prefix];
		if (ns) return ns;
	}

	let attr = cur[NEXT];
	for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
		if (attr.namespaceURI === XMLNS) {
			const { prefix: prefixA, localName: localNameA } = attr;
			if (
				(prefixA === "xmlns" && localNameA === prefix) ||
				(!prefix && !prefixA && localNameA === "xmlns")
			) {
				return attr.value || null;
			}
		}
	}
	const { parentElement: parent } = cur;

	return parent ? _lookupNamespaceURI(parent, prefix, map) : null;
}
export function* enumXMLDump(start: Node, end: Node) {
	let isOpened = false;
	let cur: Node | undefined = start;
	const { ownerDocument = undefined } = start;
	let voidElements =
		ownerDocument &&
		ownerDocument.isHTML &&
		/^(?:\w+:)?(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
	let em = new WeakMap<Element, any>();

	do {
		const { nodeType } = cur;

		switch (nodeType) {
			case 2: // ATTRIBUTE_NODE
				{
					const v = cur.valueOf();
					if (v != null) {
						// same !(v === undefined || v === null)
						const { name } = cur as Attr;
						if (name) {
							if (name.indexOf(":") > 0) {
								const { namespaceURI, parentElement } = cur as Attr;
								const [prefix, local] = name.split(":");
								if (namespaceURI && parentElement && prefix != "xmlns") {
									const ns = _lookupNamespaceURI(parentElement, prefix, em);
									if (!ns) {
										let am = em.get(parentElement);
										if (!am) {
											em.set(parentElement, (am = {}));
										}
										am[prefix] = namespaceURI;
										yield ` xmlns:${prefix}="${namespaceURI}"`;
									}
								}
							}
							yield ` ${name}="${(v as string).replace(
								/[<>&"\xA0\t\n\r]/g,
								rep
							)}"`;
						}
					}
				}
				break;
			case 3: // TEXT_NODE
			case 4: // CDATA_SECTION_NODE
			case 7: // PROCESSING_INSTRUCTION_NODE
			case 8: // COMMENT_NODE
			case 10: // DOCUMENT_TYPE_NODE
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
						throw new Error(`Unexpected nodeType ${start.nodeType}`);
					case 1: // ELEMENT_NODE
					case 11: // DOCUMENT_FRAGMENT_NODE
					case 9: {
						// DOCUMENT_NODE
						if (prev === start || prev instanceof Attr) {
							if (
								!voidElements ||
								voidElements.test((start as ParentNode).qualifiedName)
							) {
								yield `/>`;
							} else {
								yield `></${(start as ParentNode).qualifiedName}>`;
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

			case 1: // ELEMENT_NODE
			case 9: // DOCUMENT_NODE
			case 11: // DOCUMENT_FRAGMENT_NODE
				if (isOpened) {
					yield `><${(cur as ParentNode).qualifiedName}`;
				} else {
					yield `<${(cur as ParentNode).qualifiedName}`;
				}
				isOpened = true;
				if (nodeType === 1) {
					// ELEMENT_NODE
					const { _prefix } = cur as Element;
					if (_prefix && _prefix != "xmlns") {
						const { namespaceURI } = cur as Element;
						if (
							namespaceURI &&
							!_lookupNamespaceURI(cur as Element, _prefix, em)
						) {
							let am = em.get(cur as Element);
							am || em.set(cur as Element, (am = {}));
							am[_prefix] = namespaceURI;
							yield ` xmlns:${_prefix}="${namespaceURI}"`;
						}
					}
				}
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
	}
	return `&#${m.charCodeAt(0)};`;
};

import { NEXT, PREV, END, Node } from "./node.js";
import { ChildNode } from "./child-node.js";
import { ParentNode, EndNode } from "./parent-node.js";
import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { XMLNS } from "./namespace.js";
// import { Document } from "./document.js";
