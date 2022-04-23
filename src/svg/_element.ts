import { Vec, Box, Matrix, Path } from 'svggeom';
export class SVGElement extends Element {
	get _isViewportElement() {
		return 0;
	}
	get _nearestVP(): SVGElement | null {
		let cur: SVGElement = this;
		do {
			if (1 === cur._isViewportElement) {
				return cur;
			}
		} while ((cur = cur.parentElement as SVGElement));
		return null;
	}
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
			case 'x':
			case 'y':
			case 'rx':
			case 'ry':
			case 'cx':
			case 'cy':
			case 'x1':
			case 'x2':
			case 'y1':
			case 'y2':
				return new SVGLengthAttr(name);
			case 'width':
				return new SVGLengthWAttr(name);
			case 'height':
				return new SVGLengthHAttr(name);
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
	get transformM() {
		throw new Error('Depreciated');
		return this.transform.baseVal.consolidate();
	}

	set transformM(T: Matrix) {
		throw new Error('Depreciated');
		this.setAttribute('transform', T.toString());
	}

	get ownTM() {
		// return Matrix.parse(this.getAttribute("transform") || "");
		return this.transform.baseVal.consolidate();
	}

	set ownTM(T: Matrix) {
		this.setAttribute('transform', T.toString());
	}

	get clip(): SVGGraphicsElement | undefined {
		throw new Error('Depreciated');
		return this.clipElement;
	}

	set clip(target: SVGElement | undefined) {
		throw new Error('Depreciated');
		this.clipElement = target;
	}

	get clipElement(): SVGGraphicsElement | undefined {
		const id = this.getAttribute('clip-path');
		if (id) {
			return this.ownerDocument?.getElementById(id) as SVGGraphicsElement;
		}
	}

	set clipElement(target: SVGElement | undefined) {
		target && this.setAttribute('clip-path', target.letId());
	}

	get hrefElement() {
		const id = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || this.getAttribute('href');
		if (id) {
			const h = id.indexOf('#');
			return this.ownerDocument?.getElementById(h < 0 ? id : id.substr(h + 1)) as SVGElement;
		}
		return null;
	}

	set hrefElement(target: SVGElement | null) {
		target && this.setAttributeNS('http://www.w3.org/1999/xlink', 'href', target.letId());
	}

	canRender() {
		if (this.getAttribute('display') === 'none') {
			return false;
		}
		return true;
	}

	refElement() {
		throw new Error('Depreciated');
		return this.hrefElement;
		// const id = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || this.getAttribute('href');
		// if (id) {
		// 	const h = id.indexOf('#');
		// 	return this.ownerDocument?.getElementById(h < 0 ? id : id.substr(h + 1));
		// }
	}

	composedTransform(): Matrix {
		throw new Error('Depreciated');
		// depreciated
		return this.myCTM();
	}

	myCTM(): Matrix {
		const { parentNode: parent, ownTM } = this;
		if (parent) {
			// https://svgwg.org/svg2-draft/coords.html#ComputingAViewportsTransform
			if (parent instanceof SVGSVGElement) {
				// return parent
				// 	.viewportTM()
				// 	.multiply(parent.myCTM())
				// 	.multiply(ownTM);
				// return parent
				// 	.myCTM()
				// 	.multiply(parent.viewportTM())
				// 	.multiply(ownTM)
				if (parent.viewportElement) {
					const p = parent.parentCTM();
					const t = parent.ownTM;
					const v = parent.viewportTM();
					return p.multiply(t.postMultiply(v)).multiply(ownTM);
					// (pp * (pv * pt)) * M
					// return ownTM.postMultiply(t).postMultiply(v).postMultiply(p);
				}
			} else if (parent instanceof SVGGraphicsElement) {
				return parent.myCTM().multiply(ownTM);
			}
		}
		throw new Error('Depreciated');
		return ownTM;
	}

