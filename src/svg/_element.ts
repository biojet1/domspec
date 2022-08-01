import { Vec, Box, Matrix, Path } from 'svggeom';
export class SVGElement extends Element {
	get _isViewportElement() {
		return 0;
	}
	// get _nearestVP(): SVGElement | null {
	// 	let cur: SVGElement = this;
	// 	do {
	// 		if (1 === cur._isViewportElement) {
	// 			return cur;
	// 		}
	// 	} while ((cur = cur.parentElement as SVGElement));
	// 	return null;
	// }
	get viewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (1 === parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}
	get ownerSVGElement(): SVGSVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
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
	createSVGTransformFromMatrix(M: Matrix) {
		const m = new SVGTransform();
		m.setMatrix(M);
		return m;
	}
}
export class SVGGraphicsElement extends SVGElement {
	newAttributeNode(name: string) {
		// console.log("newAttributeNode", name);
		switch (name) {
			case 'r':
				return new SVGLengthAttr(name);
			case 'width':
				if (this instanceof SVGSVGElement) {
					return new SVGLengthWAttr(name);
				} // fall

			case 'x':
			case 'cx':
			case 'x1':
			case 'x2':
				return new SVGLengthXAttr(name);
			case 'height':
				if (this instanceof SVGSVGElement) {
					return new SVGLengthHAttr(name);
				} // fall
			case 'y':
			case 'cy':
			case 'y1':
			case 'y2':
				return new SVGLengthYAttr(name);
			case 'rx':
			case 'ry':
				// TODO
				return new SVGLengthAttr(name);
			case 'viewBox':
				return new SVGRectAttr(name);
			// return new SVGLengthListAttr(name);
			case 'transform':
				return new SVGTransformListAttr(name);
			// case "points":
			// 	return new SVGNumberListAttr(name);
		}
		return super.newAttributeNode(name);
	}
	get r(): SVGLengthAttr {
		return this.letAttributeNode('r') as SVGLengthAttr; // for now
	}
	get x(): SVGLengthAttr {
		return this.letAttributeNode('x') as SVGLengthAttr; // for now
	}
	get y(): SVGLengthAttr {
		return this.letAttributeNode('y') as SVGLengthAttr; // for now
	}
	get cx(): SVGLengthAttr {
		return this.letAttributeNode('cx') as SVGLengthAttr; // for now
	}
	get cy(): SVGLengthAttr {
		return this.letAttributeNode('cy') as SVGLengthAttr; // for now
	}
	get rx(): SVGLengthAttr {
		return this.letAttributeNode('rx') as SVGLengthAttr; // for now
	}
	get ry(): SVGLengthAttr {
		return this.letAttributeNode('ry') as SVGLengthAttr; // for now
	}
	get x1(): SVGLengthAttr {
		return this.letAttributeNode('x1') as SVGLengthAttr; // for now
	}
	get x2(): SVGLengthAttr {
		return this.letAttributeNode('x2') as SVGLengthAttr; // for now
	}
	get y1(): SVGLengthAttr {
		return this.letAttributeNode('y1') as SVGLengthAttr; // for now
	}
	get y2(): SVGLengthAttr {
		return this.letAttributeNode('y2') as SVGLengthAttr; // for now
	}
	get width(): SVGLengthAttr {
		return this.letAttributeNode('width') as SVGLengthAttr; // for now
	}
	get height(): SVGLengthAttr {
		return this.letAttributeNode('height') as SVGLengthAttr; // for now
	}
	get viewBox(): SVGRectAttr {
		return this.letAttributeNode('viewBox') as SVGRectAttr; // for now
	}
	get transform(): SVGTransformListAttr {
		return this.letAttributeNode('transform') as SVGTransformListAttr; // for now
	}
	get nearestViewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}
	get farthestViewportElement(): SVGElement | null {
		let parent: SVGElement = this;
		let farthest: SVGElement | null = null;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent._isViewportElement) {
				farthest = parent as SVGElement;
			}
		}
		return farthest;
	}

	get ownTM() {
		// return Matrix.parse(this.getAttribute("transform") || "");
		return this.transform.baseVal.consolidate();
	}

	set ownTM(T: Matrix) {
		this.setAttribute('transform', T.toString());
	}

	get clipElement(): SVGGraphicsElement | null {
		const v = this.getAttribute('clip-path');
		const a = v && /#([^#\(\)\s]+)/.exec(v);
		return a ? (this.ownerDocument?.getElementById(a[1]) as SVGGraphicsElement) : null;
	}

	set clipElement(target: SVGElement | null) {
		if (target) {
			this.setAttribute('clip-path', `url(#${target.letId()})`);
		} else {
			this.removeAttribute('clip-path');
		}
	}

	get hrefElement() {
		const id =
			this.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || this.getAttribute('href');
		if (id) {
			return this.ownerDocument?.getElementById(id.substr(id.indexOf('#') + 1)) as SVGElement;
		}
		return null;
	}

	set hrefElement(target: SVGElement | null) {
		target && this.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${target.letId()}`);
	}

	canRender() {
		if (this.getAttribute('display') === 'none') {
			return false;
		}
		return true;
	}

	get innerTM(): Matrix {
		return this.ownTM;
	}
	get rootTM(): Matrix {
		return this.composeTM(this.farthestViewportElement);
	}
	splitTM(): Matrix[] {
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

	localTM(): Matrix {
		// transform applied to decendants
		const { parentNode: parent, ownTM } = this;
		if (!parent) {
			if (this instanceof SVGSVGElement) {
				return Matrix.identity();
			}
		} else if (parent instanceof SVGGraphicsElement) {
			if (this instanceof SVGSVGElement) {
				return parent.localTM().cat(ownTM.cat(this.viewportTM()));
			}
			return parent.localTM().cat(ownTM);
		}
		return ownTM;
	}
	docTM(): Matrix {
		// transform applied to itself relative to document root
		const { parentNode: parent, ownTM } = this;
		if (!parent) {
			if (this instanceof SVGSVGElement) {
				return Matrix.identity();
			}
		} else if (parent instanceof SVGGraphicsElement) {
			return parent.localTM().cat(ownTM);
		}
		return ownTM;
	}
	pairTM(): Matrix[] {
		const { parentNode: parent, ownTM } = this;

		if (parent instanceof SVGGraphicsElement) {
			return [parent.localTM(), ownTM];
		}

		return [Matrix.identity(), ownTM];
	}

	composeTM(root?: SVGElement | null): Matrix {
		const { parentNode, ownTM } = this;
		let tm = Matrix.new(ownTM);
		let parent = parentNode;
		while (parent != root) {
			// null == undefined
			if (!parent) {
				throw new Error(`root not reached`);
			} else if (parent instanceof SVGGraphicsElement) {
				tm = tm.postCat(parent.innerTM);
			}
			parent = parent.parentNode;
		}
		return tm;
	}

	//
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}

	boundingBox(T?: Matrix): Box {
		return this._boundingBox(T);
	}
	getBBox() {
		const box = this.objectBBox();
		return box.isValid() ? box : Box.empty();
	}
	fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this.ownTM.postCat(parentT) : this.ownTM;
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement) {
				sub.fuseTransform(tm);
			}
		}
		this.removeAttribute('transform');
	}
	/////
	_descendantTM(node: SVGGraphicsElement): Matrix {
		return node.composeTM(this);
	}

	objectBBox(T?: Matrix) {
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

	_objectBBox(T?: Matrix) {
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

	_boundingBox(tm?: Matrix): Box {
		const { clipElement: clip } = this;
		if (clip) {
			if (tm) {
				return this._shapeBox(tm).overlap(clip._boundingBox(tm));
			} else {
				return this._shapeBox().overlap(clip._boundingBox());
			}
		} else {
			return this._shapeBox(tm);
		}
	}

	_shapeBox(tm?: Matrix): Box {
		const m = tm ? tm.cat(this.ownTM) : this.rootTM;
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.canRender()) {
				box = box.merge(sub._boundingBox(m));
			}
		}
		return box;
	}

	_viewportBox(tm?: Matrix): Box {
		const width = this.width.baseVal.value;
		const height = this.height.baseVal.value;
		const x = this.x.baseVal.value;
		const y = this.y.baseVal.value;
		if (width && height) {
			let b = Box.new(x, y, width, height);
			if (tm) {
				b = b.transform(tm);
			} else {
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
	_placeChild(ref: ChildNode | null | undefined, nodes: SVGGraphicsElement[]) {
		const pCtm = this.composeTM().inverse();
		for (const that of nodes) {
			if (that !== this) {
				const ctm = that.composeTM();
				if (ref) {
					this.insertBefore(that, ref);
				} else {
					this.appendChild(that);
				}
				that.ownTM = pCtm.cat(ctm);
			}
		}
	}
	_placePriorTo(ref: ChildNode | null | undefined, ...nodes: SVGGraphicsElement[]) {
		return this._placeChild(ref, nodes);
	}
	_placeAppend(...nodes: SVGGraphicsElement[]) {
		return this._placeChild(null, nodes);
	}
	_placeBefore(...nodes: SVGGraphicsElement[]) {
		const { parentNode } = this;
		return parentNode instanceof SVGGraphicsElement && parentNode._placeChild(this, nodes);
	}
	_placeAfter(...nodes: SVGGraphicsElement[]) {
		const { parentNode } = this;
		return (
			parentNode instanceof SVGGraphicsElement && parentNode._placeChild(this.nextSibling, nodes)
		);
	}
	layout() {
		return new SVGLayout(this);
	}
	//////////////////

	popTM(name?: string) {
		if (name == null) {
			for (const c of this.children) {
				if (c.localName == 'desc' && c.hasAttribute('name')) {
					c.remove();
				}
			}
		} else {
			for (const c of this.children) {
				if (c.localName == 'desc' && c.getAttribute('name') == name) {
					c.remove();
					const tm = c.getAttribute('tm');
					if (tm) {
						return tm;
					} else {
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
	get innerTM(): Matrix {
		// return this.viewportTM().cat(this.ownTM);
		return this.ownTM.cat(this.viewportTM());
	}

	viewportTM() {
		const w = this.width.baseVal.value;
		const h = this.height.baseVal.value;
		const x = this.x.baseVal.value;
		const y = this.y.baseVal.value;
		// const v = this.viewBox.baseVal;
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
		} else {
			return Matrix.identity();
		}
		const [tx, ty, sx, sy] = viewbox_transform(
			x,
			y,
			w,
			h,
			vx,
			vy,
			vw,
			vh,
			this.getAttribute('preserveAspectRatio'),
		);
		return Matrix.translate(tx, ty).scale(sx, sy);
	}
	shapeBox(T?: Matrix): Box {
		return this._shapeBox(T);
	}
	_shapeBox(tm?: Matrix): Box {
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
			return defs; // avoids error "Object is possibly 'null'"
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
import { ChildNode } from '../child-node.js';

import {
	userUnit,
	SVGLength,
	SVGLengthAttr,
	SVGLengthHAttr,
	SVGLengthWAttr,
	SVGLengthXAttr,
	SVGLengthYAttr,
} from './length.js';
import { SVGRectAttr } from './rect.js';
import { SVGLayout } from './layout.js';
import { SVGLengthListAttr, SVGLengthList } from './length-list.js';
import { SVGTransformListAttr, SVGTransform, viewbox_transform } from './attr-transform.js';
