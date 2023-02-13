import { Matrix, MatrixMut, SVGTransform, SVGTransformList } from "svggeom";

export class SVGTransformListAttr extends Attr {
	_var?: SVGTransformList | Matrix | string;

	set value(value: string) {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			_var.clear();
			_var._parse(value);
		} else if (_var instanceof Matrix) {
			this._var = Matrix.parse(value);
		} else {
			this._var = value;
		}
	}

	get value() {
		return this._var?.toString() ?? "";
	}

	get baseVal() {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			return _var;
		} else if (_var instanceof Matrix) {
			const { a, b, c, d, e, f } = _var;
			return (this._var = new SVGTransformList(
				new SVGTransform([a, b, c, d, e, f])
			));
		} else if (_var) {
			return (this._var = SVGTransformList._parse(_var));
		} else {
			return (this._var = new SVGTransformList());
		}
	}

	get specified() {
		return this._var != undefined;
	}

	valueOf() {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			const m = _var.combine();
			if (m && !m.isIdentity) {
				return m.toString();
			}
		} else {
			return _var?.toString();
		}
	}

	apply(m: Matrix) {
		const { _var } = this;
		if (_var instanceof SVGTransformList) {
			const { a, b, c, d, e, f } = _var.consolidate().cat(m);
			return _var.initialize(new SVGTransform([a, b, c, d, e, f]));
		} else if (_var instanceof Matrix) {
			return (this._var = _var.cat(m));
		} else if (_var) {
			return (this._var = Matrix.parse(_var).cat(m));
		} else {
			return (this._var = Matrix.new(m));
		}
		return this;
	}
}
const { tan, cos, sin, PI, min, max } = Math;
const radians = function (d: number) {
	return ((d % 360) * PI) / 180;
};

import { Attr } from "../attr.js";

export function viewbox_transform(
	e_x: number,
	e_y: number,
	e_width: number,
	e_height: number,
	vb_x: number,
	vb_y: number,
	vb_width: number,
	vb_height: number,
	aspect?: string | null
) {
	// https://svgwg.org/svg2-draft/coords.html#ComputingAViewportsTransform
	//  Let align be the align value of preserveAspectRatio, or 'xMidYMid' if preserveAspectRatio is not defined.
	let [align = "xmidymid", meet_or_slice = "meet"] = aspect
		? aspect.toLowerCase().split(" ")
		: [];
	// Initialize scale-x to e-width/vb-width.
	let scale_x = e_width / vb_width;
	// Initialize scale-y to e-height/vb-height.
	let scale_y = e_height / vb_height;
	// If align is not 'none' and meetOrSlice is 'meet', set the larger of scale-x and scale-y to the smaller.
	if (align != "none" && meet_or_slice == "meet") {
		scale_x = scale_y = min(scale_x, scale_y);
	} else if (align != "none" && meet_or_slice == "slice") {
		// Otherwise, if align is not 'none' and v is 'slice', set the smaller of scale-x and scale-y to the larger
		scale_x = scale_y = max(scale_x, scale_y);
	}
	// Initialize translate-x to e-x - (vb-x * scale-x).
	let translate_x = e_x - vb_x * scale_x;
	// Initialize translate-y to e-y - (vb-y * scale-y)
	let translate_y = e_y - vb_y * scale_y;
	// If align contains 'xMid', add (e-width - vb-width * scale-x) / 2 to translate-x.
	if (align.indexOf("xmid") >= 0) {
		translate_x += (e_width - vb_width * scale_x) / 2.0;
	}
	// If align contains 'xMax', add (e-width - vb-width * scale-x) to translate-x.
	if (align.indexOf("xmax") >= 0) {
		translate_x += e_width - vb_width * scale_x;
	}
	// If align contains 'yMid', add (e-height - vb-height * scale-y) / 2 to translate-y.
	if (align.indexOf("ymid") >= 0) {
		translate_y += (e_height - vb_height * scale_y) / 2.0;
	}
	//  If align contains 'yMax', add (e-height - vb-height * scale-y) to translate-y.
	if (align.indexOf("ymax") >= 0) {
		translate_y += e_height - vb_height * scale_y;
	}
	// translate(translate-x, translate-y) scale(scale-x, scale-y)
	return [translate_x, translate_y, scale_x, scale_y];
}

import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
// export {SVG}
