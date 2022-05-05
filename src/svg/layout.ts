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
				const { _root } = this;
				const parent = v.parentNode;
				let p;
				if (parent === _root) {
					p = Matrix.identity();
				} else if (parent instanceof SVGSVGElement) {
					p = this.rootTM(parent as SVGGraphicsElement).multiply(parent.viewportTM());
				} else {
					p = this.rootTM(parent as SVGGraphicsElement);
				}
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

	splitTM(node: SVGGraphicsElement): Matrix[] {
		const { parentNode: parent } = node;
		if (parent) {
			if (parent instanceof SVGGraphicsElement) {
				const { _root } = this;
				if (parent !== _root) {
					return [this.rootTM(parent), node.ownTM];
				}
			}
		}
		return [Matrix.identity(), node.ownTM];
	}

	transform(m: Matrix, ...nodes: Array<SVGGraphicsElement>) {
		nodes.forEach((node) => {
			const [P, M] = this.splitTM(node);
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
