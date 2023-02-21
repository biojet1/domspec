import { Vec, Box, Matrix, SVGTransform } from "svggeom";

export interface SVGBoundingBoxOptions {
	fill?: boolean;
	stroke?: boolean;
	markers?: boolean;
	clipped?: boolean;
}

export class SVGElement extends Element {
	_newAttributeNode(name: string) {
		// console.warn("_newAttributeNode", name);
		switch (name) {
			// https://svgwg.org/svg2-draft/geometry.html#Sizing
			case "r":
				return new SVGAnimatedLength(name);
			case "width":
				if (this instanceof SVGSVGElement) {
					return new SVGLengthWAttr(name);
				} // fall

			case "x":
			case "cx":
			case "x1":
			case "x2":
				return new SVGLengthXAttr(name);
			case "height":
				if (this instanceof SVGSVGElement) {
					return new SVGLengthHAttr(name);
				} // fall
			case "y":
			case "cy":
			case "y1":
			case "y2":
				return new SVGLengthYAttr(name);
			case "rx":
			case "ry":
				// TODO
				return new SVGAnimatedLength(name);
			case "viewBox":
				return new SVGAnimatedRect(name);
			// return new SVGLengthListAttr(name);
			case "transform":
				return new SVGAnimatedTransformList(name);
			// case "points":
			// 	return new SVGNumberListAttr(name);
		}
		return super._newAttributeNode(name);
	}
	get r(): SVGAnimatedLength {
		return this._letAttributeNode("r") as SVGAnimatedLength; // for now
	}
	get x(): SVGAnimatedLength {
		return this._letAttributeNode("x") as SVGAnimatedLength; // for now
	}
	get y(): SVGAnimatedLength {
		return this._letAttributeNode("y") as SVGAnimatedLength; // for now
	}
	get cx(): SVGAnimatedLength {
		return this._letAttributeNode("cx") as SVGAnimatedLength; // for now
	}
	get cy(): SVGAnimatedLength {
		return this._letAttributeNode("cy") as SVGAnimatedLength; // for now
	}
	get rx(): SVGAnimatedLength {
		return this._letAttributeNode("rx") as SVGAnimatedLength; // for now
	}
	get ry(): SVGAnimatedLength {
		return this._letAttributeNode("ry") as SVGAnimatedLength; // for now
	}
	get x1(): SVGAnimatedLength {
		return this._letAttributeNode("x1") as SVGAnimatedLength; // for now
	}
	get x2(): SVGAnimatedLength {
		return this._letAttributeNode("x2") as SVGAnimatedLength; // for now
	}
	get y1(): SVGAnimatedLength {
		return this._letAttributeNode("y1") as SVGAnimatedLength; // for now
	}
	get y2(): SVGAnimatedLength {
		return this._letAttributeNode("y2") as SVGAnimatedLength; // for now
	}
	get width(): SVGAnimatedLength {
		return this._letAttributeNode("width") as SVGAnimatedLength; // for now
	}
	get height(): SVGAnimatedLength {
		return this._letAttributeNode("height") as SVGAnimatedLength; // for now
	}
	get viewBox(): SVGAnimatedRect {
		return this._letAttributeNode("viewBox") as SVGAnimatedRect; // for now
	}
	get transform(): SVGAnimatedTransformList {
		return this._letAttributeNode("transform") as SVGAnimatedTransformList; // for now
	}
	get _isViewportElement() {
		return 0;
	}
	get viewportElement(): SVGElement | null {
		// The returned element is often the nearest ancestor svg element.
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (1 === parent._isViewportElement) {
				return parent;
			}
		}
		return null;
	}
	get ownerSVGElement(): SVGSVGElement | null {
		// https://svgwg.org/svg-next/types.html#__svg__SVGElement__ownerSVGElement
		let parent: SVGElement = this;
		while ((parent = parent.parentElement as SVGElement)) {
			if (parent instanceof SVGSVGElement) {
				return parent;
			}
		}
		return null;
	}

	//////////////
	// The transform attribute
	get _ownTM() {
		// return Matrix.parse(this.getAttribute("transform") || "");
		return this.transform.baseVal.combine();
	}

	set _ownTM(T: Matrix) {
		this.setAttribute("transform", T.toString());
	}
	//////////////
	// The transform attribute + viewport transformation, see SVGSVGElement._subTM
	get _subTM(): Matrix {
		return this._ownTM;
	}

	//////////////
	// The box of element with viewport that has x, y, width, height
	// like image, svg, symbol, foreignObject, ...
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
				b = b.transform(this._rootTM);
			}
			return b;
		}
		return Box.not();
	}
	//////////////
	// The transformation up to document root
	get _rootTM(): Matrix {
		// const { parentElement: parent, _ownTM } = this;
		// if (parent instanceof SVGGraphicsElement) {
		// 	return parent._relTM(_ownTM);
		// } else {
		// 	return _ownTM;
		// }
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
}

