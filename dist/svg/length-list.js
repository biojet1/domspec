import { SVGLength } from "./length.js";
export class SVGLengthList extends Array {
    clear() {
        this.splice(0);
    }
    initialize(newItem) {
        if (newItem instanceof SVGLength) {
            this.clear();
            this.push(newItem);
            return newItem;
        }
        throw TypeError();
    }
    getItem(i) {
        return this[i];
    }
    removeItem(i) {
        const m = this[i];
        this.splice(i, 1);
        return m;
    }
    appendItem(newItem) {
        this.push(newItem);
        return newItem;
    }
    insertItemBefore(newItem, i) {
        let j;
        while ((j = this.indexOf(newItem)) >= 0) {
            this.splice(j, 1);
        }
        if (newItem instanceof SVGLength) {
            this.splice(i, 0, newItem);
            return newItem;
        }
        else {
            const n = new SVGLength(newItem);
            this.splice(i, 0, n);
            return n;
        }
    }
    replaceItem(newItem, i) {
        let j;
        while ((j = this.indexOf(newItem)) >= 0) {
            this.splice(j, 1);
            --i;
        }
        this.splice(i, 0, newItem);
    }
    toString() {
        return this.join(" ");
    }
    get numberOfItems() {
        return this.length;
    }
    static parse(d) {
        const tl = new SVGLengthList();
        for (const str of d.split(/[\s,]+/)) {
            tl.appendItem(new SVGLength(str.trim()));
        }
        return tl;
    }
    parse(d) {
        this.clear();
        for (const str of d.split(/[\s,]+/)) {
            this.appendItem(new SVGLength(str.trim()));
        }
        return this;
    }
}
export class SVGLengthListAttr extends Attr {
    _var;
    set value(value) {
        const { _var } = this;
        if (_var instanceof SVGLengthList) {
            _var.parse(value);
        }
        else {
            this._var = value;
        }
    }
    get value() {
        const { _var } = this;
        if (_var instanceof SVGLengthList) {
            return _var.toString() || "";
        }
        return _var ?? "";
    }
    get baseVal() {
        const { _var } = this;
        if (_var instanceof SVGLengthList) {
            return _var;
        }
        else if (_var) {
            return (this._var = SVGLengthList.parse(_var));
        }
        else {
            return (this._var = new SVGLengthList());
        }
    }
    valueOf() {
        return this._var?.toString();
    }
}
import { Attr } from "../attr.js";
//# sourceMappingURL=length-list.js.map