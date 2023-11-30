function* attributes(node: Element) {
	let attr = node[NEXT];
	for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
		yield attr;
	}
}

function* keys(node: Element) {
	let i = 0;
	for (const attr of attributes(node)) {
		yield i++ + "";
	}
	const { ownerDocument } = node;
	const seen: { [key: string]: boolean } = {};
	if (ownerDocument?.isHTML) {
		for (const attr of attributes(node)) {
			const key = attr.name;
			if (!seen[key]) {
				seen[key] = true;
				if (node.namespaceURI === HTML_NS) {
					if (/[A-Z]/.test(key)) {
						continue;
					}
				}
				yield key;
			}
		}
	} else {
		for (const attr of attributes(node)) {
			const key = attr.name;
			if (!seen[key]) {
				seen[key] = true;

				yield key;
			}
		}
	}
}

function* ikeys(node: Element) {
	let attr;
	let i = 0;
	for (attr = node[NEXT]; attr && attr instanceof Attr; attr = attr[NEXT]) {
		yield i++ + "";
	}
}
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
		return item;
	}

	removeNamedItemNS(ns: string, name: string) {
		const item = this.getNamedItemNS(ns, name);
		item && this.#owner.removeAttributeNode(item);
		return item;
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
		}
		return null;
	}

	get length() {
		let n = 0;
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

export const AttributesHandler = {
	get(self: Element, key: string | symbol, receiver?: any) {
		// console.error(`get0 ${key.toString()}`);
		switch (key) {
			case "getNamedItem":
				return (name: string) => self.getAttributeNode(name);
			case "getNamedItemNS":
				return (ns: string, name: string) =>
					self.getAttributeNodeNS(ns, name);
			case "removeNamedItem":
				return (name: string) => {
					const item = self.getAttributeNode(name);
					item && self.removeAttributeNode(item);
					return item;
				};
			case "removeNamedItemNS":
				return (ns: string, name: string) => {
					const item = self.getAttributeNodeNS(ns, name);
					item && self.removeAttributeNode(item);
					return item;
				};
			case "setNamedItem":
				return (attr: Attr) => self.setAttributeNode(attr);

			case "setNamedItemNS":
				return (attr: Attr) => self.setAttributeNodeNS(attr);

			case "hasOwnProperty":
				return (name: string) => {
					let i = 0;
					for (const attr of attributes(self)) {
						if (i++ + "" === name) return true;
					}
					return false;
				};

			case "item":
				return (index: number) => {
					if (index >= 0) {
						for (const attr of attributes(self)) {
							if ((index as number)-- == 0) return attr;
						}
					} else {
						for (const attr of attributes(self)) {
							if (index == attr.name) return attr;
						}
					}
					return null;
				};

			case "length": {
				let n = 0;
				for (const attr of attributes(self)) {
					++n;
				}
				return n;
			}
			case "toString": {
				return self.toString;
			}

			// case "cssText":
			// 	return self.cssText;
		}

		if (typeof key === "symbol") {
			if (key === Symbol.iterator) {
				return function* () {
					let attr = self[NEXT];
					for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
						yield attr;
					}
				};
			}
			// return self[Symbol.iterator];
			// console.warn(`handler: symbol ${key}`);
		} else {
			let i = parseInt(key);
			if (i >= 0) {
				for (const attr of attributes(self)) {
					if (i-- == 0) return attr;
				}
			} else {
				for (const attr of attributes(self)) {
					if (key == attr.name) return attr;
				}
			}
		}
		// console.error(`get ${key}`);
		// return self.map.get(key);
		return undefined;
	},

	ownKeys(self: Element) {
		const a = new Array(...keys(self));
		// console.error(`ownKeys`, a);
		return a;
	},

	has(self: Element, key: string) {
		let i = parseInt(key);
		if (i >= 0) {
			for (const attr of attributes(self)) {
				if (i-- == 0) return true;
			}
		} else {
			for (const attr of attributes(self)) {
				if (key == attr.name) return true;
			}
		}
		return false;
	},
	getOwnPropertyDescriptor(self: Element, key: string) {
		let i = parseInt(key);
		if (i >= 0) {
			for (const attr of attributes(self)) {
				if (i-- == 0) return { configurable: true, enumerable: true };
			}
		} else {
			for (const attr of attributes(self)) {
				if (key == attr.name)
					return { configurable: true, enumerable: false };
			}
		}
	},
};
import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { NEXT } from "./node.js";
import { HTML_NS } from "./namespace.js";
