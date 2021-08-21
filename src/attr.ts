// export class Property extends Node {}
export const VALUE = Symbol();

export abstract class Attr extends Node {
	//// Tree

	//// Dom
	name: string;
	localName: string;
	_ns?: string;
	_prefix?: string;
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
		const ns = namespace && namespace !== "" ? namespace : undefined;
		if (ns) {
			let prefix, localName, tag;
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
				(ns === XMLNS &&
					!(prefix === "xmlns" || qualifiedName === "xmlns"))
			) {
				throw new Error("NamespaceError");
			}

			if (ns) this._ns = ns;
			if (prefix) this._prefix = prefix;

			switch (contentType) {
				case "text/html":
					this.localName = localName.toLowerCase();
					this.name = (
						prefix ? `${prefix}:${localName}` : localName
					).toLowerCase();

					break;
				default:
					this.localName = localName;
					this.name = prefix ? `${prefix}:${localName}` : localName;
			}
		} else {
			switch (contentType) {
				case "text/html":
					this.name = this.localName = qualifiedName.toLowerCase();
					break;
				default:
					this.name = this.localName = qualifiedName;
			}
		}
		if (!/^[_:A-Za-z][\w:_-]*$/.test(this.name))
			throw new Error(`InvalidCharacterErr: '${this.name}'`);
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
	get namespaceURI() {
		return this._ns || null;
	}
	get prefix() {
		return this._prefix || null;
	}
	get nodeName() {
		return this.name;
	}
	get ownerElement() {
		const { parentNode: node } = this;
		return node || null;
	}
	// get ownerDocument(): Document | null {
	// 	const { parentNode: node } = this;
	// 	return node ? node.ownerDocument : null;
	// }
	// set ownerDocument(doc: Document | null) {
	// 	const { parentNode: node } = this;
	// 	if (node && doc) node.ownerDocument = doc;
	// }
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
		const { ownerDocument, name, _ns, value, localName, _prefix } = this;

		const attr = new (this.constructor as any)(name, _ns);
		if (ownerDocument) attr.ownerDocument = ownerDocument;
		if (_ns) attr._ns = _ns;
		// if (localName) attr.localName = localName;
		if (_prefix) attr._prefix = _prefix;
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
import { Document } from "./document.js";
