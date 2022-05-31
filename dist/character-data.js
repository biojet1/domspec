export class CharacterData extends ChildNode {
    _data;
    constructor(data) {
        super();
        this._data = data + "";
    }
    get nodeValue() {
        return this._data;
    }
    get textContent() {
        return this._data;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        switch (data) {
            case null:
                this._data = "";
                break;
            default:
                this._data = data + "";
        }
    }
    set textContent(data) {
        this.data = data;
    }
    set nodeValue(data) {
        this.data = data;
    }
    appendData(data) {
        switch (data) {
            case undefined:
                if (arguments.length < 1) {
                    throw new TypeError("Expecting data arguments");
                }
            default:
                const { _data } = this;
                this._data = _data + data;
        }
    }
    deleteData(offset, count) {
        this.replaceData(offset, count);
    }
    insertData(offset, data) {
        this.replaceData(offset, 0, data);
    }
    replaceData(offset, count, data) {
        const { _data } = this;
        const { length } = _data;
        let b = "";
        if (offset < 0) {
            offset = new Uint32Array([offset])[0];
        }
        if (offset > length) {
            throw DOMException.new("IndexSizeError", "offset > length");
        }
        if (count < 0) {
            count = new Uint32Array([count])[0];
        }
        if (offset + count > length) {
        }
        else {
            b = _data.slice(offset + count);
        }
        if (data) {
            this._data = _data.slice(0, offset) + data + b;
        }
        else {
            this._data = _data.slice(0, offset) + b;
        }
    }
    substringData(offset, count) {
        const { _data } = this;
        const { length } = _data;
        if (arguments.length < 2) {
            throw new TypeError("Expecting 2 arguments");
        }
        offset = new Uint32Array([offset])[0];
        if (offset > length) {
            throw DOMException.new("IndexSizeError", "offset > length");
        }
        count = new Uint32Array([count])[0];
        if (offset + count > length) {
            return _data.substr(offset);
        }
        else {
            return _data.substr(offset, count);
        }
    }
    get length() {
        return this._data.length;
    }
    cloneNode(deep) {
        const { ownerDocument, data } = this;
        const node = new this.constructor(data);
        if (node)
            node.ownerDocument = node;
        return node;
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node) {
            return false;
        }
        const { nodeType: type1, data: data1 } = this;
        const { nodeType: type2, data: data2 } = node;
        return type2 === type1 && data1 ? data1 === data2 : !data2;
    }
}
export class TextNode extends CharacterData {
    get nodeType() {
        return 3;
    }
    get nodeName() {
        return "#text";
    }
    toString() {
        return escape(this._data);
    }
    splitText(offset) {
        const { length, ownerDocument, parentNode } = this;
        if (offset > length) {
            throw DOMException.new("IndexSizeError", "offset > length");
        }
        const count = length - offset;
        const text = this.substringData(offset, count);
        const next = this.nextSibling;
        if (parentNode) {
            this.after(text);
        }
        else {
            const node = new Text(text);
            this._linkr(node);
            next && node._linkr(next);
        }
        this.replaceData(offset, count, "");
        return this.nextSibling || this;
    }
    get wholeText() {
        let wholeText = this.textContent;
        let cur;
        for (cur = this; (cur = cur[PREV]) && cur.nodeType === 3;) {
            wholeText = cur.textContent + wholeText;
        }
        for (cur = this; (cur = cur[NEXT]) && cur.nodeType === 3;) {
            wholeText += cur.textContent;
        }
        return wholeText;
    }
}
export class Text extends TextNode {
    constructor(data) {
        super(data);
        this.ownerDocument = globalThis.document;
    }
}
export class CDATASection extends Text {
    constructor(data) {
        super(data);
        if (this._data.indexOf("]]>") >= 0) {
            throw DOMException.new(`InvalidCharacterError`);
        }
    }
    toString() {
        return `<![CDATA[${this._data}]]>`;
    }
    get nodeName() {
        return "#cdata-section";
    }
    get nodeType() {
        return 4;
    }
}
export class Comment extends CharacterData {
    constructor(data) {
        super(data);
    }
    get nodeType() {
        return 8;
    }
    get nodeName() {
        return "#comment";
    }
    toString() {
        return `<!--${this._data}-->`;
    }
}
export class ProcessingInstruction extends CharacterData {
    target;
    constructor(target, data) {
        super(data);
        if (this._data.indexOf("?>") >= 0) {
            throw DOMException.new("InvalidCharacterError", `data: ${data}`);
        }
        else {
            checkName(target);
        }
        this.target = target;
    }
    get nodeType() {
        return 7;
    }
    get nodeName() {
        return this.target;
    }
    toString() {
        const { target, _data } = this;
        return `<?${target} ${_data}?>`;
    }
    cloneNode() {
        const { ownerDocument, target, data } = this;
        const node = new ProcessingInstruction(target, data);
        if (node)
            node.ownerDocument = ownerDocument;
        return node;
    }
    isEqualNode(node) {
        if (this === node) {
            return true;
        }
        else if (!node || this.nodeType !== node.nodeType) {
            return false;
        }
        const { target, data } = node;
        return this.data === data && this.target === target;
    }
}
import { NEXT, PREV } from "./node.js";
import { ChildNode } from "./child-node.js";
import { DOMException } from "./event-target.js";
import { checkName } from "./namespace.js";
const pe = function (m) {
    switch (m) {
        case "\xA0":
            return "&nbsp;";
        case "&":
            return "&amp;";
        case "<":
            return "&lt;";
        case ">":
            return "&gt;";
    }
    return m;
};
const escape = (es) => es.replace(/[<>&\xA0]/g, pe);
//# sourceMappingURL=character-data.js.map