import { Ray, Box, Matrix, Vec } from 'svggeom';
import { SVGGraphicsElement, SVGSVGElement } from './_element.js';
export class SVGLayout {
    _root;
    constructor(node) {
        this._root = node;
    }
    getTM(node) {
        return node.ownTM;
    }
    setTM(node, m) {
        node.ownTM = m;
        return this;
    }
    innerTM(node) {
        const m = this.getTM(node);
        if (node instanceof SVGSVGElement) {
            return m.cat(node.viewportTM());
        }
        return m;
    }
    relTM(parent, tm, root) {
        while (parent != root) {
            const grand = parent.parentElement;
            if (grand instanceof SVGGraphicsElement) {
                tm = tm.postCat(this.innerTM(parent));
                parent = grand;
            }
            else if (root) {
                throw new Error(`root not reached`);
            }
            else {
                break;
            }
        }
        return tm;
    }
    pairTM(node) {
        const { parentNode: parent } = node;
        const { _root } = this;
        if (!parent) {
            throw new Error(`root not reached`);
        }
        else if (parent === _root) {
        }
        else if (parent instanceof SVGGraphicsElement) {
            return [this.localTM(parent), this.getTM(node)];
        }
        return [Matrix.identity(), this.getTM(node)];
    }
    localTM(node) {
        const { _root } = this;
        const { parentNode: parent } = node;
        if (!parent) {
            throw new Error(`root not reached`);
        }
        const m = this.getTM(node);
        if (parent === _root) {
            if (node instanceof SVGSVGElement) {
                return m.cat(node.viewportTM());
            }
        }
        else if (parent instanceof SVGGraphicsElement) {
            if (node instanceof SVGSVGElement) {
                return this.localTM(parent).cat(m.cat(node.viewportTM()));
            }
            return this.localTM(parent).cat(m);
        }
        return m;
    }
    boundingBox(...args) {
        let bbox = Box.new();
        for (const v of args) {
            if (v instanceof Array) {
                bbox = this.boundingBox(...v).merge(bbox);
            }
            else if (v instanceof Box) {
                bbox = v.merge(bbox);
            }
            else if (v instanceof Vec || v instanceof Ray) {
                const { x, y } = v;
                bbox = Box.new(x, y, 0, 0).merge(bbox);
            }
            else {
                const [p, o] = this.pairTM(v);
                try {
                    bbox = v._boundingBox(p).merge(bbox);
                }
                catch (err) {
                    console.error(`Failed to merge ${v.constructor.name}`);
                    throw err;
                }
            }
        }
        return bbox;
    }
}
//# sourceMappingURL=layout.js.map