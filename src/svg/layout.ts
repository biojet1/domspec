import { Point, Ray, Box, Matrix } from 'svggeom';
import { SVGGraphicsElement, SVGSVGElement } from './_element.js';
export class SVGLayout {
	_root: SVGGraphicsElement;
	// SVGLayout: apply transforms relative to '_root'
	constructor(node: SVGGraphicsElement) {
		this._root = node;
	}
	boundingBox(...args: Array<SVGGraphicsElement | Box | Point | Ray | Array<SVGGraphicsElement | Box | Point | Ray>>) {
		let bbox = Box.new();
		for (const v of args) {
			if (v instanceof Array) {
				bbox = this.boundingBox(...v).merge(bbox);
			} else if (v instanceof Box) {
				bbox = v.merge(bbox);
			} else if (v instanceof Point || v instanceof Ray) {
				const { x, y } = v;
				bbox = Box.new(x, y, 0, 0).merge(bbox);
			} else {
				const [p, o] = this.pairTM(v);
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
	rootTM(node: SVGGraphicsElement) {
		const { _root } = this;
		return node.composeTM(_root);
	}
	pairTM(node: SVGGraphicsElement): Matrix[] {
		const { parentNode: parent, ownTM } = node;
		const { _root } = this;
		if (!parent) {
			throw new Error(`root not reached`);
		} else if (parent === _root) {
			// fall
		} else if (parent instanceof SVGGraphicsElement) {
			return [this.localTM(parent), ownTM];
		}
		return [Matrix.identity(), ownTM];
	}
	localTM(node: SVGGraphicsElement): Matrix {
		// transform applied to decendants
		const { _root } = this;
		const { parentNode: parent, ownTM } = node;
		if (!parent) {
			throw new Error(`root not reached`);
		} else if (parent === _root) {
			if (node instanceof SVGSVGElement) {
				return ownTM.multiply(node.viewportTM());
			}
			// fall
		} else if (parent instanceof SVGGraphicsElement) {
			if (node instanceof SVGSVGElement) {
				return this.localTM(parent).multiply(ownTM.multiply(node.viewportTM()));
			}
			return this.localTM(parent).multiply(ownTM);
		}
		return ownTM;
	}

	transform(m: Matrix, ...nodes: Array<SVGGraphicsElement>) {
		nodes.forEach((node) => {
			const [P, M] = this.pairTM(node);
			node.ownTM = P.inverse().multiply(m).multiply(P).multiply(M);
		});
	}
	toParent(parent: SVGGraphicsElement, node: SVGGraphicsElement) {
		const childTM = this.rootTM(node);
		const parentTM = this.rootTM(parent);
		parent.appendChild(node);
		node.ownTM = parentTM.inverse().multiply(childTM);
	}
}
