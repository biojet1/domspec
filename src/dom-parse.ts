function domParse(doc: Document, top: ParentNode, opt:any = {}) {
	const parser = new SaxesParser({
		// lowercase: true,
		xmlns: true,
		strictEntities: true,
		...opt,
	});
	// const runScripts:ParentNode[]|undefined = opt.runScripts ? [] : undefined;

	parser.on("error", (err) => {
		throw new Error(`SaxesParser ${err.message}`);
	});

	parser.on("doctype", (dt) => {
		let [name, pub, sys] = ["html", "", ""];

		if (top !== doc) {
			throw new Error("Doctype can only be appended to document");
		} else if (!HTML5_DOCTYPE.test(dt)) {
			let m;
			if ((m = PUBLIC_DOCTYPE.exec(dt))) {
				[name, pub, sys] = [m[1], m[2], m[3]];
			} else if ((m = SYSTEM_DOCTYPE.exec(dt))) {
				[name, sys] = [m[1], m[2]];
			} else if ((m = CUSTOM_NAME_DOCTYPE.exec(dt))) {
				name = m[1];
			}
		}
		let node = doc.implementation.createDocumentType(name, pub, sys);
		// node.ownerDocument = doc;
		top.appendChild(node);
	});

	parser.on("text", (str: string) => {
		if (top.nodeType !== 9) top.appendChild(doc.createTextNode(str));
	});

	parser.on("comment", (str: string) => {
		top.appendChild(doc.createComment(str));
	});

	parser.on("cdata", (data) => {
		top.appendChild(doc.createCDATASection(data));
	});

	parser.on("opentag", (node) => {
		const { local, attributes, uri, prefix, name } = node as SaxesTagNS;
		let ns = uri || null;
		if (!ns && prefix) {
			ns = top.lookupNamespaceURI(prefix);
		}
		let tag;
		if (ns) {
			tag = doc.createElementNS(ns, name);
		} else {
			tag = doc.createElement(name);
		}

		const attrs = Object.entries(attributes);

		for (const [key, { uri, value }] of attrs) {
			tag.setAttributeNS(uri, key, value);
		}
		top.appendChild(tag);
		top = tag;
	});

	parser.on("closetag", (node) => {
		const { parentNode } = top;
		// console.dir(top, { depth: 1 });
		if (node.isSelfClosing) {
			(top as Element)._parsed_closed = true;
		}
		// if (runScripts && (top as Element).localName == "script") {
		// 	runScripts.push(top);
		// 	// top._do("eval");
		// }
		if (parentNode) {
			top = parentNode;
		} else {
			/* c8 ignore next */
			throw new Error(`unexpected null parentNode of ${top}`);
		}
	});
	parser.on("end", function () {
		// parser stream is done, and ready to have more stuff written to it.
		// if (runScripts) {
		// 	while (runScripts.length > 0) {
		// 		const script = runScripts.shift();
		// 	}
		// }
	});
	return parser;
	// .write(str);
}

// function domParse(str: string, doc: Document, top: ParentNode) {
// 	const handler = {
// 		onopentagname: function (name /*: string */) {
// 			const pos = name.indexOf(":");
// 			if (pos < 0) {
// 				const tag = doc.createElement(name);
// 				top.appendChild(tag);
// 				top = tag;
// 			}else{

// 			}
// 			// prefix =
// 		},
// 		onattribute(name /*: string */, value /*: string */) {},
// 		onclosetag: function (name /*: string */) {},
// 	};

// 	// ontext(text /*: string */)
// 	// onprocessinginstruction(name /*: string */, data /*: string */)
// 	// oncomment(data /*: string */)
// 	// oncommentend()
// 	// oncdatastart()
// 	// oncdataend()
// 	// onerror(error /*: Error */)
// }

export const parseDOM = function (
	str: string,
	parent: ParentNode // Element | Document | DocumentFragment
) {
	if (parent instanceof Document) {
		domParse(parent, parent).write(str);
	} else {
		const doc = parent.ownerDocument;
		if (doc) {
			domParse(doc, parent, { fragment: true }).write(str);
		} else {
			throw new Error(`No ownerDocument`);
		}
	}
};

export const pushDOMParser = function (
	parent: ParentNode, // Element | Document | DocumentFragment
	opt = {}
) {
	if (parent instanceof Document) {
		return domParse(parent, parent);
	} else {
		const doc = parent.ownerDocument;
		if (doc) {
			return domParse(doc, parent, { fragment: true });
		} else {
			throw new Error(`No ownerDocument`);
		}
	}
};

export class DOMParser {
	parseFromString(markup: string, type?: string) {
		let doc: Document;
		switch (type) {
			case "application/xhtml+xml":
			case "text/html":
				doc = new HTMLDocument(type);
				break;
			case "image/svg+xml":
				doc = new SVGDocument();
				break;
			default:
				doc = new XMLDocument(type);
		}
		domParse(doc, doc).write(markup);
		switch (type) {
			case "text/html":
				if (!doc.doctype) {
					doc.insertBefore(new DocumentType("html"), doc.firstChild);
				}
		}

		return doc;
	}
}

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /<!doctype\s+([^\s>]+)/i;

import { SaxesParser, SaxesTagNS } from "saxes";
import { ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import {
	Document,
	HTMLDocument,
	SVGDocument,
	XMLDocument,
} from "./document.js";
import { DocumentType } from "./document-type.js";
