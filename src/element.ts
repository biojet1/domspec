import { NEXT, PREV, END, Node } from "./node.js";
import { ParentNode, EndNode } from "./parent-node.js";
export const DATASET = Symbol();

function* attributes(node: Element) {
	let attr = node[NEXT];
	for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
		yield attr;
	}
}

export class Element extends ParentNode {
	//// Parse
	_parsed_closed?: boolean;
	//// Tree

	//// DOM
	localName: string;
	_tag?: string;
	_ns?: string;
	_prefix?: string;
	[DATASET]?: any;

	constructor(name: string, ns?: string, prefix?: string, tag?: string) {
		super();
		this.localName = name;
		// this.tagName = tag || (prefix && `${prefix}:${name}`) || name;
		if (ns) {
			this._ns = ns;
			if (prefix) this._prefix = prefix;
		}
	}
	#tagName() {
		const qName = this.qualifiedName;
		return this?.ownerDocument?.isHTML && this._ns === HTML_NS
			? qName.replace(/([a-z]+)/g, (m, a) => a.toUpperCase())
			: qName;
	}

	get qualifiedName() {
		const { localName, prefix } = this;
		return prefix ? `${prefix}:${localName}` : localName;
	}
	get prefix() {
		return this._prefix || null;
	}
	get namespaceURI() {
		return this._ns || null;
	}

	//// DOM: <specialGetters>

	get nodeType() {
		return 1; // ELEMENT_NODE (1)
	}

	get nodeName() {
		return this.tagName;
	}

	get tagName() {
		return this._tag || (this._tag = this.#tagName());
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

	popAttribute(name: string) {
		const node = this.popAttributeNode(name);
		return node?.value;
	}

	getAttributeNS(ns: string | null, localName: string) {
		const node = this.getAttributeNodeNS(ns, localName);
		return node ? node.value : null;
	}

	getAttributeNode(name: string) {
		if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
			name = name.toLowerCase();
		}
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr.name === name) return attr;
		}
		return null;
	}

	popAttributeNode(name: string) {
		if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
			name = name.toLowerCase();
		}
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr.name === name) {
				attr.remove();
				return attr;
			}
		}
		return null;
	}

	newAttributeNode(name: string): Attr {
		return new StringAttr(name);
	}
	newAttributeNodeNS(
		nsu: string | null,
		name: string,
		localName: string
	): Attr {
		return new StringAttr(name, localName);
	}
	letAttributeNode(name: string) {
		const { ownerDocument, _ns } = this;
		if (ownerDocument?.isHTML && _ns === HTML_NS) {
			name = name.toLowerCase();
		}
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr.name === name) return attr;
		}
		const node = this.newAttributeNode(name);
		node.ownerDocument = ownerDocument;
		const ref =
			(attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
		node._attach(ref, ref[NEXT] || this[END], this);
		return node;
	}
	getAttributeNodeNS(nsu: string | null, localName: string) {
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr.localName === localName) {
				if (nsu ? attr.namespaceURI === nsu : !attr.namespaceURI) {
					return attr;
				}
			}
		}
		return null;
	}
	setAttribute(name: string, value: string) {
		if (this.ownerDocument?.isHTML && this._ns === HTML_NS) {
			name = name.toLowerCase();
		}
		checkName(name);
		const attr = this.letAttributeNode(name);
		attr.value = value;
	}
	letAttributeNodeNS(nms: string | null, qname: string) {
		let attr = this[NEXT];
		const [ns, prefix, lname] = validateAndExtract(nms, qname);
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			const { namespaceURI, localName } = attr;
			if (namespaceURI === ns && localName === lname) {
				return attr;
			}
		}
		const { ownerDocument } = this;
		const node = this.newAttributeNodeNS(nms, qname, lname);
		node._ns = ns;
		node._prefix = prefix;
		node.ownerDocument = ownerDocument;
		const ref =
			(attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
		node._attach(ref, ref[NEXT] || this[END], this);
		return node;
	}
	setAttributeNS(nms: string | null, qname: string, value: string) {
		this.letAttributeNodeNS(nms, qname).value = value;
	}
	setAttributeNode(node: Attr) {
		return this.setAttributeNodeNS(node);
	}
	setAttributeNodeNS(node: Attr) {
		const { parentNode } = node;
		const prev = this.getAttributeNodeNS(
			node.namespaceURI || null,
			node.localName
		);
		if (node === prev) {
			return node;
		} else if (parentNode) {
			throw DOMException.new(`InUseAttributeError`);
		} else if (prev) {
			// prev.insertLeft(node).remove();
			const ref = prev[PREV] || this;
			prev.remove();
			node.remove();
			node._attach(ref, ref[NEXT] || this[END], this);
		} else {
			let attr = this[NEXT];
			for (; attr && attr instanceof Attr; attr = attr[NEXT]);
			// if (attr) {
			// 	// node.remove().parentNode = this;
			// 	// attr.insertLeft(node);

			// }
			const ref =
				(attr && (attr instanceof Attr ? attr : attr[PREV])) || this;
			node.remove();
			node._attach(ref, ref[NEXT] || this[END], this);
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

	hasAttribute(name: string) {
		if (this.ownerDocument?.isHTML && this.namespaceURI === HTML_NS) {
			name = name.toLowerCase();
		}
		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			// if (attr.name === name || attr.localName === name) return true;
			if (attr.name === name) return true;
		}
		return false;
	}

	hasAttributes() {
		let attr = this[NEXT];
		return attr && attr instanceof Attr;
	}

	hasAttributeNS(ns: string, localName: string) {
		return !!this.getAttributeNodeNS(ns, localName);
	}

	toggleAttribute(name: string, force?: boolean) {
		checkName(name);
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
		return new Proxy<Element>(this, AttributesHandler);
		// return new NamedNodeMap(this);
	}

	getAttributeNames() {
		return new Array(...attributes(this)).map((attr) => attr.name);
	}

	//// DOM: </Attributes>
	// <selectors>
	matches(selectors: string) {
		const test = prepareMatch(this, selectors + "");
		return test(this);
	}
	closest(selectors: string) {
		let cur: Element | null = this;

		if (0) {
			while (cur && !cur.matches(selectors)) {
				cur = cur.parentElement;
			}
			return cur;
		} else {
			let test;

			try {
				test = prepareMatch(cur, selectors + "");
			} catch {
				return null;
			}
			do {
				if (test(cur)) {
					return cur;
				}
				cur = cur.parentElement;
			} while (cur);
			return null;
		}
	}
	// </selectors>

	//// DOM: </Content>

	get innerText() {
		return this.textContent;
	}

	//// DOM: </Content>

	lookupNamespaceURI(prefix: string): string | null {
		const { namespaceURI, prefix: this_prefix } = this;

		if (namespaceURI && this_prefix ? this_prefix === prefix : !prefix)
			return namespaceURI || null;

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
	lookupPrefix(ns: string): string | null {
		if (!ns) return null;
		const { namespaceURI, prefix } = this;

		if (namespaceURI === ns && prefix) return prefix;

		let attr = this[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			if (attr.namespaceURI === XMLNS) {
				const { prefix: prefixA, value: valueA } = attr;
				if (prefixA === "xmlns" && valueA === ns) {
					return attr.localName;
				}
			}
		}
		const { parentElement: parent } = this;

		return parent ? parent.lookupPrefix(ns) : null;
	}

	isDefaultNamespace(namespaceURI: string) {
		const ns1 = this.lookupNamespaceURI("");
		return ns1 ? ns1 === namespaceURI : !namespaceURI;
	}

	insertAdjacentElement(position: string, element: ChildNode) {
		const { parentNode } = this;
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
				throw DOMException.new(
					"SyntaxError",
					`Invalid position ${position}`
				);
		}
		return element;
	}

	insertAdjacentText(position: string, text: string) {
		const { ownerDocument, parentNode } = this;
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
					throw DOMException.new(
						"SyntaxError",
						`Invalid position ${position}`
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
			node._attach(ref, ref[NEXT] || this[END], this);
			node.value = attr.value;
			return node.proxy;
		}
	}
	set style(value: CSSStyleDeclaration) {
		this.setAttribute("style", value.toString());
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
			node._attach(ref, ref[NEXT] || this[END], this);
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

	cloneNode(deep?: boolean) {
		const {
			ownerDocument,
			namespaceURI,
			localName,
			prefix,
			tagName,
			qualifiedName,
		} = this;
		// const node = new (this.constructor as any)(localName, namespaceURI, prefix, tagName);
		const node: ParentNode = ownerDocument
			? ownerDocument.createElementNS(namespaceURI, qualifiedName)
			: new (this.constructor as any)(
					localName,
					namespaceURI,
					prefix,
					tagName
			  );

		if (ownerDocument) node.ownerDocument = ownerDocument;
		// if (namespaceURI) node.namespaceURI = namespaceURI;
		// if (prefix) node.prefix = prefix;
		// if (localName) node.localName = localName;
		// if (tagName) node.tagName = tagName;
		let cur: Node = this;
		const fin = this[END];
		const end = node[END];
		for (cur = this[NEXT] || fin; cur != fin; cur = cur[NEXT] || fin) {
			if (cur instanceof Attr) {
				cur.cloneNode()._attach(end[PREV] || node, end, node);
			} else {
				break;
			}
		}
		if (deep) {
			for (; cur != fin; cur = cur.endNode[NEXT] || fin) {
				switch (cur.nodeType) {
					case 1: // ELEMENT_NODE
						cur.cloneNode(deep)._attach(
							end[PREV] || node,
							end,
							node
						);
						break;
					case 3: // TEXT_NODE
					case 4: // CDATA_SECTION_NODE
					case 7: // PROCESSING_INSTRUCTION_NODE
					case 8: // COMMENT_NODE
						cur.cloneNode(deep)._attach(
							end[PREV] || node,
							end,
							node
						);
						break;
					case 2: // ATTRIBUTE_NODE
					case 9: // DOCUMENT_NODE
					case 10: // DOCUMENT_TYPE_NODE
					case 11: // DOCUMENT_FRAGMENT_NODE
					case -1:
						throw new Error(`Unexpected ${cur.nodeType}`);
						break;
				}
			}
		}
		return node;
	}

	isEqualNode(node: Node) {
		// console.log("isEqualNode", this.nodeName, node.nodeName);
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}
		let {
			namespaceURI: nsB,
			prefix: prefixB,
			localName: localB,
			// attributes: attrsB,
		} = node as Element;
		let {
			namespaceURI: nsA,
			prefix: prefixA,
			localName: localA,
			// attributes: attrsA,
		} = this;
		const attrsA = new Array(...attributes(this));
		const attrsB = new Array(...attributes(node as Element));
		if (
			!localA !== !localB ||
			localA !== localB ||
			!nsA !== !nsB ||
			nsA !== nsB ||
			!prefixA !== !prefixB ||
			prefixA !== prefixB ||
			attrsB.length !== attrsA.length
		) {
			return false;
		}

		A: for (const a of attrsA) {
			for (const b of attrsB) {
				if (a.isEqualNode(b)) {
					continue A;
				}
			}
			return false;
		}

		let { firstChild: curB } = node as ParentNode;
		let { firstChild: curA } = this;

		for (;;) {
			if (curA && curB) {
				if (!curA.isEqualNode(curB)) {
					return false;
				}
				curA = curA.nextSibling;
				curB = curB.nextSibling;
			} else {
				return !!curA === !!curB;
			}
		}

		// return true;
	}

	letId() {
		let id = this.getAttribute("id");
		if (!id) {
			this.setAttribute("id", (id = nextUniqueId().toString(36)));
		}
		return id;
	}
}

