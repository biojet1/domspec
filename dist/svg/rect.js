function _format(box) {
    return box
        .toArray()
        .map((n, i) => {
        const v = n.toFixed(3);
        return v.indexOf(".") < 0 ? v : v.replace(/0+$/g, "").replace(/\.$/g, "");
    })
        .join(" ");
}
export class SVGAnimatedRect extends Attr {
    _var;
    set value(value) {
        const { _var } = this;
        if (_var instanceof SVGRect) {
            try {
                const { x, y, width, height } = SVGRect.parse(value);
                _var.x = x;
                _var.y = y;
                _var.width = width;
                _var.height = height;
            }
            catch (err) {
                this._var = value;
            }
        }
        else {
            this._var = value;
        }
    }
    get value() {
        const { _var } = this;
        if (_var instanceof SVGRect) {
            return _format(_var);
        }
        return _var || "";
    }
    get baseVal() {
        const { _var } = this;
        if (_var instanceof SVGRect) {
            return _var;
        }
        {
            let box;
            try {
                if (_var) {
                    box = SVGRect.parse(_var);
                }
            }
            finally {
                if (!box) {
                    box = SVGRect.forRect(0, 0, NaN, NaN);
                }
                return (this._var = box);
            }
        }
    }
    get animVal() {
        return this.baseVal;
    }
    get specified() {
        const { _var } = this;
        return !!(_var && (!(_var instanceof SVGRect) || _var.isValid()));
    }
    valueOf() {
        const { _var } = this;
        if (_var instanceof SVGRect) {
            if (_var.isValid()) {
                return _format(_var);
            }
        }
        else if (_var) {
            return _var;
        }
    }
    _closeIn(...args) {
        let bbox = contain(args);
        const o = this.ownerElement;
        if (o instanceof SVGGraphicsElement) {
            bbox = bbox.transform(o._innerTM.inverse());
        }
        const { _var } = this;
        if (_var instanceof SVGRect) {
            _var.copy(bbox);
        }
        else {
            this._var = SVGRect.new(bbox);
        }
        return this;
    }
    _calcWidth() {
        const { _var } = this;
        if (_var) {
            const { baseVal } = this;
            if (baseVal && baseVal.isValid()) {
                return baseVal.width;
            }
        }
        const o = this.ownerElement;
        if (o) {
            const a = o.width;
            if (a.specified) {
                return a.baseVal.value;
            }
            const v = o.nearestViewportElement;
            if (v) {
                return v.viewBox._calcWidth();
            }
            const p = o.parentElement;
            if (p) {
                const csm = p.computedStyleMap();
                const q = csm.get("width");
                if (q) {
                    let r = new SVGLength();
                    if (r.parse(q.toString())) {
                        return r.value;
                    }
                }
            }
        }
        return 100;
    }
    _calcHeight() {
        const { _var } = this;
        if (_var) {
            const { baseVal } = this;
            if (baseVal && baseVal.isValid()) {
                return baseVal.height;
            }
        }
        const o = this.ownerElement;
        if (o) {
            const a = o.height;
            if (a.specified) {
                return a.baseVal.value;
            }
            else {
                const v = o.nearestViewportElement;
                if (v) {
                    const n = v.viewBox._calcHeight();
                    return n;
                }
            }
            {
                const p = o.parentElement;
                if (p) {
                    const csm = p.computedStyleMap();
                    const q = csm.get("height");
                    if (q) {
                        let r = new SVGLength();
                        if (r.parse(q.toString())) {
                            return r.value;
                        }
                    }
                }
            }
        }
        return 100;
    }
    _calcBox() {
        const { _var } = this;
        if (_var) {
            const { baseVal } = this;
            if (baseVal && baseVal.isValid()) {
                return baseVal;
            }
        }
        let x = 0, y = 0, w = 100, h = 100;
        const o = this.ownerElement;
        if (o) {
            x = o.x.baseVal.value;
            y = o.y.baseVal.value;
            w = this._calcWidth();
            h = this._calcHeight();
        }
        return Box.forRect(x, y, w, h);
    }
}
function contain(args) {
    let bbox = SVGRect.new();
    for (const v of args) {
        if (v instanceof Array) {
            bbox.mergeSelf(contain(v));
        }
        else if (v instanceof Box) {
            bbox.mergeSelf(v);
        }
        else if (v instanceof Vec || v instanceof Ray) {
            const { x, y } = v;
            bbox.mergeSelf(Box.new(x, y, 0, 0));
        }
        else {
            try {
                bbox.mergeSelf(v._boundingBox());
            }
            catch (err) {
                console.error(`Failed to merge ${v.constructor.name} ${bbox.constructor.name}(${bbox})`);
                throw err;
            }
        }
    }
    return bbox;
}
import { BoxMut as SVGRect } from "svggeom";
import { Box, Vec, Ray } from "svggeom";
import { Attr } from "../attr.js";
import { SVGGraphicsElement } from "./element.js";
import { SVGLength } from "./length.js";
export { SVGRect };
//# sourceMappingURL=rect.js.map