export class SVGRectAttr extends Attr {
	// _var?: { x: number; y: number; width: number; height: number } | string;
	_var?: BoxMut | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			try {
				const { x, y, width, height } = BoxMut.parse(value);
				_var.x = x;
				_var.y = y;
				_var.width = width;
				_var.height = height;
			} catch (err) {
				this._var = value;
			}
		} else {
			this._var = value;
		}
	}

	get value() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		}
		return _var || "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			return _var;
		} else if (_var) {
			try {
				return (this._var = BoxMut.parse(_var) as BoxMut);
			} catch (err) {
				return null;
			}
		}
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof BoxMut) {
			const { x, y, width, height } = _var;
			return `${x} ${y} ${width} ${height}`;
		} else {
			return _var?.toString();
		}
	}

	contain(
		...args: Array<
			| SVGGraphicsElement
			| Box
			| Point
			| Ray
			| Array<SVGGraphicsElement | Box | Point | Ray>
		>
	) {
		let bbox = contain(args);
		const { _var } = this;
		if (_var instanceof BoxMut) {
			_var.copy(bbox);
		} else {
			this._var = bbox;
		}
		return this;
	}

	// calcWidth(){
	// 	// https://svgwg.org/svg-next/coords.html#Units
	// 	if (_var instanceof BoxMut) {
	// 		return _var.width;
	// 	} else {
	// 		const {ownerElement} = this;
	// 		ownerElement
	// 		return _var?.toString();
	// 	}
	// }
}

function contain(
	args: Array<
		| SVGGraphicsElement
		| Box
		| Point
		| Ray
		| Array<SVGGraphicsElement | Box | Point | Ray>
	>
) {
	let bbox = BoxMut.new() as BoxMut;
	for (const v of args) {
		if (v instanceof Array) {
			bbox.mergeSelf(contain(v));
		} else if (v instanceof Box) {
			bbox.mergeSelf(v);
		} else if (v instanceof Point || v instanceof Ray) {
			const { x, y } = v;
			bbox.mergeSelf(Box.new(x, y, 0, 0));
		} else {
			try {
				bbox.mergeSelf(v.boundingBox(true));
			} catch (err) {
				console.error(`Failed to merge ${v.constructor.name} ${bbox.constructor.name}(${bbox})`);
				throw err;
			}
		}
	}
	return bbox;
}

import { BoxMut, Box, Point, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement } from "./element.js";
