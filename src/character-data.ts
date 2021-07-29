export abstract class CharacterData extends ChildNode {
	//// Tree

	//// Dom
	// https://dom.spec.whatwg.org/#interface-characterdata
	data: string;
	constructor(data: string) {
		super();
		this.data = data;
	}

	get nodeValue() {
		// https://dom.spec.whatwg.org/#dom-node-nodevalue
		return this.data;
	}
	get textContent() {
		// https://dom.spec.whatwg.org/#dom-node-textcontent
		return this.data;
	}
	set textContent(data: string) {
		this.data = data;
	}
	appendData(data: string) {
		this.data += data;
	}
	deleteData(offset: number, count: number) {
		this.data =
			this.data.slice(0, offset) + this.data.slice(0, offset + count);
	}
	insertData(offset: number, data: string) {
		this.data = this.data.slice(0, offset) + data + this.data.slice(offset);
	}
	replaceData(offset: number, count: number, data: string) {
		this.deleteData(offset, count);
		this.insertData(offset, data);
	}
	substringData(offset: number, count: number) {
		this.data = this.data.substr(offset, count);
	}
	get length() {
		return this.data.length;
	}

	get nodeLength() {
		return this.data.length;
	}
	// Extra
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
		return `<!--${escape(this.data)}-->`;
	}
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
		return escape(this.data);
	}
}

export class CDATASection extends Text {
	toString() {
		return `<![CDATA[${this.data}]]>`;
	}
	get nodeName() {
		return "#cdata-section";
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
