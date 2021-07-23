import { Node } from "./node.js";

export class Attr extends Node {
	//// Tree

	//// Dom
	namespaceURI?: string;
	prefix?: string;
	ownerElement?: Node;
	localName: string;
	value: string;
	name: string;
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
	isDefaultNamespace(namespaceURI?: string) {
		const { ownerElement } = this;
		return ownerElement && ownerElement.isDefaultNamespace(namespaceURI);
	}
	lookupNamespaceURI(prefix?: string) {
		const { ownerElement } = this;
		return ownerElement && ownerElement.lookupNamespaceURI(prefix);
	}
	lookupPrefix(namespaceURI: string) {
		const { ownerElement } = this;
		return ownerElement && ownerElement.lookupNamespacePrefix(prefix);
	}
}
