import { Ray, BoundingBox, Matrix, Vector } from "svggeom";
import { SVGGraphicsElement, SVGSVGElement } from "./_element.js";
export class SVGLayout {
    _root;
    constructor(node) {
        this._root = node;
    }
    getTM(node) {
        return node._ownTM;
    }
    setTM(node, m) {
        node._ownTM = m;
        return this;
    }
    _subTM(node) {
        const m = this.getTM(node);
        if (node instanceof SVGSVGElement) {
            return m.cat(node._viewportTM());
        }
        return m;
    }
    relTM(parent, tm, root) {
        while (parent != root) {
            const grand = parent.parentElement;
            if (grand instanceof SVGGraphicsElement) {
                tm = tm.post_cat(this._subTM(parent));
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
    _pairTM(node) {
        const { parentNode: parent } = node;
        const { _root } = this;
        if (parent instanceof SVGGraphicsElement) {
            return [this.relTM(parent, Matrix.identity(), _root), this.getTM(node)];
        }
        else {
            return [Matrix.identity(), this.getTM(node)];
        }
    }
    _localTM(node) {
        const { _root } = this;
        const { parentNode: parent } = node;
        if (parent instanceof SVGGraphicsElement) {
            return this.relTM(parent, this._subTM(node), _root);
        }
        else if (node instanceof SVGSVGElement) {
            return Matrix.identity();
        }
        else {
            return this._subTM(node);
        }
    }
    _rootTM(node) {
        const { _root } = this;
        const { parentNode: parent } = node;
        if (parent instanceof SVGGraphicsElement) {
            return this.relTM(parent, this.getTM(node), _root);
        }
        else {
            return this.getTM(node);
        }
    }
    catTM(m, ...nodes) {
        nodes.forEach((node) => {
            const [P, M] = this._pairTM(node);
            this.setTM(node, P.inverse().cat(m).cat(P).cat(M));
        });
    }
    _boundingBox(...args) {
        let bbox = BoundingBox.not();
        for (const v of args) {
            if (v instanceof Array) {
                bbox = this._boundingBox(...v).merge(bbox);
            }
            else if (v instanceof BoundingBox) {
                bbox = v.merge(bbox);
            }
            else if (v instanceof Vector || v instanceof Ray) {
                const { x, y } = v;
                bbox = BoundingBox.rect(x, y, 0, 0).merge(bbox);
            }
            else {
                const [p, o] = this._pairTM(v);
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