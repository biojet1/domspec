import { SVGLength } from "./length.js";

export class SVGLengthList extends Array<SVGLength> {
	clear() {
		this.splice(0);
	}
	initialize(newItem: SVGLength) {
		if (newItem instanceof SVGLength) {
			this.clear();
			this.push(newItem);
			return newItem;
		}
		throw TypeError();
	}

	getItem(i: number) {
		return this[i];
	}

	removeItem(i: number) {
		const m = this[i];
		this.splice(i, 1);
		return m;
	}
	appendItem(newItem: SVGLength) {
		this.push(newItem);
		return newItem;
	}
	insertItemBefore(newItem: SVGLength, i: number) {
		let j;
		while ((j = this.indexOf(newItem)) >= 0) {
			this.splice(j, 1);
		}
		if (newItem instanceof SVGLength) {
			this.splice(i, 0, newItem);
			return newItem;
		} else {
			const n = new SVGLength(newItem);
			this.splice(i, 0, n);
			return n;
		}
	}
	replaceItem(newItem: SVGLength, i: number) {
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

	public static parse(d: string): SVGLengthList {
		const tl = new SVGLengthList();
		// console.warn("parse:static", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.warn("str", str);
			tl.appendItem(new SVGLength(str.trim()));
		}
		return tl;
	}
	parse(d: string): SVGLengthList {
		this.clear();
		// console.warn("parse", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.warn("str", str);
			this.appendItem(new SVGLength(str.trim()));
		}
		return this;
	}
}

export class SVGLengthListAttr extends Attr {
	_var?: SVGLengthList | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGLengthList) {
			_var.parse(value);
		} else {
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
		} else if (_var) {
			return (this._var = SVGLengthList.parse(_var));
		} else {
			return (this._var = new SVGLengthList());
		}
	}

	valueOf() {
		return this._var?.toString();
	}
}


import { Attr } from "../attr.js";
import { DOMException } from "../event-target.js";
