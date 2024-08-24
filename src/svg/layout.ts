import { Ray, BoundingBox, Matrix, Vector } from "svggeom";
import { SVGGraphicsElement, SVGSVGElement } from "./_element.js";
import { Element } from "../element.js";

export class SVGLayout {
	_root: SVGGraphicsElement;
	// SVGLayout: apply transforms relative to '_root'
	constructor(node: SVGGraphicsElement) {
		this._root = node;
	}
	getTM(node: SVGGraphicsElement): Matrix {
		return node._ownTM;
	}
	setTM(node: SVGGraphicsElement, m: Matrix) {
		node._ownTM = m;
		return this;
	}
	_subTM(node: SVGGraphicsElement): Matrix {
		const m = this.getTM(node);
		if (node instanceof SVGSVGElement) {
			return m.cat(node._viewportTM());
		}
		return m;
	}
	protected relTM(
		parent: SVGGraphicsElement,
		tm: Matrix,
		root?: SVGGraphicsElement | null
	): Matrix {
		while (parent != root) {
			const grand: Element | null = parent.parentElement;
			if (grand instanceof SVGGraphicsElement) {
				tm = tm.post_cat(this._subTM(parent));
				parent = grand;
			} else if (root) {
				throw new Error(`root not reached`);
			} else {
				break;
			}
		}
		return tm;
	}

	_pairTM(node: SVGGraphicsElement): Matrix[] {
		const { parentNode: parent } = node;
		const { _root } = this;
		if (parent instanceof SVGGraphicsElement) {
			return [this.relTM(parent, Matrix.identity(), _root), this.getTM(node)];
		} else {
			return [Matrix.identity(), this.getTM(node)];
		}
	}
	_localTM(node: SVGGraphicsElement): Matrix {
		// transform applied to decendants
		const { _root } = this;
		const { parentNode: parent } = node;
		if (parent instanceof SVGGraphicsElement) {
			return this.relTM(parent, this._subTM(node), _root);
		} else if (node instanceof SVGSVGElement) {
			return Matrix.identity();
		} else {
			return this._subTM(node);
		}
	}
	_rootTM(node: SVGGraphicsElement): Matrix {
		const { _root } = this;
		const { parentNode: parent } = node;
		if (parent instanceof SVGGraphicsElement) {
			return this.relTM(parent, this.getTM(node), _root);
		} else {
			return this.getTM(node);
		}
	}
	catTM(m: Matrix, ...nodes: Array<SVGGraphicsElement>) {
		nodes.forEach((node) => {
			const [P, M] = this._pairTM(node);
			this.setTM(node, P.inverse().cat(m).cat(P).cat(M));
		});
	}
	_boundingBox(
		...args: Array<
			| SVGGraphicsElement
			| BoundingBox
			| Vector
			| Ray
			| Array<SVGGraphicsElement | BoundingBox | Vector | Ray>
		>
	) {
		let bbox = BoundingBox.not();
		for (const v of args) {
			if (v instanceof Array) {
				bbox = this._boundingBox(...v).merge(bbox);
			} else if (v instanceof BoundingBox) {
				bbox = v.merge(bbox);
			} else if (v instanceof Vector || v instanceof Ray) {
				const { x, y } = v;
				bbox = BoundingBox.rect(x, y, 0, 0).merge(bbox);
			} else {
				const [p, o] = this._pairTM(v);
				try {
					bbox = v._boundingBox(p).merge(bbox);
				} catch (err) {
					console.error(`Failed to merge ${v.constructor.name}`);
					throw err;
				}
			}
		}
		return bbox;
	}
}
