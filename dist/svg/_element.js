import { Vec, Box, Matrix, SVGTransform } from "svggeom";
export class SVGElement extends Element {
    _newAttributeNode(name) {
        switch (name) {
            case "r":
                return new SVGAnimatedLength(name);
            case "width":
                if (this instanceof SVGSVGElement) {
                    return new SVGLengthWAttr(name);
                }
            case "x":
            case "cx":
            case "x1":
            case "x2":
                return new SVGLengthXAttr(name);
            case "height":
                if (this instanceof SVGSVGElement) {
                    return new SVGLengthHAttr(name);
                }
            case "y":
            case "cy":
            case "y1":
            case "y2":
                return new SVGLengthYAttr(name);
            case "rx":
            case "ry":
                return new SVGAnimatedLength(name);
            case "viewBox":
                return new SVGAnimatedRect(name);
            case "transform":
                return new SVGAnimatedTransformList(name);
        }
        return super._newAttributeNode(name);
    }
    get r() {
        return this._letAttributeNode("r");
    }
    get x() {
        return this._letAttributeNode("x");
    }
    get y() {
        return this._letAttributeNode("y");
    }
    get cx() {
        return this._letAttributeNode("cx");
    }
    get cy() {
        return this._letAttributeNode("cy");
    }
    get rx() {
        return this._letAttributeNode("rx");
    }
    get ry() {
        return this._letAttributeNode("ry");
    }
    get x1() {
        return this._letAttributeNode("x1");
    }
    get x2() {
        return this._letAttributeNode("x2");
    }
    get y1() {
        return this._letAttributeNode("y1");
    }
    get y2() {
        return this._letAttributeNode("y2");
    }
    get width() {
        return this._letAttributeNode("width");
    }
    get height() {
        return this._letAttributeNode("height");
    }
    get viewBox() {
        return this._letAttributeNode("viewBox");
    }
    get transform() {
        return this._letAttributeNode("transform");
    }
    get _isViewportElement() {
        return 0;
    }
    get viewportElement() {
        let parent = this;
        while ((parent = parent.parentElement)) {
            if (1 === parent._isViewportElement) {
                return parent;
            }
        }
        return null;
    }
    get ownerSVGElement() {
        let parent = this;
        while ((parent = parent.parentElement)) {
            if (parent instanceof SVGSVGElement) {
                return parent;
            }
        }
        return null;
    }
    get _ownTM() {
        return this.transform.baseVal.combine();
    }
    set _ownTM(T) {
        this.setAttribute("transform", T.toString());
    }
    get _subTM() {
        return this._ownTM;
    }
    _viewportBox(tm) {
        const width = this.width.baseVal.value;
        const height = this.height.baseVal.value;
        const x = this.x.baseVal.value;
        const y = this.y.baseVal.value;
        if (width && height) {
            let b = Box.new(x, y, width, height);
            if (tm) {
                b = b.transform(tm);
            }
            else {
                b = b.transform(this._rootTM);
            }
            return b;
        }
        return Box.not();
    }
    get _rootTM() {
        let { parentElement: parent, _ownTM: tm } = this;
        while (parent instanceof SVGGraphicsElement) {
            const { parentElement: grand } = parent;
            if (grand == null) {
                break;
            }
            tm = tm.postCat(parent._subTM);
            parent = grand;
        }
        return tm;
    }
    get _windowTM() {
        let { parentElement: parent, _ownTM: tm } = this;
        while (parent instanceof SVGGraphicsElement) {
            const { parentElement: grand, _subTM } = parent;
            tm = tm.postCat(_subTM);
            if (grand == null) {
                break;
            }
            parent = grand;
        }
        return tm;
    }
}
export class SVGGraphicsElement extends SVGElement {
    get nearestViewportElement() {
        let parent = this;
        while ((parent = parent.parentElement)) {
            if (parent._isViewportElement) {
                return parent;
            }
        }
        return null;
    }
    get farthestViewportElement() {
        let parent = this;
        let farthest = null;
        while ((parent = parent.parentElement)) {
            if (parent._isViewportElement) {
                farthest = parent;
            }
        }
        return farthest;
    }
    getBoundingClientRect() {
        return this._shapeBox(this._windowTM);
    }
    get _clipElement() {
        const v = this.getAttribute("clip-path");
        const a = v && /#([^#\(\)\s]+)/.exec(v);
        return a
            ? this.ownerDocument?.getElementById(a[1])
            : null;
    }
    set _clipElement(target) {
        if (target) {
            this.setAttribute("clip-path", `url(#${target._ensureId()})`);
        }
        else {
            this.removeAttribute("clip-path");
        }
    }
    get _hrefElement() {
        const id = this.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
            this.getAttribute("href");
        if (id) {
            return this.ownerDocument?.getElementById(id.substr(id.indexOf("#") + 1));
        }
        return null;
    }
    set _hrefElement(target) {
        target &&
            this.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${target._ensureId()}`);
    }
    _canRender() {
        if (this.getAttribute("display") === "none") {
            return false;
        }
        return true;
    }
    _relTM(tm, root) {
        let parent = this;
        while (parent != root) {
            const grand = parent.parentElement;
            if (grand instanceof SVGGraphicsElement) {
                tm = tm.postCat(parent._subTM);
                parent = grand;
            }
            else if (root) {
                if (grand) {
                    throw new Error(`root not reached`);
                }
                else {
                    const p = root._rootTM.inverse();
                    return p.cat(tm);
                }
            }
            else {
                break;
            }
        }
        return tm;
    }
    _pairTM(root) {
        const { parentElement: parent, _ownTM } = this;
        if (parent instanceof SVGGraphicsElement) {
            return [parent._relTM(Matrix.identity(), root), _ownTM];
        }
        else {
            return [Matrix.identity(), _ownTM];
        }
    }
    get _innerTM() {
        let { parentElement: parent, _subTM: tm } = this;
        if (parent) {
            while (parent instanceof SVGGraphicsElement) {
                const { parentElement: grand } = parent;
                if (null == grand) {
                    break;
                }
                tm = tm.postCat(parent._subTM);
                parent = grand;
            }
        }
        else if (this instanceof SVGSVGElement) {
            return Matrix.identity();
        }
        return tm;
    }
    _objectBBox(T) {
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub._canRender()) {
                const M = sub._ownTM;
                const E = T ? T.cat(M) : M;
                box = box.merge(sub._objectBBox(E));
            }
        }
        return box;
    }
    _boundingBox(tm) {
        const { _clipElement: clip } = this;
        if (clip) {
            if (tm) {
                return this._shapeBox(tm).overlap(clip._boundingBox(tm));
            }
            else {
                return this._shapeBox().overlap(clip._boundingBox());
            }
        }
        else {
            return this._shapeBox(tm);
        }
    }
    _shapeBox(tm) {
        const m = tm ? tm.cat(this._ownTM) : this._innerTM;
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub._canRender()) {
                box = box.merge(sub._boundingBox(m));
            }
        }
        return box;
    }
    _fuseTransform(parentT) {
        let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement) {
                sub._fuseTransform(tm);
            }
        }
        this.removeAttribute("transform");
    }
    getScreenCTM() {
        let { parentElement: parent, _ownTM: tm } = this;
        for (; parent; parent = parent.parentElement) {
            if (parent instanceof SVGGraphicsElement) {
                tm = tm.postCat(parent._subTM);
            }
            else {
                break;
            }
        }
        return tm;
    }
    getCTM() {
        let { parentElement: parent, _ownTM: tm } = this;
        for (; parent; parent = parent.parentElement) {
            if (!(parent instanceof SVGGraphicsElement)) {
                break;
            }
            tm = tm.postCat(parent._subTM);
            if (parent instanceof SVGSVGElement) {
                break;
            }
        }
        return tm;
    }
    getBBox() {
        const box = this._objectBBox();
        return box.isValid() ? box : Box.empty();
    }
    _placeChild(ref, nodes) {
        const pCtm = this._rootTM.inverse();
        for (const that of nodes) {
            if (that !== this) {
                const ctm = that._rootTM;
                if (ref) {
                    this.insertBefore(that, ref);
                }
                else {
                    this.appendChild(that);
                }
                that._ownTM = pCtm.cat(ctm);
            }
        }
    }
    _placePriorTo(ref, ...nodes) {
        return this._placeChild(ref, nodes);
    }
    _placeAppend(...nodes) {
        return this._placeChild(null, nodes);
    }
    _placeBefore(...nodes) {
        const { parentElement } = this;
        return (parentElement instanceof SVGGraphicsElement &&
            parentElement._placeChild(this, nodes));
    }
    _placeAfter(...nodes) {
        const { parentElement } = this;
        return (parentElement instanceof SVGGraphicsElement &&
            parentElement._placeChild(this.nextSibling, nodes));
    }
    _layout() {
        return new SVGLayout(this);
    }
    _viewportTM() {
        let w = this.width.baseVal.value;
        let h = this.height.baseVal.value;
        if (w && h) {
            const x = this.x.baseVal.value;
            const y = this.y.baseVal.value;
            let { x: vx, y: vy, width: vw, height: vh } = this.viewBox.baseVal;
            (vx == null || isNaN(vx)) && (vx = x);
            (vy == null || isNaN(vy)) && (vy = y);
            (vw == null || isNaN(vw)) && (vw = w);
            (vh == null || isNaN(vh)) && (vh = h);
            if (vw && vh) {
                const [tx, ty, sx, sy] = viewbox_transform(x, y, w, h, vx, vy, vw, vh, this.getAttribute("preserveAspectRatio"));
                return Matrix.translate(tx, ty).scale(sx, sy);
            }
        }
        return Matrix.identity();
    }
    _subBBox(m, params) {
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub._canRender()) {
                box = box.merge(sub._ownBBox(m, params));
            }
        }
        return box;
    }
    _ownBBox(m, params) {
        return this._subBBox(m, params);
    }
}
export class SVGSVGElement extends SVGGraphicsElement {
    static TAGS = ["svg"];
    createSVGPoint() {
        return Vec.pos(0, 0);
    }
    createSVGRect() {
        return SVGRect.forRect(0, 0, 0, 0);
    }
    createSVGLength() {
        return new SVGLength();
    }
    createSVGMatrix() {
        return new Matrix();
    }
    createSVGTransform() {
        return new SVGTransform();
    }
    createSVGTransformFromMatrix(M) {
        const m = this.createSVGTransform();
        m.setMatrix(M);
        return m;
    }
    get _isViewportElement() {
        return 1;
    }
    get _subTM() {
        return this._ownTM.cat(this._viewportTM());
    }
    _shapeBox(tm) {
        return this._viewportBox(tm);
    }
    _ownBBox(tm) {
        return this._viewportBox(tm);
    }
    _defs() {
        let { ownerDocument, children } = this;
        if (ownerDocument) {
            for (const sub of this.children) {
                if (sub.localName == "defs") {
                    return sub;
                }
            }
            const defs = ownerDocument.createElement("defs");
            this.insertAdjacentElement("afterbegin", defs);
            return defs;
        }
        throw new Error(`No ownerDocument`);
    }
}
export { Vec as SVGPoint };
import { Element } from "../element.js";
import { SVGLength, SVGAnimatedLength, SVGLengthHAttr, SVGLengthWAttr, SVGLengthXAttr, SVGLengthYAttr, } from "./length.js";
import { SVGAnimatedRect, SVGRect } from "./rect.js";
import { SVGLayout } from "./layout.js";
import { SVGAnimatedTransformList, viewbox_transform, } from "./attr-transform.js";
//# sourceMappingURL=_element.js.map