export class SVGGraphicsElement extends SVGElement {
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
	get _clipElement(): SVGGraphicsElement | null {
		const v = this.getAttribute("clip-path");
		const a = v && /#([^#\(\)\s]+)/.exec(v);
		return a
			? (this.ownerDocument?.getElementById(a[1]) as SVGGraphicsElement)
			: null;
	}

	set _clipElement(target: SVGElement | null) {
		if (target) {
			this.setAttribute("clip-path", `url(#${target._ensureId()})`);
		} else {
			this.removeAttribute("clip-path");
		}
	}

	get _hrefElement() {
		const id =
			this.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
			this.getAttribute("href");
		if (id) {
			return this.ownerDocument?.getElementById(
				id.substr(id.indexOf("#") + 1)
			) as SVGElement;
		}
		return null;
	}

	set _hrefElement(target: SVGElement | null) {
		target &&
			this.setAttributeNS(
				"http://www.w3.org/1999/xlink",
				"href",
				`#${target._ensureId()}`
			);
	}

	_canRender() {
		if (this.getAttribute("display") === "none") {
			return false;
		}
		return true;
	}

	//////////////////
	// The transformation up to 'root'
	// if root == null up to document root
	_relTM(tm: Matrix, root?: SVGGraphicsElement | null): Matrix {
		let parent: SVGGraphicsElement = this;
		while (parent != root) {
			const grand: Element | null = parent.parentElement;
			if (grand instanceof SVGGraphicsElement) {
				tm = tm.postCat(parent._subTM);
				parent = grand;
			} else if (root) {
				if (grand) {
					throw new Error(`root not reached`);
				} else {
					const p = (root as SVGGraphicsElement)._rootTM.inverse();
					return p.cat(tm);
				}
			} else {
				break;
			}
		}
		return tm;
		// while (parent != root) {
		// 	if (parent instanceof SVGGraphicsElement) {
		// 		const { parentElement: grand } = parent;
		// 		if (grand != null) {
		// 			tm = tm.postCat(parent._subTM);
		// 			parent = grand;
		// 			continue;
		// 		}
		// 	}
		// 	break;
		// }
		// let { parentElement: parent } = this;
		// for (;;) {
		// 	if (parent instanceof SVGGraphicsElement) {
		// 		const { parentElement: grand } = parent;
		// 		if (grand != null) {
		// 			tm = tm.postCat(_subTM);
		// 			parent = grand;
		// 			continue;
		// 		}
		// 	} else if (parent == null) {
		// 	}
		// 	break;
		// }
		// return tm;
	}
	//////////////
	// The transformation up to document root excluding _ownTM and _ownTM
	_pairTM(root?: SVGGraphicsElement | null): Matrix[] {
		const { parentElement: parent, _ownTM } = this;
		if (parent instanceof SVGGraphicsElement) {
			return [parent._relTM(Matrix.identity(), root), _ownTM];
		} else {
			return [Matrix.identity(), _ownTM];
		}
		// return [(parent instanceof SVGGraphicsElement) ? parent._localTM() : Matrix.identity(), _ownTM];
	}
	//////////////
	// The transform attribute + viewport transformation (if SVGSVGElement) + up to document root
	// _localTM(): Matrix {
	// 	const { parentElement: parent, _ownTM } = this;
	// 	if (parent instanceof SVGGraphicsElement) {
	// 		return parent._relTM(this._subTM);
	// 	} else if (this instanceof SVGSVGElement) {
	// 		// Assume the root element
	// 		return Matrix.identity();
	// 	} else {
	// 		return this._subTM;
	// 	}
	// }
	get _innerTM(): Matrix {
		let { parentElement: parent, _subTM: tm } = this;
		if (parent) {
			while (parent instanceof SVGGraphicsElement) {
				const { parentElement: grand } = parent;
				if (null == grand) {
					break;
				}
				tm = tm.postCat(parent._subTM);
				parent = grand as SVGGraphicsElement;
			}
		} else if (this instanceof SVGSVGElement) {
			// Assume the root element
			return Matrix.identity();
		}
		return tm;
	}
	//////////////
	// 	<g/> box of decendant children
	_objectBBox(T?: Matrix) {
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

	//////////////
	// The bounding box, transformed up to document root
	_boundingBox(tm?: Matrix): Box {
		const { _clipElement: clip } = this;
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
	//////////////
	// The bounding box, transformed up to document root
	// _logicalBox(tm?: Matrix, params:SVGBoundingBoxOptions): Box {

	// 	const { _clipElement: clip } = this;
	// 	if (clip) {
	// 		if (tm) {
	// 			return this._shapeBox(tm).overlap(clip._boundingBox(tm));
	// 		} else {
	// 			return this._shapeBox().overlap(clip._boundingBox());
	// 		}
	// 	} else {
	// 		return this._shapeBox(tm);
	// 	}
	// }

	//////////////
	// The bounding box of <g/>, decendants,  transformed up to document root
	_shapeBox(tm?: Matrix): Box {
		// const m = tm ? tm.cat(this._ownTM) : this._rootTM;
		const m = tm ? tm.cat(this._ownTM) : this._innerTM;
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub._canRender()) {
				box = box.merge(sub._boundingBox(m));
			}
		}
		return box;
	}
	//////////////
	// The fuse transform <g/>, decendants
	_fuseTransform(parentT?: Matrix) {
		let tm = parentT ? this._ownTM.postCat(parentT) : this._ownTM;
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement) {
				sub._fuseTransform(tm);
			}
		}
		this.removeAttribute("transform");
	}
	//////////////
	getScreenCTM(): Matrix {
		let { parentElement: parent, _ownTM: tm } = this;
		for (; parent; parent = parent.parentElement) {
			if (parent instanceof SVGGraphicsElement) {
				tm = tm.postCat(parent._subTM);
			} else {
				break;
			}
		}
		return tm;
	}

	getCTM(): Matrix {
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

	_placeChild(ref: ChildNode | null | undefined, nodes: SVGGraphicsElement[]) {
		const pCtm = this._rootTM.inverse();
		for (const that of nodes) {
			if (that !== this) {
				const ctm = that._rootTM;
				if (ref) {
					this.insertBefore(that, ref);
				} else {
					this.appendChild(that);
				}
				that._ownTM = pCtm.cat(ctm);
			}
		}
	}
	_placePriorTo(
		ref: ChildNode | null | undefined,
		...nodes: SVGGraphicsElement[]
	) {
		return this._placeChild(ref, nodes);
	}
	_placeAppend(...nodes: SVGGraphicsElement[]) {
		return this._placeChild(null, nodes);
	}
	_placeBefore(...nodes: SVGGraphicsElement[]) {
		const { parentElement } = this;
		return (
			parentElement instanceof SVGGraphicsElement &&
			parentElement._placeChild(this, nodes)
		);
	}
	_placeAfter(...nodes: SVGGraphicsElement[]) {
		const { parentElement } = this;
		return (
			parentElement instanceof SVGGraphicsElement &&
			parentElement._placeChild(this.nextSibling, nodes)
		);
	}
	_layout() {
		return new SVGLayout(this);
	}
	// for elements that establish SVG viewports
	// svg, symbol, image, marker, pattern, view
	_viewportTM() {
		const w = this.width.baseVal.value;
		const h = this.height.baseVal.value;
		if (w && h) {
			const { x: vx, y: vy, width: vw, height: vh } = this.viewBox._calcBox();
			if (vw && vh) {
				const [tx, ty, sx, sy] = viewbox_transform(
					this.x.baseVal.value,
					this.y.baseVal.value,
					w,
					h,
					vx,
					vy,
					vw,
					vh,
					this.getAttribute("preserveAspectRatio")
				);
				return Matrix.translate(tx, ty).scale(sx, sy);
			}
		}

		return Matrix.identity();
	}
	//////////////
	//  decendants,  boxes
	_subBBox(m: Matrix, params: SVGBoundingBoxOptions): Box {
		let box = Box.new();
		for (const sub of this.children) {
			if (sub instanceof SVGGraphicsElement && sub._canRender()) {
				box = box.merge(sub._ownBBox(m, params));
			}
		}
		return box;
	}
	_ownBBox(m: Matrix, params: SVGBoundingBoxOptions): Box {
		return this._subBBox(m, params);
	}
}

