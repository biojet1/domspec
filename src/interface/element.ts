import { NEXT, PREV, START, END, Node } from "./node.js";
import { ParentNode, EndNode } from "./parent-node.js";

export class Element extends ParentNode {
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

	getAttributeNode(name: string) {
		for (
			let attr = this[NEXT];
			attr && attr instanceof Attr;
			attr = attr[NEXT]
		) {
			if (!attr.namespaceURI && attr.name === name) return attr;
		}
		return null;
	}
	getAttributeNodeNS(namespace: string, localName: string) {
		for (
			let attr = this[NEXT];
			attr && attr instanceof Attr;
			attr = attr[NEXT]
		) {
			if (attr.namespaceURI === namespace) {
				if (attr.localName === localName) {
					return attr;
				}
			}
		}
		return null;
	}
	lookupNamespaceURI(prefix: string | null): string | null {
		if (prefix === "" || !prefix) prefix = null;
		const { namespaceURI } = this;

		if (namespaceURI && this.prefix === prefix) return namespaceURI;

		for (
			let attr = this[NEXT];
			attr && attr instanceof Attr;
			attr = attr[NEXT]
		) {
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

	toString() {
		const out = [];
		const end = this[END];
		let isOpened = false;
		let cur = new Node();
		cur[NEXT] = this;
		// console.log("CUR", "==============");
		do {
			cur = cur[NEXT] || end;
			// console.dir([cur.nodeType, cur], { depth: 1 });
			if (cur instanceof Attr) {
				out.push(` ${cur.toString()}`);
			} else if (cur instanceof Element) {
				isOpened && out.push(">");
				out.push(`<${cur.tagName}`);
				isOpened = true;
			} else if (cur instanceof ChildNode) {
				isOpened && out.push(">");
				out.push(cur.toString());
				isOpened = false;
			} else if (cur instanceof EndNode) {
				const prev = cur[PREV];
				if (prev === this || prev instanceof Attr) {
					out.push(`/>`);
				} else {
					isOpened && out.push(">");
					out.push(`</${(cur[START] as Element).tagName}>`);
				}
			} else {
				throw new Error(`Invalid node ${cur}`);
			}
		} while (cur !== end);

		return out.join("");
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
