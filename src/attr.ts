export class Attr extends Node {
	//// Tree

	//// Dom
	namespaceURI?: string;
	prefix?: string;
	// ownerElement?: Node;
	localName: string;
	value: string;
	name: string;
	constructor() {
		super();
		this.name = this.value = this.localName = "";
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