export class SVGSVGElement extends SVGGraphicsElement {
	static TAGS = ["svg"];

	// SVGNumber createSVGNumber();
	// SVGAngle createSVGAngle();
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
	createSVGTransformFromMatrix(M: Matrix) {
		const m = this.createSVGTransform();
		m.setMatrix(M);
		return m;
	}

	get _isViewportElement() {
		return 1;
	}
	get _subTM(): Matrix {
		return this._ownTM.cat(this._viewportTM());
	}

	_shapeBox(tm?: Matrix): Box {
		return this._viewportBox(tm);
	}

	_ownBBox(tm?: Matrix): Box {
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
			return defs; // avoids error "Object is possibly 'null'"
		}
		throw new Error(`No ownerDocument`);
	}
}

import { Element } from "../element.js";
import { ChildNode } from "../child-node.js";
import {
	SVGLength,
	SVGAnimatedLength,
	SVGLengthHAttr,
	SVGLengthWAttr,
	SVGLengthXAttr,
	SVGLengthYAttr,
} from "./length.js";
import { SVGAnimatedRect, SVGRect } from "./rect.js";
import { SVGLayout } from "./layout.js";
import { SVGLengthListAttr, SVGLengthList } from "./length-list.js";
import {
	SVGAnimatedTransformList,
	viewbox_transform,
} from "./attr-transform.js";
