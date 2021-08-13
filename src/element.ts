import { NEXT, PREV, END, Node } from "./node.js";
import { ParentNode, EndNode } from "./parent-node.js";
export const DATASET = Symbol();

export class Element extends ParentNode {
	//// Parse
	_parsed_closed?: boolean;
	//// Tree
	//// DOM
	localName: string;
	tagName: string;
	namespaceURI?: string;
	prefix?: string;
	[DATASET]?: any;

	constructor() {
		super();
		this.localName = this.tagName = "";
	}
	//// DOM: <specialGetters>

	get nodeType() {
		return 1; // ELEMENT_NODE (1)
	}

	get nodeName() {
		return this.tagName;
	}

	get id() {
		return this.getAttribute("id") || "";
	}

	set id(id: string) {
		this.setAttribute("id", id);
	}

	get className() {
		return this.getAttribute("class") || "";
	}

	set className(str: string) {
		this.setAttribute("class", str);
	}

	//// DOM: </specialGetters>
	//// DOM: <Attributes>
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

	getAttributeNodeNS(ns: string | null, localName: string) {
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

		const node = Attr.create(qname);
		node.value = value;
		node.parentNode = this;

		// (attr && attr instanceof Attr ? attr : this).insertRight(node);
		const ref = attr && attr instanceof Attr ? attr : this;
		node._link(ref, ref[NEXT] || this[END], this);
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
		const node = Attr.create(qname, lname);
		node.value = value;
		node.parentNode = this;
		node.namespaceURI = ns;
		if (prefix) node.prefix = prefix;
		//  (attr && attr instanceof Attr ? attr : this).insertRight(node);
		const ref = attr && attr instanceof Attr ? attr : this;
		node._link(ref, ref[NEXT] || this[END], this);
		// node._link(attr, attr[NEXT], this);
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
			// prev.insertLeft(node).remove();
			const ref = prev[PREV] || this;
			prev.remove();
			node.remove();
			node._link(ref, ref[NEXT] || this[END], this);
		} else {
			let attr = this[NEXT];
			for (; attr && attr instanceof Attr; attr = attr[NEXT]);
			// if (attr) {
			// 	// node.remove().parentNode = this;
			// 	// attr.insertLeft(node);

			// }
			const ref = attr && attr instanceof Attr ? attr : this;
			node.remove();
			node._link(ref, ref[NEXT] || this[END], this);
		}
		return prev;
	}
	removeAttribute(qName: string) {
		this.getAttributeNode(qName)?.remove();
	}
	removeAttributeNS(ns: string | null, localName: string) {
		this.getAttributeNodeNS(ns, localName)?.remove();
	}
	removeAttributeNode(node: Attr) {
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr === node) {
				attr.remove();
				return;
			}
		}
		this.removeAttributeNS(node.namespaceURI || null, node.localName);
	}

	hasAttribute(qName: string) {
		return !!this.getAttributeNode(qName);
	}
	hasAttributeNS(ns: string, localName: string) {
		return !!this.getAttributeNodeNS(ns, localName);
	}

	toggleAttribute(name: string, force?: boolean) {
		if (this.hasAttribute(name)) {
			if (!force) {
				this.removeAttribute(name);
			} else {
				return true;
			}
		} else if (force == true || force === undefined) {
			this.setAttribute(name, "");
			return true;
		}
		return false;
	}

	get attributes() {
		return new NamedNodeMap(this);
	}

	//// DOM: </Attributes>
	//// DOM: </Content>

	toString() {
		return Array.from(enumDOMStr(this)).join("");
	}

	get outerHTML() {
		return Array.from(enumXMLDump(this, this[END])).join("");
	}

	get innerHTML() {
		const { firstChild, lastChild } = this;
		return firstChild && lastChild
			? Array.from(
					enumXMLDump(firstChild.startNode, lastChild.endNode)
			  ).join("")
			: "";
	}

	set innerHTML(html: string) {
		this.replaceChildren();
		parseDOM(html, this);
	}

	get innerText() {
		return this.textContent;
	}

	// set textContent(text) {
	// 	this.replaceChildren();
	// 	if (text) this.appendChild(new Text(this.ownerDocument, text));
	// }
	//// DOM: </Content>

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

	insertAdjacentElement(position: string, element: ChildNode) {
		// const { parentElement } = this;
		const { parentNode } = this;
		// if (parentNode) {
		// 	if (parentNode.nodeType === 9) {
		// 		throw new Error(
		// 			`HierarchyRequestError: Only one child element for document`
		// 		);
		// 	} else {
		// 		throw new Error(`HierarchyRequestError: No parentNode`);
		// 	}
		// } else {
		// 	return null;
		// }
		if (element.nodeType !== 1) {
			throw new TypeError(`Element expected`);
		}

		switch (position) {
			case "beforebegin":
				if (parentNode) {
					parentNode.insertBefore(element, this);
				} else {
					return null;
				}
				break;
			case "afterend":
				if (parentNode) {
					parentNode.insertBefore(element, this.nextSibling);
				} else {
					return null;
				}
				break;
			case "afterbegin":
				this.insertBefore(element, this.firstChild);
				break;
			case "beforeend":
				this.insertBefore(element, null);
				break;
			default:
				throw new Error(`SyntaxError: Invalid position ${position}`);
		}
		return element;
	}

	insertAdjacentText(position: string, text: string) {
		const { ownerDocument, parentNode } = this;
		// ownerDocument &&
		// 	this.insertAdjacentElement(
		// 		position,

		// 	);
		const node = ownerDocument && ownerDocument.createTextNode(text);

		if (node)
			switch (position) {
				case "beforebegin":
					if (parentNode) {
						parentNode.insertBefore(node, this);
					}
					break;
				case "afterend":
					if (parentNode) {
						parentNode.insertBefore(node, this.nextSibling);
					}
					break;
				case "afterbegin":
					this.insertBefore(node, this.firstChild);
					break;
				case "beforeend":
					this.insertBefore(node, null);
					break;
				case null:
				case undefined:
					break;
				default:
					throw new Error(
						`SyntaxError: Invalid position ${position}`
					);
			}
	}

	get style() {
		const attr = this.getAttributeNode("style");
		if (!attr) {
			const node = new StyleAttr("style");
			this.setAttributeNode(node);
			return node.proxy;
		} else if (attr instanceof StyleAttr) {
			return attr.proxy;
		} else {
			attr.remove();
			const ref = attr[PREV] || this;
			const node = new StyleAttr("style");
			node._link(ref, ref[NEXT] || this[END], this);
			node.value = attr.value;
			return node.proxy;
		}
	}

	get classList() {
		const attr = this.getAttributeNode("class");
		if (!attr) {
			// console.log("StyleAttr:NEW");
			const node = new ClassAttr("class");
			this.setAttributeNode(node);
			return node.tokens;
		} else if (attr instanceof ClassAttr) {
			// console.log("StyleAttr:GET");
			return attr.tokens;
		} else {
			// console.log("StyleAttr:REP");
			attr.remove();
			const ref = attr[PREV] || this;
			const node = new ClassAttr("class");
			node._link(ref, ref[NEXT] || this[END], this);
			node.value = attr.value;
			return node.tokens;
		}
	}

	get dataset() {
		return (
			this[DATASET] ||
			(this[DATASET] = new Proxy<Element>(this, dsHandler))
		);
	}
}

