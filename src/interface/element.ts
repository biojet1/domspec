import { NEXT } from "./node.js";
import { ParentNode } from "./parent-node.js";

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
}

import { XMLNS } from "./namespace.js";
import { Attr } from "./attr.js";
