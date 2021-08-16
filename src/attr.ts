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
	constructor(qname: string, lname?: string) {
		super();
		this.name = qname;
		this.localName = lname || qname;
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
	dumpXML() {
		const { name, value } = this;
		return `${name}="${value.replace(/[<>&"\xA0]/g, rep)}"`;
	}
	static create(qname: string, lname?: string) {
		return new StringAttr(qname, lname);
	}
	cloneNode(deep?: boolean) {
		const { ownerDocument, name, namespaceURI, value, localName, prefix } =
			this;

		const attr = new (this.constructor as any)(name, localName);
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
	dumpXML() {
		const { [VALUE]: val } = this;
		return val ? super.dumpXML() : "";
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
	dumpXML() {
		const { [VALUE]: val } = this;
		return val ? super.dumpXML() : "";
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
