import { Document } from "./document.js";
import { DOMTokenList } from "./token-list.js";
import { DOMImplementation } from "./dom-implementation.js";
import { EventTarget } from "./event-target.js";

export class Window extends EventTarget {
	document?: Document;
	constructor(doc?: Document) {
		super();
		// const doc = new Document();
		if (doc) {
			doc.defaultView = this;
			this.document = doc;
		}
		// const doc = this.document;
		// this.Image = class {
		// 	constructor(width, height) {
		// 		const img = doc.createElement("img");
		// 		if (width != null) img.setAttribute("width", width);
		// 		if (height != null) img.setAttribute("height", height);
		// 		return img;
		// 	}
		// };
	}
	get DOMTokenList() {
		return DOMTokenList;
	}
	get self() {
		return this;
	}
	get DOMImplementation() {
		return DOMImplementation;
	}
}

export class TSDOM {
	document?: Document;
	window?: Window;
	constructor() {
		const win = new Window();
		this.window = win;
		this.document = win.document;
	}
}
export class JSDOM extends TSDOM {
	// constructor() {
	// 	this.window = new Window();
	// 	this.document = window.document;
	// }
}
// import { XMLNS, XML } from "./namespace.js";
// import { Element } from "./element.js";
// import { Attr } from "./attr.js";
// import { Comment, Text, CDATASection } from "./character-data.js";
// import { DocumentFragment } from "./document-fragment.js";
// import { DOMImplementation } from "./dom-implementation.js";
