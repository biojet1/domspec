import { Matrix, SVGTransform, SVGTransformList } from "svggeom";
export class SVGAnimatedTransformList extends Attr {
    _var;
    set value(value) {
        const { _var } = this;
        if (_var instanceof SVGTransformList) {
            _var.clear();
            _var._parse(value);
        }
        else if (_var instanceof Matrix) {
            this._var = Matrix.parse(value);
        }
        else {
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
        }
        else if (_var instanceof Matrix) {
            const { a, b, c, d, e, f } = _var;
            return (this._var = new SVGTransformList(new SVGTransform([a, b, c, d, e, f])));
        }
        else if (_var) {
            return (this._var = SVGTransformList._parse(_var));
        }
        else {
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
        }
        else {
            return _var?.toString();
        }
    }
    apply(m) {
        const { _var } = this;
        if (_var instanceof SVGTransformList) {
            const { a, b, c, d, e, f } = _var.consolidate().cat(m);
            return _var.initialize(new SVGTransform([a, b, c, d, e, f]));
        }
        else if (_var instanceof Matrix) {
            return (this._var = _var.cat(m));
        }
        else if (_var) {
            return (this._var = Matrix.parse(_var).cat(m));
        }
        else {
            return (this._var = Matrix.new(m));
        }
        return this;
    }
}
const { tan, cos, sin, PI, min, max } = Math;
const radians = function (d) {
    return ((d % 360) * PI) / 180;
};
import { Attr } from "../attr.js";
export function viewbox_transform(e_x, e_y, e_width, e_height, vb_x, vb_y, vb_width, vb_height, aspect) {
    let [align = "xmidymid", meet_or_slice = "meet"] = aspect
        ? aspect.toLowerCase().split(" ")
        : [];
    let scale_x = e_width / vb_width;
    let scale_y = e_height / vb_height;
    if (align != "none" && meet_or_slice == "meet") {
        scale_x = scale_y = min(scale_x, scale_y);
    }
    else if (align != "none" && meet_or_slice == "slice") {
        scale_x = scale_y = max(scale_x, scale_y);
    }
    let translate_x = e_x - vb_x * scale_x;
    let translate_y = e_y - vb_y * scale_y;
    if (align.indexOf("xmid") >= 0) {
        translate_x += (e_width - vb_width * scale_x) / 2.0;
    }
    if (align.indexOf("xmax") >= 0) {
        translate_x += e_width - vb_width * scale_x;
    }
    if (align.indexOf("ymid") >= 0) {
        translate_y += (e_height - vb_height * scale_y) / 2.0;
    }
    if (align.indexOf("ymax") >= 0) {
        translate_y += e_height - vb_height * scale_y;
    }
    return [translate_x, translate_y, scale_x, scale_y];
}
//# sourceMappingURL=attr-transform.js.map