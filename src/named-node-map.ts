export class NamedNodeMap {
	ownerElement: Element;
	[i: number]: Attr;

	constructor(ownerElement: Element) {
		this.ownerElement = ownerElement;
		this.length;
	}

	getNamedItem(name: string): Attr | null {
		return this.ownerElement.getAttributeNode(name);
	}
	getNamedItemNS(ns: string, name: string): Attr | null {
		return this.ownerElement.getAttributeNodeNS(ns, name);
	}

	removeNamedItem(name: string) {
		const item = this.getNamedItem(name);
		item && this.ownerElement.removeAttributeNode(item);
	}
	removeNamedItemNS(ns: string, name: string) {
		const item = this.getNamedItemNS(ns, name);
		item && this.ownerElement.removeAttributeNode(item);
	}

	setNamedItem(attr: Attr) {
		this.ownerElement.setAttributeNode(attr);
	}

	setNamedItemNS(attr: Attr) {
		this.ownerElement.setAttributeNodeNS(attr);
	}

	item(index: number) {
		if (index >= 0) {
			let attr = this.ownerElement[NEXT];
			for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
				if (index-- === 0) {
					return attr;
				}
			}
		}
		return null;
	}

	get length() {
		let n = 0;
		let attr = this.ownerElement[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			this[n] = attr;
			n++;
		}
		for (; n in this; ) {
			delete this[n++];
		}
		return n;
	}
}
import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { NEXT } from "./node.js";
