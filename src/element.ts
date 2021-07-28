import { NEXT, PREV, START, END, Node } from "./node.js";
import { ParentNode, EndNode } from "./parent-node.js";

export class Element extends ParentNode {
	//// Parse
	_parsed_closed?: boolean;
	//// Tree
	//// DOM
	localName: string;
	tagName: string;
	namespaceURI?: string;
	prefix?: string;
	constructor() {
		super();
		this.localName = this.tagName = "";
	}
	get nodeType() {
		return 1; // ELEMENT_NODE (1)
	}
	get nodeName() {
		return this.tagName;
	}
	get id() {
		return this.getAttribute("id");
	}

	getAttribute(name: string) {
		const node = this.getAttributeNode(name);
		return node ? node.value : null;
	}

	getAttributeNode(name: string) {
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (!attr.namespaceURI && attr.name === name) return attr;
		}
		return null;
	}

	getAttributeNodeNS(ns: string|null, localName: string) {
		if (ns && ns != "") {
			let attr = this[NEXT];
			for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
				if (attr.namespaceURI === ns) {
					if (attr.localName === localName) {
						return attr;
					}
				}
			}
		} else {
			return this.getAttributeNode(localName);
		}
		return null;
	}
	setAttribute(qname: string, value: string) {
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			const { namespaceURI, name } = attr;
			if (!namespaceURI && qname === name) {
				attr.value = value;
				return;
			}
		}
		if (!attr || !(attr instanceof Attr)) {
			attr = this;
		}
		const node = new Attr();
		node.name = qname;
		node.localName = qname;
		node.value = value;
		node.parentNode = this;
		attr.insertRight(node);
	}
	setAttributeNS(ns: string | null, qname: string, value: string) {
		let prefix, lname;
		if (ns === "" || !ns) {
			return this.setAttribute(qname, value);
		} else if (qname.length <= 0) {
			throw new Error("Empty attribute name");
		} else {
			const pos = qname.indexOf(":");
			if (pos < 0) {
				prefix = null;
				lname = qname;
			} else {
				prefix = qname.substring(0, pos);
				lname = qname.substring(pos + 1);
			}
			if (prefix === "" || !prefix) prefix = null;
		}

		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			const { namespaceURI, localName } = attr;
			if (namespaceURI === ns && localName === qname) {
				attr.value = value;
				return;
			}
		}
		if (!attr || !(attr instanceof Attr)) {
			attr = this;
		}
		const node = new Attr();
		node.name = qname;
		node.localName = lname;
		node.value = value;
		node.parentNode = this;
		node.namespaceURI = ns;
		if (prefix) node.prefix = prefix;
		attr.insertRight(node);
	}
	setAttributeNode(node: Attr) {
		return this.setAttributeNodeNS(node);
	}
	setAttributeNodeNS(node: Attr) {
		const prev = this.getAttributeNodeNS(
			node.namespaceURI || null,
			node.localName
		);
		if (node === prev) {
			return node;
		} else if (prev) {
			prev.insertLeft(node).remove();
		} else {
			let attr = this[NEXT];
			for (; attr && attr instanceof Attr; attr = attr[NEXT]);
			if (attr) {
				node.unlink().parentNode = this;
				attr.insertLeft(node);
			}
		}
		return prev;
	}
	removeAttribute(qName: string) {
		const node = this.getAttributeNode(qName);
		node && node.unlink();
	}
	removeAttributeNS(ns: string, localName: string) {
		const node = this.getAttributeNodeNS(ns, localName);
		node && node.unlink();
	}
	hasAttribute(qName: string) {
		const node = this.getAttributeNode(qName);
		return !!node;
	}
	hasAttributeNS(ns: string, localName: string) {
		const node = this.getAttributeNodeNS(ns, localName);
		return !!node;
	}
	toString() {
		return Array.from(enumDOMStr(this)).join("");
	}

	lookupNamespaceURI(prefix: string | null): string | null {
		if (prefix === "" || !prefix) prefix = null;
		const { namespaceURI } = this;

		if (namespaceURI && this.prefix === prefix) return namespaceURI;

		let attr = this[NEXT];
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
		const { parentElement: parent } = this;

		return parent ? parent.lookupNamespaceURI(prefix) : null;
	}
}

export function* enumFlatDOM(node: Node) {
	const { endNode: end } = node;
	let cur = new Node();
	cur[NEXT] = node;
	do {
		cur = cur[NEXT] || end;
		if (cur instanceof Attr) {
			const { nodeType, name, value } = cur;
			yield nodeType;
			yield name;
			yield value;
		} else if (cur instanceof Element) {
			const { nodeType, tagName } = cur;
			yield nodeType;
			yield tagName;
		} else if (cur instanceof EndNode) {
			yield -1;
		} else if (cur instanceof ChildNode) {
			const { nodeType, nodeValue } = cur;
			yield nodeType;
			yield nodeValue;
		} else {
			throw new Error(`Invalid node ${cur}`);
		}
	} while (cur !== end);
}

import { XMLNS } from "./namespace.js";
import { Attr } from "./attr.js";
import { ChildNode } from "./child-node.js";
import { enumDOMStr } from "./dom-serialize.js";
