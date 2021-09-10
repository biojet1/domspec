export class NamedNodeMap {
	// ownerElement: Element;
	#owner: Element;

	[i: number]: Attr;

	constructor(ownerElement: Element) {
		// this.ownerElement = ownerElement;
		this.#owner = ownerElement;
		this.length;
	}
	get ownerElement() {
		return this.#owner;
	}
	getNamedItem(name: string): Attr | null {
		return this.#owner.getAttributeNode(name);
	}

	getNamedItemNS(ns: string, name: string): Attr | null {
		return this.#owner.getAttributeNodeNS(ns, name);
	}

	removeNamedItem(name: string) {
		const item = this.getNamedItem(name);
		item && this.#owner.removeAttributeNode(item);
	}

	removeNamedItemNS(ns: string, name: string) {
		const item = this.getNamedItemNS(ns, name);
		item && this.#owner.removeAttributeNode(item);
	}

	setNamedItem(attr: Attr) {
		this.#owner.setAttributeNode(attr);
	}

	setNamedItemNS(attr: Attr) {
		this.#owner.setAttributeNodeNS(attr);
	}

	item(index: number) {
		if (index >= 0) {
			for (const attr of this) {
				if (index-- === 0) {
					return attr;
				}
			}
			// let attr = this.#owner[NEXT];
			// for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			// 	if (index-- === 0) {
			// 		return attr;
			// 	}
			// }
		}
		return null;
	}

	get length() {
		let n = 0;
		// let attr = this.#owner[NEXT];
		// for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
		// 	this[n++] = attr;
		// }
		for (const attr of this) {
			this[n++] = attr;
		}
		const c = n;
		while (n in this) {
			delete this[n++];
		}
		return c;
	}

	*[Symbol.iterator](): Iterator<Attr> {
		let attr = this.#owner[NEXT];
		for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
			yield attr;
		}
	}
}

import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { NEXT } from "./node.js";
