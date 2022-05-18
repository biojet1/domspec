export const VALUE = Symbol();
export const RE_NAME = /^[_:A-Za-z][\w:_-]*$/;
export abstract class Attr extends Node {
	//// Tree

	//// Dom
	name: string;
	localName: string;
	_ns?: string | null;
	_prefix?: string | null;

	constructor(name: string, localName?: string) {
		super();
		this.name = name;
		this.localName = localName || name;
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

	isDefaultNamespace(namespaceURI: string) {
		const { parentElement: node } = this;
		return node ? node.isDefaultNamespace(namespaceURI) : false;
	}
	lookupNamespaceURI(prefix: string) {
		const { parentElement: node } = this;
		return node && node.lookupNamespaceURI(prefix);
	}
	lookupPrefix(ns: string) {
		const { parentElement: node } = this;
		return node && node.lookupPrefix(ns);
	}

	cloneNode(deep?: boolean) {
		const { ownerDocument, name, _ns, value, localName, _prefix } = this;

		const attr = new (this.constructor as any)(name, localName);
		if (ownerDocument) attr.ownerDocument = ownerDocument;
		if (_ns || _ns === null) attr._ns = _ns;
		// if (localName) attr.localName = localName;
		if (_prefix || _prefix === null) attr._prefix = _prefix;
		if (value) attr.value = value;

		return attr;
	}
	isEqualNode(node: Node) {
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}
		let { namespaceURI: nsB, prefix: prefixB, localName: localB, value: valB } = node as Attr;
		let { namespaceURI: nsA, prefix: prefixA, localName: localA, value: valA } = this;
		return (
			localA === localB &&
			// (localA ? localA === localB : !localB) &&
			(nsA ? nsA === nsB : !nsB) &&
			// (prefixA ? prefixA === prefixB : !!prefixB) &&
			valA === valB
		);
	}
}

export class StringAttr extends Attr {
	//// Dom
	[VALUE]?: string;
	valueOf() {
		return this[VALUE] ?? null;
	}
	get value() {
		return this[VALUE] || '';
	}
	set value(value: string) {
		this[VALUE] = value;
	}
}

import { Node } from './node.js';
import { validateAndExtract } from './namespace.js';
import { Document } from './document.js';
