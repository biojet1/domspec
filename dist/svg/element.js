import { Vec, Box, Matrix, PathLS } from "svggeom";
export class SVGTextContentElement extends SVGGraphicsElement {
}
export class SVGGeometryElement extends SVGGraphicsElement {
    describe() {
        throw new Error("NotImplemented");
    }
    getPath() {
        return PathLS.parse(this.describe());
    }
    get path() {
        try {
            return PathLS.parse(this.describe());
        }
        catch (err) {
            return new PathLS(undefined);
        }
    }
    _objectBBox(T) {
        let { path } = this;
        if (path.firstPoint) {
            if (T) {
                return path.transform(T).bbox();
            }
            return path.bbox();
        }
        return Box.not();
    }
    _shapeBox(tm) {
        let { path } = this;
        if (path.firstPoint) {
            if (tm) {
                path = path.transform(tm.cat(this._ownTM));
            }
            else {
                path = path.transform(this._rootTM);
            }
            return path.bbox();
        }
        return Box.not();
    }
    toPathElement() {
        const { ownerDocument } = this;
        if (ownerDocument) {
            const p = ownerDocument.createElementNS(this.namespaceURI, "path");
            let s;
            (s = this.describe()) && p.setAttribute("d", s);
            (s = this.getAttribute("style")) && p.setAttribute("style", s);
            (s = this.getAttribute("class")) && p.setAttribute("class", s);
            (s = this.getAttribute("transform")) && p.setAttribute("transform", s);
            return p;
        }
        throw DOMException.new(`InvalidStateError`);
    }
    getTotalLength() {
        return this.path.length;
    }
    getPointAtLength(L) {
        return this.path.pointAtLength(L, true);
    }
}
class _PathD extends PathLS {
    _node;
    constructor(node) {
        super(undefined);
        this._node = node;
    }
    assign() {
        this._node.setAttribute("d", this.toString());
        return this;
    }
}
export class SVGPathElement extends SVGGeometryElement {
    static TAGS = ["path"];
    describe() {
        return this.getAttribute("d") || "";
    }
    beginPath() {
        return new _PathD(this);
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        this.setAttribute("d", PathLS.parse(this.describe()).transform(tm).describe());
        this.removeAttribute("transform");
    }
}
export class SVGCircleElement extends SVGGeometryElement {
    static TAGS = ["circle"];
    describe() {
        const r = this.r.baseVal.value;
        const x = this.cx.baseVal.value;
        const y = this.cy.baseVal.value;
        if (r === 0)
            return "M0 0";
        return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
    }
}
export class SVGRectElement extends SVGGeometryElement {
    static TAGS = ["rect"];
    describe() {
        const width = this.width.baseVal.value;
        const height = this.height.baseVal.value;
        const x = this.x.baseVal.value;
        const y = this.y.baseVal.value;
        const rx = this.rx.baseVal.value;
        const ry = this.ry.baseVal.value;
        return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        const { a: scale_x, b: skew_x, c: skew_y, d: scale_y, e: translate_x, f: translate_y, } = tm;
        if (skew_x == 0 && skew_y == 0) {
            const { abs } = Math;
            let w = this.width.baseVal.value;
            let h = this.height.baseVal.value;
            let x = this.x.baseVal.value;
            let y = this.y.baseVal.value;
            x *= scale_x;
            x += translate_x;
            y *= scale_y;
            y += translate_y;
            this.x.baseVal.value = x;
            this.y.baseVal.value = y;
            this.width.baseVal.value = abs(w * scale_x);
            this.height.baseVal.value = abs(h * scale_y);
            this.removeAttribute("transform");
        }
        else {
            throw new Error(`fuse transform of ${this.constructor.name} with skew_x == ${skew_x}, skew_y == ${skew_y}`);
        }
    }
}
export class SVGLineElement extends SVGGeometryElement {
    static TAGS = ["line"];
    describe() {
        const x1 = this.x1.baseVal.value;
        const x2 = this.x2.baseVal.value;
        const y1 = this.y1.baseVal.value;
        const y2 = this.y2.baseVal.value;
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        if (!tm.isIdentity) {
            let x1 = this.x1.baseVal.value;
            let x2 = this.x2.baseVal.value;
            let y1 = this.y1.baseVal.value;
            let y2 = this.y2.baseVal.value;
            [x1, y1] = Vec.pos(x1, y1).transform(tm);
            [x2, y2] = Vec.pos(x2, y2).transform(tm);
            this.x1.baseVal.value = x1;
            this.x2.baseVal.value = x2;
            this.y1.baseVal.value = y1;
            this.y2.baseVal.value = y2;
        }
        this.removeAttribute("transform");
    }
}
export class SVGEllipseElement extends SVGGeometryElement {
    static TAGS = ["ellipse"];
    describe() {
        const rx = this.rx.baseVal.value;
        const ry = this.ry.baseVal.value;
        const x = this.cx.baseVal.value;
        const y = this.cy.baseVal.value;
        return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
    }
}
export class SVGPolygonElement extends SVGGeometryElement {
    static TAGS = ["polygon"];
    describe() {
        const p = this.getAttribute("points");
        return p ? `M ${p} Z` : "";
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        if (!tm.isIdentity) {
            const l = this.getAttribute("points")
                ?.split(/(\s+)/)
                .filter((e) => e.trim().length > 0)
                .map((e) => e.split(",").map((v) => parseFloat(v)))
                .map((e) => Vec.pos(e[0], e[1]))
                .map((e) => [...e.transform(tm)])
                .map((e) => `${e[0]},${e[1]}`);
            l && this.setAttribute("points", l.join(" "));
        }
        this.removeAttribute("transform");
    }
}
export class SVGPolylineElement extends SVGGeometryElement {
    static TAGS = ["polyline"];
    describe() {
        const p = this.getAttribute("points");
        return p ? `M ${p}` : "";
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        if (!tm.isIdentity) {
            const l = this.getAttribute("points")
                ?.split(/(\s+)/)
                .filter((e) => e.trim().length > 0)
                .map((e) => e.split(",").map((v) => parseFloat(v)))
                .map((e) => Vec.pos(e[0], e[1]))
                .map((e) => [...e.transform(tm)])
                .map((e) => `${e[0]},${e[1]}`);
            l && this.setAttribute("points", l.join(" "));
        }
        this.removeAttribute("transform");
    }
}
export class SVGAElement extends SVGGraphicsElement {
    static TAGS = ["a"];
}
export class SVGDefsElement extends SVGGraphicsElement {
    static TAGS = ["defs"];
    getBBox() {
        return Box.empty();
    }
}
export class SVGForeignObjectElement extends SVGGraphicsElement {
    static TAGS = ["foreignObject"];
    get _isViewportElement() {
        return 2;
    }
    _shapeBox(tm) {
        return this._viewportBox(tm);
    }
}
export class SVGGElement extends SVGGraphicsElement {
    static TAGS = ["g"];
}
export class SVGImageElement extends SVGGraphicsElement {
    static TAGS = ["image"];
    get _isViewportElement() {
        return 1;
    }
    _shapeBox(tm) {
        return this._viewportBox(tm);
    }
}
export class SVGSwitchElement extends SVGGraphicsElement {
    static TAGS = ["switch"];
}
export class SVGUseElement extends SVGGraphicsElement {
    static TAGS = ["use"];
    _shapeBox(tm) {
        const ref = this._hrefElement;
        if (ref) {
            const m = (() => {
                let [p, o] = this._pairTM();
                const x = this.x.baseVal.value;
                const y = this.y.baseVal.value;
                if (x || y) {
                    o = Matrix.translate(x, y).cat(o);
                }
                if (tm) {
                    return tm.cat(o);
                }
                else {
                    return p.cat(o);
                }
            })();
            if (ref instanceof SVGSymbolElement) {
                return ref._shapeBox(m);
            }
            else {
                return ref
                    ._shapeBox(Matrix.identity())
                    .transform(m);
            }
        }
        return Box.not();
    }
    _objectBBox(T) {
        const ref = this._hrefElement;
        if (ref) {
            const m = (() => {
                let [p, o] = this._pairTM();
                const x = this.x.baseVal.value;
                const y = this.y.baseVal.value;
                if (x || y) {
                    o = Matrix.translate(x, y).cat(o);
                }
                if (T) {
                    return T.cat(o);
                }
                else {
                    return o;
                }
            })();
            return ref._objectBBox(m);
        }
        return Box.not();
    }
}
export class SVGSymbolElement extends SVGGraphicsElement {
    static TAGS = ["symbol"];
    get _isViewportElement() {
        return 1;
    }
    _shapeBox(tm) {
        return this._viewportBox(tm);
    }
}
export class SVGTextElement extends SVGTextContentElement {
    static TAGS = ["text"];
    _shapeBox(tm) {
        const m = tm ? tm.cat(this._ownTM) : this._ownTM;
        const { x: { baseVal: { value: x }, }, y: { baseVal: { value: y }, }, } = this;
        let box = Box.new();
        box = box.merge(Box.new(Vec.at(x, y).transform(m).toArray().concat([0, 0])));
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub.localName == "tspan") {
                box = sub._boundingBox(m).merge(box);
            }
        }
        return box;
    }
}
export class SVGTSpanElement extends SVGTextContentElement {
    static TAGS = ["tspan"];
    _shapeBox(tm) {
        const m = tm ? tm.cat(this._ownTM) : this._ownTM;
        let box = Box.new();
        let s;
        const x1 = this.x.baseVal.value;
        const y1 = this.y.baseVal.value;
        const fontsize = 16;
        const x2 = x1 + 0;
        const y2 = y1 + fontsize;
        const a = Vec.at(x1, y1).transform(m);
        const b = Vec.at(x2, y2).transform(m).sub(a);
        box = box.merge(Box.new([a.x, a.y, Math.abs(b.x), Math.abs(b.y)]));
        return box;
    }
}
export class SVGTRefElement extends SVGTextContentElement {
    static TAGS = ["tref"];
}
export class SVGTextPathElement extends SVGTextContentElement {
    static TAGS = ["textPath"];
}
export class SVGClipPathElement extends SVGElement {
    static TAGS = ["clipPath"];
}
export class SVGMaskElement extends SVGElement {
    static TAGS = ["mask"];
}
export class SVGMissingGlyphElement extends SVGElement {
    static TAGS = ["missing-glyph"];
}
export class SVGGlyphElement extends SVGElement {
    static TAGS = ["glyph"];
}
export class SVGPatternElement extends SVGElement {
    static TAGS = ["pattern"];
}
export class SVGScriptElement extends SVGElement {
    static TAGS = ["script"];
    _alreadyStarted;
}
import { SVGElement, SVGSVGElement, SVGGraphicsElement } from "./_element.js";
import { DOMException } from "../event-target.js";
export { SVGLength, SVGAnimatedLength } from "./length.js";
export { SVGRect, SVGAnimatedRect } from "./rect.js";
export { SVGLayout } from "./layout.js";
export { SVGElement, SVGGraphicsElement, SVGSVGElement };
//# sourceMappingURL=element.js.map