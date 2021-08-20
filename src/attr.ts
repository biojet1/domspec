// export class Property extends Node {}
export const VALUE = Symbol();

export abstract class Attr extends Node {
	//// Tree

	//// Dom
	name: string;
	localName: string;
	namespaceURI?: string;
	prefix?: string;
	// [VALUE]?: string;
	// private constructor(qname: string, lname?: string) {
	// 	super();
	// 	this.name = qname;
	// 	this.localName = lname || qname;
	// }
	constructor(
		qualifiedName: string,
		namespace?: string | null,
		contentType?: string
	) {
		super();
		let prefix, localName, tag;
		const ns = namespace && namespace !== "" ? namespace : undefined;
		const pos = qualifiedName.indexOf(":");

		if (pos >= 0) {
			prefix = qualifiedName.substring(0, pos);
			localName = qualifiedName.substring(pos + 1);
		} else {
			localName = qualifiedName;
		}
		if (
			(prefix && !ns) ||
			(prefix === "xml" && ns !== XML) ||
			((prefix === "xmlns" || qualifiedName === "xmlns") &&
				ns !== XMLNS) ||
			(ns === XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
		) {
			throw new Error("NamespaceError");
		}

		this.localName = localName;
		this.name = prefix ? `${prefix}:${localName}` : localName;
		if (ns) this.namespaceURI = ns;
		if (prefix) this.prefix = prefix;
	}

	get textContent() {
		// https://dom.spec.whatwg.org/#dom-node-textcontent
		return this.value;
	}
	set textContent(value: string) {
		this.value = value;
	}
	get nodeType() {
		return 2;
	}
	get nodeValue() {
		// https://dom.spec.whatwg.org/#dom-node-nodevalue
		return this.value;
	}
	abstract get value(): string;
	abstract set value(value: string);
	get specified() {
		return true;
	}
	get nodeName() {
		return this.name;
	}
	get ownerElement() {
		const { parentNode: node } = this;
		return node || null;
	}
	// isDefaultNamespace(namespaceURI?: string) {
	// 	const { ownerElement } = this;
	// 	return ownerElement && ownerElement.isDefaultNamespace(namespaceURI);
	// }
	// lookupNamespaceURI(prefix?: string) {
	// 	const { ownerElement } = this;
	// 	return ownerElement && ownerElement.lookupNamespaceURI(prefix);
	// }
	// lookupPrefix(namespaceURI: string) {
	// 	const { ownerElement } = this;
	// 	return ownerElement && ownerElement.lookupNamespacePrefix(prefix);
	// }
	lookupNamespaceURI(prefix: string | null): string | null {
		const { ownerElement: node } = this;
		return node ? node.lookupNamespaceURI(prefix) : null;
	}
	toString() {
		const { name, value } = this;
		return `${name}="${value.replace(/[<>&"\xA0]/g, rep)}"`;
	}

	formatXML() {
		const { name, value } = this;
		return `${name}="${value.replace(/[<>&"\xA0]/g, rep)}"`;
	}

	static create(
		qualifiedName: string,
		namespace?: string | null,
		contentType?: string
	) {
		return new StringAttr(qualifiedName, namespace, contentType);
	}

	cloneNode(deep?: boolean) {
		const { ownerDocument, name, namespaceURI, value, localName, prefix } =
			this;

		const attr = new (this.constructor as any)(name, namespaceURI);
		if (ownerDocument) attr.ownerDocument = ownerDocument;
		if (namespaceURI) attr.namespaceURI = namespaceURI;
		// if (localName) attr.localName = localName;
		if (prefix) attr.prefix = prefix;
		if (value) attr.value = value;

		return attr;
	}
}

export class StringAttr extends Attr {
	//// Dom
	[VALUE]?: string;
	get value() {
		return this[VALUE] || "";
	}
	set value(value: string) {
		this[VALUE] = value;
	}
	formatXML() {
		const { [VALUE]: val } = this;
		return val ? super.formatXML() : "";
	}
}
export abstract class Typed {
	abstract toString(): string;
	// abstract constructor (value?:string) : Typed;
}

export class TypedAttr<T extends Typed> extends Attr {
	[VALUE]?: T | string;
	get value() {
		const { [VALUE]: val } = this;
		return val ? val.toString() : "";
	}
	set value(value: string) {
		this[VALUE] = value;
	}
	// into() {
	// 	const { [VALUE]: val } = this;
	// 	if (typeof val === "string") {
	// 		return (this[VALUE] = new T(val));
	// 	} else {
	// 		return val || (this[VALUE] = new T());
	// 	}
	// 	// return typeof val === "string"
	// 	// 	? (this[VALUE] = T.parse(val))
	// 	// 	: val || (this[VALUE] = T.parse());
	// }
	formatXML() {
		const { [VALUE]: val } = this;
		return val ? super.formatXML() : "";
	}
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
	return m;
};
import { Node } from "./node.js";
// "   &quot;
// '   &apos;
// <   &lt;
// >   &gt;
// &   &amp;
import { XMLNS, XML } from "./namespace.js";
