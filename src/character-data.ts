export abstract class CharacterData extends ChildNode {
	//// Tree

	//// Dom
	// https://dom.spec.whatwg.org/#interface-characterdata
	_data: string;
	constructor(data?: string) {
		super();
		// this._data = data ? data + "" : data === undefined ? "" : data + "";
		this._data = data + "";
	}

	get nodeValue() {
		// https://dom.spec.whatwg.org/#dom-node-nodevalue
		return this._data;
	}

	get textContent() {
		// https://dom.spec.whatwg.org/#dom-node-textcontent
		return this._data;
	}

	// toString() {
	// 	return escape(this._data);
	// }

	get data() {
		return this._data;
	}

	set data(data: string) {
		switch (data) {
			case null:
				this._data = "";
				break;
			default:
				this._data = data + "";
		}
	}

	set textContent(data: string) {
		this.data = data;
	}

	set nodeValue(data: string) {
		this.data = data;
	}

	appendData(data: string) {
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

	deleteData(offset: number, count: number) {
		this.replaceData(offset, count);
	}

	insertData(offset: number, data: string) {
		this.replaceData(offset, 0, data);
	}

	replaceData(offset: number, count: number, data?: string) {
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
			// b = _data.slice(offset);
			//pass;
		} else {
			b = _data.slice(offset + count);
		}

		if (data) {
			this._data = _data.slice(0, offset) + data + b;
		} else {
			this._data = _data.slice(0, offset) + b;
		}
	}

	substringData(offset: number, count: number) {
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
			// b = _data.slice(offset);
			//pass;
			return _data.substr(offset);
		} else {
			return _data.substr(offset, count);
		}
	}

	get length() {
		return this._data.length;
	}

	// get nodeLength() {
	// 	return this._data.length;
	// }

	cloneNode(deep?: boolean) {
		const { ownerDocument, data } = this;
		const node = new (this.constructor as any)(data);
		if (node) node.ownerDocument = node;
		return node;
	}

	isEqualNode(node: Node): boolean {
		if (this === node) {
			return true;
		} else if (!node) {
			return false;
		}
		const { nodeType: type1, data: data1 } = this;
		const { nodeType: type2, data: data2 } = node as CharacterData;
		return type2 === type1 && data1 ? data1 === data2 : !data2;

		// return this.data === (node as CharacterData).data;
	}

	// Extra
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
	splitText(offset: number) {
		const { length, ownerDocument, parentNode } = this;

		if (offset > length) {
			throw DOMException.new("IndexSizeError", "offset > length");
		}

		const count = length - offset;

		const text = this.substringData(offset, count);

		const next = this.nextSibling;
		if (parentNode) {
			this.after(text);
		} else {
			const node = new Text(text);
			this._linkr(node);
			next /* c8 ignore next */ && node._linkr(next);
		}

		this.replaceData(offset, count, "");
		return this.nextSibling /* c8 ignore next */ || this;
	}
	get wholeText() {
		let wholeText = this.textContent;
		let cur: Node | undefined;
		for (cur = this; (cur = cur[PREV]) && cur.nodeType === 3; ) {
			wholeText = (cur as Text).textContent + wholeText;
		}
		for (cur = this; (cur = cur[NEXT]) && cur.nodeType === 3; ) {
			wholeText += (cur as Text).textContent;
		}
		return wholeText;
	}
}

export class Text extends TextNode {
	constructor(data?: string) {
		super(data);
		this.ownerDocument = globalThis.document as any as Document;
	}
}

export class CDATASection extends Text {
	constructor(data: string) {
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
	constructor(data: string) {
		super(data);
		// if (this._data.indexOf("--") >= 0) {
		// 	throw DOMException.new("InvalidCharacterError");
		// }
	}
	//// Dom
	get nodeType() {
		return 8;
	}
	get nodeName() {
		return "#comment";
	}
	// Extra
	toString() {
		return `<!--${this._data}-->`;
	}
}

// const NameStartChar =
// 	/^[A-Za-z:_\uC0-\uD6\uD8-\uF6\uF8-\u2FF\u370-\u37D\u37F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u10000-\uEFFFF]+[-\.0-9\uB7\u0300-\u036F\u203F-\u2040]*$/;
// // const NameExtra = /^[-\.0-9\uB7\u0300-\u036F\u203F-\u2040]$/;

// function isXMLName(s){
// 	NameStartChar.test(target)
// }

export class ProcessingInstruction extends CharacterData {
	readonly target: string;
	constructor(target: string, data: string) {
		super(data);

		if (this._data.indexOf("?>") >= 0) {
			throw DOMException.new("InvalidCharacterError", `data: ${data}`);
		} else {
			checkName(target);
		}
		// if (
		// 	this._data.indexOf("?>") >= 0 ||
		// 	!(
		// 		/^[A-Za-z:_]+[\w:\.-\xB7]*$/.test(target) || 0
		// 		// /^[A-Za-z:_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][-\w:\.\u00B7\u0300-\u036F\u203F-\u2040\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]+[\.0-9\u00B7\u0300-\u036F\u203F-\u2040-][A-Za-z:_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*$/.test(
		// 		// 	target
		// 		// )
		// 	)
		// ) {
		// 	throw DOMException.new(
		// 		"InvalidCharacterError",
		// 		`${target} ${data}`
		// 	);
		// }
		this.target = target;
	}
	//// Dom
	get nodeType() {
		return 7;
	}
	get nodeName() {
		return this.target;
	}
	// Extra
	toString() {
		const { target, _data } = this;
		return `<?${target} ${_data}?>`;
	}

	cloneNode() {
		const { ownerDocument, target, data } = this;
		const node = new ProcessingInstruction(target, data);
		if (node) node.ownerDocument = ownerDocument;
		return node;
	}

	isEqualNode(node: Node) {
		if (this === node) {
			return true;
		} else if (!node || this.nodeType !== node.nodeType) {
			return false;
		}
		const { target, data } = node as ProcessingInstruction;
		return this.data === data && this.target === target;
	}
}

import { NEXT, PREV, Node } from "./node.js";
import { ChildNode } from "./child-node.js";
import { Document } from "./document.js";
import { DOMException } from "./event-target.js";
import { checkName } from "./namespace.js";

// escape

const pe = function (m: string) {
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
	/* c8 ignore next */
	return m;
};

/**
 * Safely escape HTML_NS entities such as `&`, `<`, `>` only.
 * @param {string} es the input to safely escape
 * @returns {string} the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
const escape = (es: string) => es.replace(/[<>&\xA0]/g, pe);