function toCamelCase(name: string) {
	return name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
}

function fromCamelCase(name: string) {
	if (/-[a-z]/.test(name)) {
		throw new Error(`Unexpected dataset name`);
	}
	return (
		"data-" + name.replace(/([A-Z])/g, (_, $1) => `-${$1.toLowerCase()}`)
	);
}

export const dsHandler = {
	get(element: Element, name: string) {
		return element.getAttribute(fromCamelCase(name)) || undefined;
	},

	set(element: Element, name: string, value: string) {
		element.setAttribute(fromCamelCase(name), value + "");
		return true;
	},
	has(element: Element, name: string) {
		return element.hasAttribute(fromCamelCase(name));
	},
	deleteProperty(element: Element, name: string) {
		const attr = element.getAttributeNode(fromCamelCase(name));
		if (!attr) return false;

		element.removeAttributeNode(attr);
		return true;
	},

	ownKeys(element: Element) {
		// function* gen() {
		// 	let attr = element[NEXT];
		// 	for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
		// 		const { namespaceURI, name } = attr;
		// 		if (
		// 			(!namespaceURI || namespaceURI === "") &&
		// 			name.startsWith("data-")
		// 		) {
		// 			yield toCamelCase(name);
		// 		}
		// 	}
		// }
		// // console.log("ownKeys [..]", [...gen()]);
		// return [...gen()];
		return Array.from(
			(function* () {
				let attr = element[NEXT];
				for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
					const { namespaceURI, name } = attr;
					if (
						(!namespaceURI || namespaceURI === "") &&
						name.startsWith("data-")
					) {
						console.log("ownKeys", name, toCamelCase(name));
						yield toCamelCase(name);
					}
				}
			})()
		);
	},

	getOwnPropertyDescriptor(element: Element, name: string) {
		return {
			enumerable: true,
			configurable: true,
		};
	},
};

import { XMLNS } from "./namespace.js";
import { Attr } from "./attr.js";
import { ChildNode } from "./child-node.js";
import { enumDOMStr, enumXMLDump } from "./dom-serialize.js";
import { parseDOM } from "./dom-parse.js";
import { StyleAttr } from "./attr-style.js";
import { ClassAttr } from "./attr-class.js";
import { NamedNodeMap } from "./named-node-map.js";
