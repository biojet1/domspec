export abstract class CharacterData extends ChildNode {
	//// Tree

	//// Dom
	// https://dom.spec.whatwg.org/#interface-characterdata
	_data: string;
	constructor(data: string) {
		super();
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

	formatXML() {
		return escape(this._data);
	}

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
			throw new Error("IndexSizeError: offset > length");
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
			throw new Error("IndexSizeError: offset > length");
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

	get nodeLength() {
		return this._data.length;
	}

	cloneNode(deep?: boolean) {
		const { ownerDocument, data } = this;
		const node = new (this.constructor as any)(data);
		if (node) node.ownerDocument = node;
		return node;
	}

	// Extra
}

export class Text extends CharacterData {
	//// Dom
	get nodeType() {
		return 3;
	}
	get nodeName() {
		return "#text";
	}
	toString() {
		return escape(this._data);
	}
}

export class CDATASection extends Text {
	constructor(data: string) {
		super(data);
		if (this._data.indexOf("]]>") >= 0) {
			throw new Error(`InvalidCharacterError`);
		}
	}
	toString() {
		return `<![CDATA[${this._data}]]>`;
	}
	formatXML() {
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
	formatXML() {
		return `<!--${this._data}-->`;
	}
}

export class ProcessingInstruction extends CharacterData {
	readonly target: string;
	constructor(target: string, data: string) {
		super(data);
		if (this._data.indexOf("?>") >= 0 || !/^[a-zA-Z][^\s]*$/.test(target) ) {
			throw new Error(`InvalidCharacterError`);
		}

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
		return `<? ${target} ${_data} ?>`;
	}
	formatXML() {
		const { target, _data } = this;
		return `<? ${target} ${_data} ?>`;
	}

	cloneNode() {
		const { ownerDocument, target, data } = this;
		const node = new ProcessingInstruction(target, data);
		if (node) node.ownerDocument = ownerDocument;
		return node;
	}
}

import { ChildNode } from "./child-node.js";

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
	return m;
};

/**
 * Safely escape HTML entities such as `&`, `<`, `>` only.
 * @param {string} es the input to safely escape
 * @returns {string} the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
const escape = (es: string) => es.replace(/[<>&\xA0]/g, pe);