	parentCTM(): Matrix {
		const { parentNode: parent } = this;
		if (parent) {
			if (parent instanceof SVGGraphicsElement) {
				return parent.rootTM;
			}
		}
		throw new Error('Depreciated');
		return Matrix.identity();
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
				return [parent.rootTM, this.ownTM];
			}
		}
		return [Matrix.identity(), this.ownTM];
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
				tm = tm.postMultiply(parent.innerTM);
			}
			parent = parent.parentNode;
		}
		return tm;
	}

	//
	shapeBox(T?: Matrix | boolean): Box {
		// if (this.canRender()) {
		const E = T === true ? this.rootTM : T ? T.multiply(this.ownTM) : this.ownTM;
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.canRender()) {
				box = box.merge(sub.boundingBox(E));
			}
		}
		return box;
		// }
		// return Box.not();
	}

	boundingBox(M?: Matrix | boolean): Box {
		const { clip } = this;
		if (clip) {
			if (M === true) {
				return this.shapeBox(true).overlap(clip.boundingBox(this.myCTM()));
			} else {
				return this.shapeBox(M).overlap(clip.boundingBox(M));
			}
		} else {
			return this.shapeBox(M);
		}
	}
	getBBox() {
		// const box = this.shapeBox(true);
		const box = this.objectBBox();
		return box.isValid() ? box : Box.empty();
	}
	fuseTransform(parentT?: Matrix) {
		const a = this.getAttributeNode('transform');
		if (parentT) {
			if (a) {
				parentT = parentT.multiply(Matrix.parse(a.value));
			}
		} else if (a) {
			parentT = Matrix.parse(a.value);
		}
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement) {
				sub.fuseTransform(parentT);
			}
		}
		a && this.removeAttributeNode(a);
	}
	/////
	// ourTM?
	descendantTM(node: SVGGraphicsElement): Matrix {
		return node.composeTM(this);
	}

	objectBBox(T?: Matrix) {
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub.canRender()) {
				const M = sub.ownTM;
				const E = T ? T.multiply(M) : M;
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
		const m = tm ? tm.multiply(this.ownTM) : this.rootTM;
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
}
export class SVGSVGElement extends SVGGraphicsElement {
	static TAGS = ['svg'];
	get _isViewportElement() {
		return 1;
	}
	get innerTM(): Matrix {
		// return this.viewportTM().multiply(this.ownTM);
		return this.ownTM.multiply(this.viewportTM());
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
		const [tx, ty, sx, sy] = viewbox_transform(x, y, w, h, vx, vy, vw, vh, this.getAttribute('preserveAspectRatio'));
		// return Matrix.identity();
		// return Matrix.scale(sx, sy).translate(tx, ty);
		return Matrix.translate(tx, ty).scale(sx, sy);
		// console.log(`translate(${tx} ${ty}) scale(${sx} ${sy})`);
		// return Matrix.parse(`translate(${tx} ${ty}) scale(${sx} ${sy})`);
	}
	shapeBox(T?: Matrix | boolean): Box {
		return shapeBoxVP(this, T);
	}
	_shapeBox(tm?: Matrix): Box {
		return this._viewportBox(tm);
	}

	defs() {
		let { ownerDocument, children } = this;
		if (ownerDocument) {
			for (const sub of children) {
				if (sub.localName == 'defs') {
					return sub;
				}
			}
			const defs = ownerDocument.createElement('defs');
			return defs;
		}
		throw new Error(`No ownerDocument`);
	}
}
export function shapeBoxVP(node: SVGGraphicsElement, T?: Matrix | boolean): Box {
	const width = node.width.baseVal.value;
	const height = node.height.baseVal.value;
	const x = node.x.baseVal.value;
	const y = node.y.baseVal.value;
	if (width && height) {
		let b = Box.new(x, y, width, height);
		if (T === true) {
			b = b.transform(node.rootTM);
		} else if (T) {
			b = b.transform(T);
		} else {
			b = b.transform(node.ownTM);
		}
		return b;
	}
	return Box.not();
}
import { Element } from '../element.js';
import { userUnit, SVGLength, SVGLengthAttr, SVGLengthHAttr, SVGLengthWAttr } from './length.js';
import { SVGRectAttr } from './rect.js';
import { SVGLengthListAttr, SVGLengthList } from './length-list.js';
import { SVGTransformListAttr, SVGTransform, viewbox_transform } from './attr-transform.js';
