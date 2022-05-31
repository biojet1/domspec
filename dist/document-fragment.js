import { NonElementParentNode } from "./non-element-parent-node.js";
export class DocumentFragment extends NonElementParentNode {
    get nodeType() {
        return 11;
    }
    get nodeName() {
        return "#document-fragment";
    }
    _attach(prev, next, parent) {
        const { firstChild: first, lastChild: last } = this;
        if (first && last) {
            if (parent) {
                let cur = first;
                do {
                    cur.parentNode = parent;
                    if (cur === last) {
                        break;
                    }
                } while (cur !== last && (cur = cur.nextSibling || last));
            }
            this._linkr(this[END]);
            prev._linkr(first);
            if (parent) {
                let cur = first;
                do {
                } while (cur !== last && (cur = cur.nextSibling || last));
            }
            last.endNode._linkr(next);
        }
    }
    cloneNode(deep) {
        if (deep) {
            throw new Error(`Not implemented`);
        }
        else {
            const { ownerDocument } = this;
            if (ownerDocument) {
                return ownerDocument.createDocumentFragment();
            }
            return new DocumentFragment();
        }
    }
    constructor(owner) {
        super();
        if (owner === undefined) {
            const { window } = globalThis;
            if (window) {
                this.ownerDocument = window.document;
            }
        }
        else {
            this.ownerDocument = owner;
        }
    }
    static fromTemplate(self) {
        return new TemplateFragment(self);
    }
}
export class TemplateFragment extends DocumentFragment {
    self;
    constructor(self) {
        super(self.ownerDocument);
        this[END] = self[END];
        this[NEXT] = self[NEXT];
        this.self = self;
    }
    get firstChild() {
        return this.self.firstChild;
    }
    get lastChild() {
        return this.self.lastChild;
    }
    _attach(prev, next, parent) {
        const { self } = this;
        const { firstChild: first, lastChild: last } = self;
        if (first && last) {
            if (parent) {
                let cur = first;
                do {
                    cur.parentNode = parent;
                } while (cur !== last && (cur = cur.nextSibling));
            }
            self._linkr(self[END]);
            prev._linkr(first);
            return last.endNode._linkr(next);
        }
        return next;
    }
}
import { NEXT, END } from "./node.js";
//# sourceMappingURL=document-fragment.js.map