// function checkQName(name: string) {
// 	if (!name) {
// 		throw DOMException.new("InvalidCharacterError", `!'${name}'`);
// 	} else if (name.indexOf(":") < 0) {
// 		return checkName(name);
// 	} else if (!/^[_A-Za-z]\w*:[_A-Za-z][\w_-]*$/.test(name)) {
// 		throw DOMException.new("InvalidCharacterError", `'${name}'`);
// 	}
// 	return true;
// }

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
						// console.log("ownKeys", name, toCamelCase(name));
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

let _id_int = 0;
function nextUniqueId() {
	if (_id_int == 0) {
		_id_int = new Date().getTime();
		return _id_int == 0 ? ++_id_int : _id_int;
	}
	return ++_id_int == 0 ? ++_id_int : _id_int;
}

import { XMLNS } from "./namespace.js";
import { StringAttr, Attr } from "./attr.js";
import { ChildNode } from "./child-node.js";
import { StyleAttr } from "./attr-style.js";
import { ClassAttr } from "./attr-class.js";
import { NamedNodeMap, AttributesHandler } from "./named-node-map.js";
import { enumXMLDump } from "./dom-serialize.js";
import { validateAndExtract, checkName, HTML_NS } from "./namespace.js";
import { prepareMatch } from "./css/match.js";
import { DOMException } from "./event-target.js";

export { NamedNodeMap };
