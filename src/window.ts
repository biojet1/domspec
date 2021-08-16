/*
s = """*/
import { Node } from "./node.js";
import { Document } from "./document.js";
import { DOMTokenList } from "./token-list.js";
import { DOMImplementation } from "./dom-implementation.js";
import { EventTarget } from "./event-target.js";
import { Attr } from "./attr.js";
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
	get self() {
		return this;
	}
	get Node() {
		return Node;
	}

	get Document() {
		return Document;
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

	get Attr() {
		return Attr;
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
