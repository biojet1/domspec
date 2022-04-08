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
				//
			}
			// return (this._var = BoxMut.parse("0 0 0 0") as BoxMut);
			// } else {
			// return (this._var = BoxMut.parse("0 0 0 0") as BoxMut);
		}
		return _var ?? null;
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
}

import { BoxMut } from "svggeom";
import { Attr } from "../attr.js";
