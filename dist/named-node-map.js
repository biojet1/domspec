function* attributes(node) {
    let attr = node[NEXT];
    for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
        yield attr;
    }
}
function* keys(node) {
    let i = 0;
    for (const attr of attributes(node)) {
        yield i++ + "";
    }
    const { ownerDocument } = node;
    const seen = {};
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
    }
    else {
        for (const attr of attributes(node)) {
            const key = attr.name;
            if (!seen[key]) {
                seen[key] = true;
                yield key;
            }
        }
    }
}
function* ikeys(node) {
    let attr;
    let i = 0;
    for (attr = node[NEXT]; attr && attr instanceof Attr; attr = attr[NEXT]) {
        yield i++ + "";
    }
}
export class NamedNodeMap {
    #owner;
    constructor(ownerElement) {
        this.#owner = ownerElement;
        this.length;
    }
    get ownerElement() {
        return this.#owner;
    }
    getNamedItem(name) {
        return this.#owner.getAttributeNode(name);
    }
    getNamedItemNS(ns, name) {
        return this.#owner.getAttributeNodeNS(ns, name);
    }
    removeNamedItem(name) {
        const item = this.getNamedItem(name);
        item && this.#owner.removeAttributeNode(item);
        return item;
    }
    removeNamedItemNS(ns, name) {
        const item = this.getNamedItemNS(ns, name);
        item && this.#owner.removeAttributeNode(item);
        return item;
    }
    setNamedItem(attr) {
        this.#owner.setAttributeNode(attr);
    }
    setNamedItemNS(attr) {
        this.#owner.setAttributeNodeNS(attr);
    }
    item(index) {
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
    *[Symbol.iterator]() {
        let attr = this.#owner[NEXT];
        for (; attr && attr instanceof Attr; attr = attr[NEXT]) {
            yield attr;
        }
    }
}
export const AttributesHandler = {
    get(self, key, receiver) {
        switch (key) {
            case "getNamedItem":
                return (name) => self.getAttributeNode(name);
            case "getNamedItemNS":
                return (ns, name) => self.getAttributeNodeNS(ns, name);
            case "removeNamedItem":
                return (name) => {
                    const item = self.getAttributeNode(name);
                    item && self.removeAttributeNode(item);
                    return item;
                };
            case "removeNamedItemNS":
                return (ns, name) => {
                    const item = self.getAttributeNodeNS(ns, name);
                    item && self.removeAttributeNode(item);
                    return item;
                };
            case "setNamedItem":
                return (attr) => self.setAttributeNode(attr);
            case "setNamedItemNS":
                return (attr) => self.setAttributeNodeNS(attr);
            case "hasOwnProperty":
                return (name) => {
                    let i = 0;
                    for (const attr of attributes(self)) {
                        if (i++ + "" === name)
                            return true;
                    }
                    return false;
                };
            case "item":
                return (index) => {
                    if (index >= 0) {
                        for (const attr of attributes(self)) {
                            if (index-- == 0)
                                return attr;
                        }
                    }
                    else {
                        for (const attr of attributes(self)) {
                            if (index == attr.name)
                                return attr;
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
        }
        else {
            let i = parseInt(key);
            if (i >= 0) {
                for (const attr of attributes(self)) {
                    if (i-- == 0)
                        return attr;
                }
            }
            else {
                for (const attr of attributes(self)) {
                    if (key == attr.name)
                        return attr;
                }
            }
        }
        return undefined;
    },
    ownKeys(self) {
        const a = new Array(...keys(self));
        return a;
    },
    has(self, key) {
        let i = parseInt(key);
        if (i >= 0) {
            for (const attr of attributes(self)) {
                if (i-- == 0)
                    return true;
            }
        }
        else {
            for (const attr of attributes(self)) {
                if (key == attr.name)
                    return true;
            }
        }
        return false;
    },
    getOwnPropertyDescriptor(self, key) {
        let i = parseInt(key);
        if (i >= 0) {
            for (const attr of attributes(self)) {
                if (i-- == 0)
                    return { configurable: true, enumerable: true };
            }
        }
        else {
            for (const attr of attributes(self)) {
                if (key == attr.name)
                    return { configurable: true, enumerable: false };
            }
        }
    },
};
import { Attr } from "./attr.js";
import { NEXT } from "./node.js";
import { HTML_NS } from "./namespace.js";
//# sourceMappingURL=named-node-map.js.map