import { Point, Ray, Box, Matrix } from 'svggeom';
import { SVGGraphicsElement, SVGSVGElement } from './_element.js';

export class SVGLayout {
	_root: SVGGraphicsElement;

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
		return node.composeTM(this._root);
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

	transform(m: Matrix, node: SVGGraphicsElement) {
		const [P, M] = this.splitTM(node);
		node.ownTM = P.multiply(M).inverse().multiply(m).inverse().multiply(P);
	}

	saveTM(name: string, ...nodes: Array<SVGGraphicsElement>) {
		nodes.forEach((node) => {
			const t = node.getAttribute('transform') ?? '';
			for (const c of node.children) {
				if (c.localName == 'desc' && c.getAttribute('name') == name) {
					c.setAttribute('tm', t);
					return;
				}
			}
			const c = node.ownerDocument?.createElement('desc');
			if (c) {
				c.setAttribute('tm', t);
				c.setAttribute('name', name);
				node.appendChild(c);
			}
		});
	}

	findTM(name: string, node: SVGGraphicsElement) {
		for (const c of node.children) {
			if (c.localName == 'desc' && c.getAttribute('name') == name) {
				return c.getAttribute('tm');
			}
		}
	}

	popTM(name: string, node: SVGGraphicsElement) {
		for (const c of node.children) {
			if (c.localName == 'desc' && c.getAttribute('name') == name) {
				c.remove();
				return c.getAttribute('tm');
			}
		}
	}
}
