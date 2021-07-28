export class NamedNodeMap extends Array {
	ownerElement: Element;

	constructor(ownerElement: Element) {
		super();
		this.ownerElement = ownerElement;
	}

	getNamedItem(name: string): Attr | null {
		return this.ownerElement.getAttributeNode(name);
	}
	getNamedItemNS(ns: string, name: string): Attr | null {
		return this.ownerElement.getAttributeNodeNS(ns, name);
	}

	removeNamedItem(name: string) {
		const item = this.getNamedItem(name);
		this.ownerElement.removeAttribute(name);
		this.splice(this.indexOf(item), 1);
	}
	removeNamedItemNS(ns: string, name: string) {
		const item = this.getNamedItemNS(ns, name);
		this.ownerElement.removeAttributeNS(ns, name);
		this.splice(this.indexOf(item), 1);
	}

	setNamedItem(attr: Attr) {
		this.ownerElement.setAttributeNode(attr);
		this.unshift(attr);
	}

	setNamedItemNS(attr: Attr) {
		this.ownerElement.setAttributeNodeNS(attr);
		this.unshift(attr);
	}

	item(index: number) {
		return index < this.length ? this[index] : null;
	}
}
import { Element } from "./element.js";
import { Attr } from "./attr.js";
