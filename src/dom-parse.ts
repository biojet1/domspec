function domParse(doc: Document, top: ParentNode, options?: any) {
	const opt = options || {};
	const parser = new SaxesParser({
		// lowercase: true,
		xmlns: true,
		strictEntities: true,
		...opt,
	});
	const scripts: Element[] | undefined =
		opt.runScripts !== false ? [] : undefined;
	const { isHTML } = doc;

	parser.on("error", (err) => {
		throw new Error(`SaxesParser ${err.message}`);
	});

	parser.on("doctype", (dt) => {
		if (top !== doc) {
			throw new Error("Doctype can only be appended to document");
		}
		top.appendChild(createDocumentType(doc, dt));
	});

	parser.on("text", (str: string) => {
		if (top.nodeType !== 9) top.appendChild(doc.createTextNode(str));
	});

	parser.on("comment", (str: string) => {
		top.appendChild(doc.createComment(str));
	});

	parser.on("cdata", (data) => {
		if (isHTML) {
			top.appendChild(doc.createTextNode(data));
		} else top.appendChild(doc.createCDATASection(data));
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
		if (node.isSelfClosing) {
			(top as Element)._parsed_closed = true;
		}
		if (scripts && (top as Element).localName == "script") {
			scripts.push(top as Element);
			// top._do("eval");
		}
		if (parentNode) {
			top = parentNode;
		} else {
			/* c8 ignore next */
			throw new Error(`unexpected null parentNode of ${top}`);
		}
	});
	parser.on("end", function () {
		// parser stream is done, and ready to have more stuff written to it.
		if (scripts) {
			runScripts(scripts, opt.resourceLoader)
				// .catch((err) => {
				// 	err.message;
				// 	console.error("Error running scripts", err);
				// })
				.then(() => {
					if (scripts.length !== 0) {
						throw new Error();
					}
					const { defaultView: window } = doc;
					if (window) {
						// console.info("WINDOW LOAD");
						window.dispatchEvent(new Event("load"));
					}
				});
		}
	});
	return parser;
	// .write(str);
}

function htmlParser2(doc: Document, top: ParentNode, options?: any) {
	let cdata: CDATASection | null;
	const opt = options || {};
	const handler = {
		onopentagname(name: string) {
			let tag;
			const i = name.indexOf(":");
			if (i < 0) {
				// tag = doc.createElement(name);
				tag = doc.createElementNS(null, name);
			} else {
				const prefix = name.substring(0, i);
				const local = name.substring(i + 1);
				const ns = top.lookupNamespaceURI(prefix);
				tag = doc.createElementNS(ns, local);
			}
			top.appendChild(tag);
			top = tag;
		},
		onclosetag(name: string) {
			const { parentNode } = top;

			// delete (top as any)._nsmap;

			if (parentNode) {
				top = parentNode;
			} else {
				/* c8 ignore next */
				throw new Error(`unexpected null parentNode of ${top}`);
			}
		},
		onattribute(name: string, value: string) {
			const i = name.indexOf(":");
			if (i < 0) {
				// switch (name) {
				// 	case "xmlns": {
				// 		get_prefix_map(top)[true] = value;
				// 		break;
				// 	}
				// }
				(top as Element).setAttributeNS(null, name, value);
			} else {
				const prefix = name.substring(0, i);
				// const local = name.substring(i + 1);
				let ns;
				switch (prefix) {
					case "xmlns":
						ns = XMLNS;
						break;
					default:
						ns = top.lookupNamespaceURI(prefix);
				}
				(top as Element).setAttributeNS(ns, name, value);
			}
		},
		ontext(text: string) {
			if (cdata) {
				// console.log(`ontext cdata (${text})`);
				cdata.data += text;
			} else if (top.nodeType !== 9) {
				// console.log(`ontext (${text})`);
				top.appendChild(doc.createTextNode(text));
			}
		},
		oncomment(data: string) {
			top.appendChild(doc.createComment(data));
		},
		onprocessinginstruction(name: string, data: string) {
			switch (name) {
				case "!doctype": {
					if (top !== doc) {
						throw new Error(
							"Doctype can only be appended to document"
						);
					}
					top.appendChild(createDocumentType(doc, data));
					break;
				}
				default:
					const m = data.match(/^\?\s*(\w+)\s+(.*)\s*\?$/);
					// console.log(`onpi`, JSON.stringify(data), JSON.stringify(m));
					m &&
						top.appendChild(
							doc.createProcessingInstruction(m[1], m[2])
						);
			}
		},
		oncdatastart() {
			cdata = doc.createCDATASection("");
		},
		oncdataend() {
			if (cdata) {
				top.appendChild(cdata);
				cdata = null;
			}
		},
	};
	opt.recognizeSelfClosing = true;
	// opt.recognizeCDATA = true;
	return import("htmlparser2").then((mod) => {
		const { Parser } = mod;
		return new Parser(handler, opt);
	});
}

export const pushDOMParser = function (
	parent: ParentNode, // Element | Document | DocumentFragment
	opt?: any
) {
	if (parent instanceof Document) {
		return domParse(parent, parent, opt);
	}
	const { ownerDocument: doc } = parent;
	if (doc) {
		if (opt) {
			opt.fragment = true;
		} else {
			opt = { fragment: true };
		}
		return domParse(doc, parent, opt);
	}
	throw new Error(`No ownerDocument`);
};

export const parseDOM = function (
	str: string,
	parent: ParentNode, // Element | Document | DocumentFragment
	opt = {}
) {
	pushDOMParser(parent, opt).write(str);
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

	async parseString(markup: string, type?: string) {
		let doc: Document;
		let opt: any = {};
		switch (type) {
			case "application/xhtml+xml":
				opt.xmlMode = true;
				doc = new HTMLDocument(type);
				break;
			case "text/html":
				// opt.xmlMode = true;
				doc = new HTMLDocument(type);
				break;
			case "image/svg+xml":
				opt.xmlMode = true;
				doc = new SVGDocument();
				break;
			default:
				opt.xmlMode = true;
				doc = new XMLDocument(type);
		}
		return htmlParser2(doc, doc, opt).then((parser) => {
			parser.write(markup);
			parser.end();
			const { _promises } = parser as any;
			if (_promises) {
				return Promise.all(_promises).then((v) => doc);
			}
			return doc;
		});
	}
}

const HTML5_DOCTYPE = /<?!doctype\s+html\s+>?/i;
const PUBLIC_DOCTYPE =
	/<?!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<?!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /<?!doctype\s+([^\s>]+)/i;

function createDocumentType(doc: Document, dt: string) {
	let [name, pub, sys] = ["html", "", ""];
	if (!HTML5_DOCTYPE.test(dt)) {
		let m;
		if ((m = PUBLIC_DOCTYPE.exec(dt))) {
			[name, pub, sys] = [m[1], m[2], m[3]];
		} else if ((m = SYSTEM_DOCTYPE.exec(dt))) {
			[name, sys] = [m[1], m[2]];
		} else if ((m = CUSTOM_NAME_DOCTYPE.exec(dt))) {
			name = m[1];
		}
	}
	return doc.implementation.createDocumentType(name, pub, sys);
}

import { SaxesParser, SaxesTagNS } from "saxes";
import { ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { runScripts } from "./resource.js";
import {
	Document,
	HTMLDocument,
	SVGDocument,
	XMLDocument,
} from "./document.js";
import { DocumentType } from "./document-type.js";
import { Event } from "./event-target.js";
import { CDATASection } from "./character-data.js";
import { XMLNS } from "./namespace.js";
