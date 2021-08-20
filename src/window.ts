/*
s = """*/
import { Node } from "./node.js";
import { Document, HTMLDocument } from "./document.js";
import { DOMTokenList } from "./token-list.js";
import { DOMImplementation } from "./dom-implementation.js";
import { EventTarget } from "./event-target.js";
import { Attr } from "./attr.js";
import * as html_elements from "./html/element.js";

// """

/*
import re
def ls():
	for m in re.finditer(r"{([^\}]+)}", s):
		for x in m.group(1).strip().split(','):
			yield (f"""
	get {x}() {{
		return {x};
	}}""")
for x in ls():
	print(x)

Object.getOwnPropertyNames(window).filter(s=>/^[A-Z]\w+$/.test(s))
*/

export class Window extends EventTarget {
	_document?: Document;
	_frames?: any;

	constructor(doc?: Document) {
		super();
		// const doc = new Document();
		if (doc) {
			doc.defaultView = this;
			this._document = doc;
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
		for (const k of Object.getOwnPropertyNames(html_elements)) {
			Reflect.set(this, k, Reflect.get(html_elements, k));
		}
	}
	get self() {
		return this;
	}
	get Node() {
		return Node;
	}

	private setDocument(doc?: Document) {
		if (doc) {
			// pass
		} else {
			doc = HTMLDocument.setup();
		}
		doc.defaultView = this;
		this._document = doc;
		return doc;
	}

	get document() {
		let { _document } = this;
		return _document || this.setDocument();
	}

	get DOMTokenList() {
		return DOMTokenList;
	}

	get DOMImplementation() {
		return DOMImplementation;
	}

	get EventTarget() {
		return EventTarget;
	}
	get HTMLCollection() {
		return HTMLCollection;
	}

	get Attr() {
		return Attr;
	}

	get frames() {
		let { _frames } = this;
		if (!_frames) {
			this._frames = _frames = new Proxy<Window>(this, {
				get(window: Window, key: string) {
					if (typeof key === "symbol") {
						//pass
					} else if (/^-?\d+$/.test(key)) {
						let i = parseInt(key);
						let { document } = window;
						for (const frame of document.getElementsByTagName(
							"iframe"
						)) {
							if (0 === i--) {
								let win = frmwm.get(frame);
								win || frmwm.set(frame, (win = new Window()));
								return win;
							} else if (i < 0) {
								break;
							}
						}
					}
					return Reflect.get(window, key);
				},
			});
		}
		return _frames;
	}
}
const frmwm = new WeakMap();

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
import { Element } from "./element.js";
import { HTMLCollection } from "./parent-node.js";

// import { Attr } from "./attr.js";
// import { Comment, Text, CDATASection } from "./character-data.js";
// import { DocumentFragment } from "./document-fragment.js";
// import { DOMImplementation } from "./dom-implementation.js";
