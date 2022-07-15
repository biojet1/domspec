import { Box, Matrix } from 'svggeom';
export class SVGElement extends Element {
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
    createSVGLength() {
        return new SVGLength();
    }
    createSVGMatrix() {
        return new Matrix();
    }
    createSVGTransformFromMatrix(M) {
        const m = new SVGTransform();
        m.setMatrix(M);
        return m;
    }
}
export class SVGGraphicsElement extends SVGElement {
    newAttributeNode(name) {
        switch (name) {
            case 'r':
                return new SVGLengthAttr(name);
            case 'width':
                if (this instanceof SVGSVGElement) {
                    return new SVGLengthWAttr(name);
                }
            case 'x':
            case 'cx':
            case 'x1':
            case 'x2':
                return new SVGLengthXAttr(name);
            case 'height':
                if (this instanceof SVGSVGElement) {
                    return new SVGLengthHAttr(name);
                }
            case 'y':
            case 'cy':
            case 'y1':
            case 'y2':
                return new SVGLengthYAttr(name);
            case 'rx':
            case 'ry':
                return new SVGLengthAttr(name);
            case 'viewBox':
                return new SVGRectAttr(name);
            case 'transform':
                return new SVGTransformListAttr(name);
        }
        return super.newAttributeNode(name);
    }
    get r() {
        return this.letAttributeNode('r');
    }
    get x() {
        return this.letAttributeNode('x');
    }
    get y() {
        return this.letAttributeNode('y');
    }
    get cx() {
        return this.letAttributeNode('cx');
    }
    get cy() {
        return this.letAttributeNode('cy');
    }
    get rx() {
        return this.letAttributeNode('rx');
    }
    get ry() {
        return this.letAttributeNode('ry');
    }
    get x1() {
        return this.letAttributeNode('x1');
    }
    get x2() {
        return this.letAttributeNode('x2');
    }
    get y1() {
        return this.letAttributeNode('y1');
    }
    get y2() {
        return this.letAttributeNode('y2');
    }
    get width() {
        return this.letAttributeNode('width');
    }
    get height() {
        return this.letAttributeNode('height');
    }
    get viewBox() {
        return this.letAttributeNode('viewBox');
    }
    get transform() {
        return this.letAttributeNode('transform');
    }
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
    get ownTM() {
        return this.transform.baseVal.consolidate();
    }
    set ownTM(T) {
        this.setAttribute('transform', T.toString());
    }
    get clipElement() {
        const v = this.getAttribute('clip-path');
        const a = v && /#([^#\(\)\s]+)/.exec(v);
        return a ? this.ownerDocument?.getElementById(a[1]) : null;
    }
    set clipElement(target) {
        if (target) {
            this.setAttribute('clip-path', `url(#${target.letId()})`);
        }
        else {
            this.removeAttribute('clip-path');
        }
    }
    get hrefElement() {
        const id = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || this.getAttribute('href');
        if (id) {
            return this.ownerDocument?.getElementById(id.substr(id.indexOf('#') + 1));
        }
        return null;
    }
    set hrefElement(target) {
        target && this.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${target.letId()}`);
    }
    canRender() {
        if (this.getAttribute('display') === 'none') {
            return false;
        }
        return true;
    }
    get innerTM() {
        return this.ownTM;
    }
    get rootTM() {
        return this.composeTM(this.farthestViewportElement);
    }
    splitTM() {
        const { parentNode: parent } = this;
        if (parent) {
            if (parent instanceof SVGGraphicsElement) {
                if (parent.parentNode) {
                    if (parent instanceof SVGSVGElement) {
                        return [parent.rootTM.cat(parent.viewportTM()), this.ownTM];
                    }
                    return [parent.rootTM, this.ownTM];
                }
            }
        }
        return [Matrix.identity(), this.ownTM];
    }
    localTM() {
        const { parentNode: parent, ownTM } = this;
        if (!parent) {
            if (this instanceof SVGSVGElement) {
                return Matrix.identity();
            }
        }
        else if (parent instanceof SVGGraphicsElement) {
            if (this instanceof SVGSVGElement) {
                return parent.localTM().cat(ownTM.cat(this.viewportTM()));
            }
            return parent.localTM().cat(ownTM);
        }
        return ownTM;
    }
    docTM() {
        const { parentNode: parent, ownTM } = this;
        if (!parent) {
            if (this instanceof SVGSVGElement) {
                return Matrix.identity();
            }
        }
        else if (parent instanceof SVGGraphicsElement) {
            return parent.localTM().cat(ownTM);
        }
        return ownTM;
    }
    pairTM() {
        const { parentNode: parent, ownTM } = this;
        if (parent instanceof SVGGraphicsElement) {
            return [parent.localTM(), ownTM];
        }
        return [Matrix.identity(), ownTM];
    }
    composeTM(root) {
        const { parentNode, ownTM } = this;
        let tm = Matrix.new(ownTM);
        let parent = parentNode;
        while (parent != root) {
            if (!parent) {
                throw new Error(`root not reached`);
            }
            else if (parent instanceof SVGGraphicsElement) {
                tm = tm.postCat(parent.innerTM);
            }
            parent = parent.parentNode;
        }
        return tm;
    }
    shapeBox(T) {
        return this._shapeBox(T);
    }
    boundingBox(T) {
        return this._boundingBox(T);
    }
    getBBox() {
        const box = this.objectBBox();
        return box.isValid() ? box : Box.empty();
    }
    fuseTransform(parentT) {
        let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement) {
                sub.fuseTransform(tm);
            }
        }
        this.removeAttribute('transform');
    }
    _descendantTM(node) {
        return node.composeTM(this);
    }
    objectBBox(T) {
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub.canRender()) {
                const M = sub.ownTM;
                const E = T ? T.cat(M) : M;
                box = box.merge(sub.objectBBox(E));
            }
        }
        return box;
    }
    _objectBBox(T) {
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub.canRender()) {
                const M = sub.ownTM;
                const E = T ? T.cat(M) : M;
                box = box.merge(sub.objectBBox(E));
            }
        }
        return box;
    }
    _boundingBox(tm) {
        const { clipElement: clip } = this;
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
        const m = tm ? tm.cat(this.ownTM) : this.rootTM;
        let box = Box.new();
        for (const sub of this.children) {
            if (sub instanceof SVGGraphicsElement && sub.canRender()) {
                box = box.merge(sub._boundingBox(m));
            }
        }
        return box;
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
                b = b.transform(this.rootTM);
            }
            return b;
        }
        return Box.not();
    }
    calcWidth() {
        const w = this.getAttribute('width');
        if (w) {
        }
    }
    _placeTo(that, ref) {
        that.appendChild(this);
        if (that === this)
            return that;
        const ctm = that.composeTM();
        const pCtm = this.composeTM().inverse();
        if (ref) {
            this.insertBefore(that, ref);
        }
        else {
            this.appendChild(that);
        }
        that.ownTM = pCtm.cat(ctm);
        return that;
    }
    layout() {
        return new SVGLayout(this);
    }
    popTM(name) {
        if (name == null) {
            for (const c of this.children) {
                if (c.localName == 'desc' && c.hasAttribute('name')) {
                    c.remove();
                }
            }
        }
        else {
            for (const c of this.children) {
                if (c.localName == 'desc' && c.getAttribute('name') == name) {
                    c.remove();
                    const tm = c.getAttribute('tm');
                    if (tm) {
                        return tm;
                    }
                    else {
                        return '';
                    }
                }
            }
        }
    }
}
export class SVGSVGElement extends SVGGraphicsElement {
    static TAGS = ['svg'];
    get _isViewportElement() {
        return 1;
    }
    get innerTM() {
        return this.ownTM.cat(this.viewportTM());
    }
    viewportTM() {
        const w = this.width.baseVal.value;
        const h = this.height.baseVal.value;
        const x = this.x.baseVal.value;
        const y = this.y.baseVal.value;
        if (!(w && h)) {
            return Matrix.identity();
        }
        const a = this.getAttribute('viewBox');
        let vx, vy, vw, vh;
        if (a) {
            const { x: _x, y: _y, width: _width, height: _height } = Box.parse(a);
            vx = _x;
            vy = _y;
            vw = _width;
            vh = _height;
        }
        else {
            return Matrix.identity();
        }
        const [tx, ty, sx, sy] = viewbox_transform(x, y, w, h, vx, vy, vw, vh, this.getAttribute('preserveAspectRatio'));
        return Matrix.translate(tx, ty).scale(sx, sy);
    }
    shapeBox(T) {
        return this._shapeBox(T);
    }
    _shapeBox(tm) {
        return this._viewportBox(tm);
    }
    defs() {
        let { ownerDocument, children } = this;
        if (ownerDocument) {
            for (const sub of this.children) {
                if (sub.localName == 'defs') {
                    return sub;
                }
            }
            const defs = ownerDocument.createElement('defs');
            this.insertAdjacentElement('afterbegin', defs);
            return defs;
        }
        throw new Error(`No ownerDocument`);
    }
    geom2UU() {
        this.width.baseVal.convertToSpecifiedUnits(1);
        this.height.baseVal.convertToSpecifiedUnits(1);
        for (const x in [
            'r',
            'x',
            'y',
            'cx',
            'cy',
            'rx',
            'ry',
            'x1',
            'x2',
            'y1',
            'y2',
            'width',
            'height',
        ]) {
            this.getAttributeNode(x);
        }
    }
}
import { Element } from '../element.js';
import { SVGLength, SVGLengthAttr, SVGLengthHAttr, SVGLengthWAttr, SVGLengthXAttr, SVGLengthYAttr, } from './length.js';
import { SVGRectAttr } from './rect.js';
import { SVGLayout } from './layout.js';
import { SVGTransformListAttr, SVGTransform, viewbox_transform } from './attr-transform.js';
//# sourceMappingURL=_element.js.map