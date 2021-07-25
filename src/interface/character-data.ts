
export abstract class CharacterData extends ChildNode {
	//// Tree

	//// Dom
	// https://dom.spec.whatwg.org/#interface-characterdata
	private data: string;
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
}

export class Text extends CharacterData {
	//// Dom
	get nodeType() {
		return 3;
	}
	get nodeName() {
		return "#data";
	}
}

export class CDATASection extends Text {}

import { ChildNode } from "./child-node.js";
