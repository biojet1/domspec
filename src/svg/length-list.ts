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
		// console.log("parse:static", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.log("str", str);
			tl.appendItem(new SVGLength(str.trim()));
		}
		return tl;
	}
	parse(d: string): SVGLengthList {
		this.clear();
		// console.log("parse", d);
		for (const str of d.split(/[\s,]+/)) {
			// console.log("str", str);
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

export class SVGRectAttr extends Attr {
	_var?: Box | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof Box) {
			const v = value.split(/[\s,]+/).map(parseFloat);
			_var.x = v[0];
			_var.y = v[1];
			_var.width = v[2];
			_var.height = v[3];
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof Box) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof Box) {
			return _var;
		} else {
			return (this._var = Box.new(_var));
		}
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof Box) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		} else {
			return _var?.toString();
		}
	}
}

import { Box } from "svggeom";
import { Attr } from "../attr.js";
import { DOMException } from "../event-target.js";
