export class SVGTransformList extends Array {
    clear() {
        this.splice(0);
    }
    getItem(i) {
        return this[i];
    }
    removeItem(i) {
        const m = this[i];
        this.splice(i, 1);
        return m;
    }
    appendItem(newItem) {
        this.push(newItem);
        return newItem;
    }
    initialize(newItem) {
        this.clear();
        this.push(newItem);
        return newItem;
    }
    insertItemBefore(newItem, i) {
        let j;
        while ((j = this.indexOf(newItem)) >= 0) {
            this.splice(j, 1);
        }
        this.splice(i, 0, newItem);
    }
    replaceItem(newItem, i) {
        let j;
        while ((j = this.indexOf(newItem)) >= 0) {
            this.splice(j, 1);
            --i;
        }
        this.splice(i, 0, newItem);
    }
    createSVGTransformFromMatrix(newItem) {
        this.clear();
        const m = new SVGTransform();
        m.setMatrix(newItem);
        this.push(m);
        return m;
    }
    consolidate() {
        let { [0]: first, length: n } = this;
        const m = new SVGTransform();
        if (first) {
            m.setMatrix(first);
            let i = 1;
            while (i < n) {
                m.multiplySelf(this[i++]);
            }
        }
        return this.initialize(m);
    }
    toString() {
        let { [0]: first, length: n } = this;
        const m = new SVGTransform();
        if (first) {
            m.setMatrix(first);
            let i = 1;
            while (i < n) {
                m.multiplySelf(this[i++]);
            }
        }
        return m.toString();
    }
    get numberOfItems() {
        return this.length;
    }
    static parse(d) {
        const tl = new SVGTransformList();
        for (const str of d.split(/\)\s*,?\s*/).slice(0, -1)) {
            const kv = str.trim().split('(');
            const name = kv[0].trim();
            const args = kv[1].split(/[\s,]+/).map((str) => parseFloat(str));
            tl.appendItem(SVGTransform[name](...args));
        }
        return tl;
    }
    static new(m) {
        return new SVGTransformList(m);
    }
}
export class SVGTransform extends MatrixMut {
    θ;
    get matrix() {
        return this;
    }
    get type() {
        const { a, b, c, d, e, f, θ } = this;
        if (θ) {
            return a === 1 && d === 1 && b ^ c ? (b ? 6 : 5) : 4;
        }
        else if (!b && !c) {
            if (e || f) {
                if (a === 1 && d === 1) {
                    return 2;
                }
            }
            else if (a || d) {
                return 3;
            }
        }
        return 1;
    }
    get angle() {
        return this.θ || 0;
    }
    toString() {
        const { a, b, c, d, e, f, θ } = this;
        if (θ) {
            if (a === 1 && d === 1 && b ^ c) {
                if (b) {
                }
                else {
                }
            }
            else {
            }
        }
        else if (!b && !c) {
            if (e || f) {
                if (a === 1 && d === 1) {
                    return `translate(${e},${f})`;
                }
            }
            else if (a || d) {
                if (a === 1 && d === 1) {
                }
                else {
                    return `scale(${a},${d})`;
                }
            }
        }
        return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
    }
    setTranslate(x = 0, y = 0) {
        this.setHexad(1, 0, 0, 1, x, y);
        delete this.θ;
    }
    setScale(sx, sy) {
        this.setHexad(sx, 0, 0, sy, 0, 0);
        delete this.θ;
    }
    setRotate(ang, x = 0, y = 0) {
        let cosθ, sinθ;
        switch ((this.θ = ang)) {
            case 0:
                cosθ = 1;
                sinθ = 0;
                break;
            case 90:
                cosθ = +0;
                sinθ = +1;
                break;
            case -90:
                cosθ = +0;
                sinθ = -1;
                break;
            case 180:
                cosθ = -1;
                sinθ = +0;
                break;
            case -180:
                cosθ = -1;
                sinθ = -0;
                break;
            case 270:
                cosθ = -0;
                sinθ = -1;
                break;
            case -270:
                cosθ = -0;
                sinθ = +1;
                break;
            default:
                const θ = ((ang % 360) * PI) / 180;
                cosθ = cos(θ);
                sinθ = sin(θ);
        }
        this.setHexad(cosθ, sinθ, -sinθ, cosθ, x ? -cosθ * x + sinθ * y + x : 0, y ? -sinθ * x - cosθ * y + y : 0);
    }
    setSkewX(x) {
        this.setHexad(1, 0, tan(radians((this.θ = x))), 1, 0, 0);
    }
    setSkewY(y) {
        this.setHexad(1, tan(radians((this.θ = y))), 0, 1, 0, 0);
    }
    setMatrix(matrix) {
        const { a, b, c, d, e, f } = matrix;
        this.setHexad(a, b, c, d, e, f);
        delete this.θ;
    }
    static parse(desc) {
        const { a, b, c, d, e, f } = Matrix.parse(desc);
        return new SVGTransform([a, b, c, d, e, f]);
    }
    static translate(x = 0, y = 0) {
        return new SVGTransform([1, 0, 0, 1, x, y]);
    }
    static scale(sx, sy) {
        return new SVGTransform([sx, 0, 0, sy ?? sx, 0, 0]);
    }
    static rotate(ang, x = 0, y = 0) {
        const θ = ((ang % 360) * PI) / 180;
        const cosθ = ang === 90 ? 0 : cos(θ);
        const sinθ = ang === 90 ? 1 : sin(θ);
        return new SVGTransform([
            cosθ,
            sinθ,
            -sinθ,
            cosθ,
            x ? -cosθ * x + sinθ * y + x : 0,
            y ? -sinθ * x - cosθ * y + y : 0,
        ]);
    }
    static skewX(x) {
        return new SVGTransform([1, 0, tan(radians(x)), 1, 0, 0]);
    }
    static skewY(y) {
        return new SVGTransform([1, tan(radians(y)), 0, 1, 0, 0]);
    }
    static matrix(a, b, c, d, e, f) {
        return new SVGTransform([a, b, c, d, e, f]);
    }
    static SVG_TRANSFORM_UNKNOWN = 0;
    static SVG_TRANSFORM_MATRIX = 1;
    static SVG_TRANSFORM_TRANSLATE = 2;
    static SVG_TRANSFORM_SCALE = 3;
    static SVG_TRANSFORM_ROTATE = 4;
    static SVG_TRANSFORM_SKEWX = 5;
    static SVG_TRANSFORM_SKEWY = 6;
}
export class SVGTransformListAttr extends Attr {
    _var;
    set value(value) {
        const { _var } = this;
        if (_var instanceof SVGTransformList) {
            _var.initialize(SVGTransform.parse(value));
        }
        else if (_var instanceof Matrix) {
            this._var = Matrix.parse(value);
        }
        else {
            this._var = value;
        }
    }
    get value() {
        const { _var } = this;
        if (_var instanceof SVGTransformList) {
            return _var.consolidate()?.toString() || '';
        }
        else if (_var instanceof Matrix) {
            return _var.toString();
        }
        return _var || '';
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
            return (this._var = SVGTransformList.parse(_var));
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
            const m = _var.consolidate();
            if (m && !m.isIdentity) {
                return m.toString();
            }
        }
        else {
            return _var?.toString();
        }
    }
    saveAs(name, m) {
        const o = this.ownerElement;
        if (o) {
            const t = m == undefined ? o.getAttribute('transform') ?? '' : m.toString();
            for (const c of o.children) {
                if (c.localName == 'desc' && c.getAttribute('name') == name) {
                    c.setAttribute('tm', t);
                    return;
                }
            }
            const c = o.ownerDocument?.createElement('desc');
            if (c) {
                c.setAttribute('tm', t);
                c.setAttribute('name', name);
                o.appendChild(c);
            }
        }
        return this;
    }
    restore(name) {
        const o = this.ownerElement;
        if (o) {
            for (const c of o.children) {
                if (c.localName == 'desc' && c.getAttribute('name') == name) {
                    const tm = c.getAttribute('tm');
                    if (tm != null) {
                        o.setAttribute('transform', tm);
                        break;
                    }
                }
            }
        }
        return this;
    }
    getSaved(name) {
        const o = this.ownerElement;
        if (o) {
            for (const c of o.children) {
                if (c.localName == 'desc' && c.getAttribute('name') == name) {
                    const tm = c.getAttribute('tm');
                    if (tm != null) {
                        return Matrix.parse(tm);
                    }
                }
            }
        }
    }
    removeSaved(name) {
        const o = this.ownerElement;
        if (o) {
            for (const c of o.children) {
                if (c.localName == 'desc') {
                    const tm = c.getAttribute('tm');
                    if (tm != null) {
                        if (name == null || c.getAttribute('name') == name) {
                            c.remove();
                        }
                    }
                }
            }
        }
    }
    apply(m) {
        const { _var } = this;
        if (_var instanceof SVGTransformList) {
            const { a, b, c, d, e, f } = _var.consolidate().multiply(m);
            return _var.initialize(new SVGTransform([a, b, c, d, e, f]));
        }
        else if (_var instanceof Matrix) {
            return (this._var = _var.multiply(m));
        }
        else if (_var) {
            return (this._var = Matrix.parse(_var).multiply(m));
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
import { Matrix, MatrixMut } from 'svggeom';
import { Attr } from '../attr.js';
export function viewbox_transform(e_x, e_y, e_width, e_height, vb_x, vb_y, vb_width, vb_height, aspect) {
    let [align = 'xmidymid', meet_or_slice = 'meet'] = aspect ? aspect.toLowerCase().split(' ') : [];
    let scale_x = e_width / vb_width;
    let scale_y = e_height / vb_height;
    if (align != 'none' && meet_or_slice == 'meet') {
        scale_x = scale_y = min(scale_x, scale_y);
    }
    else if (align != 'none' && meet_or_slice == 'slice') {
        scale_x = scale_y = max(scale_x, scale_y);
    }
    let translate_x = e_x - vb_x * scale_x;
    let translate_y = e_y - vb_y * scale_y;
    if (align.indexOf('xmid') >= 0) {
        translate_x += (e_width - vb_width * scale_x) / 2.0;
    }
    if (align.indexOf('xmax') >= 0) {
        translate_x += e_width - vb_width * scale_x;
    }
    if (align.indexOf('ymid') >= 0) {
        translate_y += (e_height - vb_height * scale_y) / 2.0;
    }
    if (align.indexOf('ymax') >= 0) {
        translate_y += e_height - vb_height * scale_y;
    }
    return [translate_x, translate_y, scale_x, scale_y];
}
//# sourceMappingURL=attr-transform.js.map