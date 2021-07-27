function domParse(str: string, doc: Document, top: ParentNode) {
	const parser = new SaxesParser({
		// lowercase: true,
		xmlns: true,
		strictEntities: true,
	});

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
		node.ownerDocument = doc;
		top.appendChild(node);
	});
	parser.on("text", (str: string) => {
		// console.info("text", top.nodeName, str);
		top.appendChild(doc.createTextNode(str));
	});
	parser.on("comment", (str: string) => {
		// console.info("comment", top.nodeName, str);
		top.appendChild(doc.createComment(str));
	});
	parser.on("cdata", (data) => {
		top.appendChild(doc.createCDATASection(data));
	});

	parser.on("opentag", (node) => {
		// console.log("opentag", node.name, top.nodeName);
		// console.dir(top, { depth: 1 });

		const { local, attributes, uri, prefix, name } = node;
		if (name === ROOT_TAG) return;
		let ns = !uri || uri === "" ? null : uri;
		if (!ns && prefix && prefix != "") {
			ns = top.lookupNamespaceURI(prefix);
		}

		const tag = doc.createElementNS(ns, name);

		const attrs = Object.entries(attributes);

		attrs.sort(function (a, b) {
			var nameA = a[0];
			var nameB = b[0];
			if (nameA < nameB) {
				return 1;
			}
			if (nameA > nameB) {
				return -1;
			}
			// names must be equal
			return 0;
		});

		for (const [key, { uri, value }] of attrs) {
			tag.setAttributeNS(uri, key, value);
		}
		top.appendChild(tag);
		top = tag;
	});

	parser.on("closetag", (node) => {
		if (node.name === ROOT_TAG) return;
		// console.log("closetag",  node.name, top.nodeName);
		// !top.lastChild && console.log("Empty",  node.name, top.nodeName);
		// node.isSelfClosing && console.log("isSelfClosing",  node.name, top.nodeName);

		const { parentNode } = top;
		// console.dir(top, { depth: 1 });
		if (!node.isSelfClosing) {
			// console.log("lastChild", node.name, top.nodeName,  top.lastChild);

			top.lastChild || top.appendChild(doc.createTextNode(""));
		}
		if (parentNode) {
			top = parentNode;
		} else {
			throw new Error(`unexpected null parentNode of ${top}`);
		}
	});

	parser.write(str);
}

export const parseDOM = function (
	str: string,
	parent: ParentNode // Element | Document | DocumentFragment
) {
	if (parent instanceof Document) {
		domParse(str, parent, parent);
	} else {
		const doc = parent.ownerDocument;
		// sax expects a root element but we also missuse it to parse fragments
		if (doc) domParse(`<${ROOT_TAG}>${str}</${ROOT_TAG}>`, doc, parent);
	}
};

export class DOMParser {
	parseFromString(markup: string, type?: string) {
		let doc: Document;
		switch (type) {
			case "text/html":
				doc = new HTMLDocument();
				break;
			case "image/svg+xml":
				doc = new SVGDocument();
				break;
			default:
				doc = new Document();
		}
		domParse(markup, doc, doc);
		return doc;
	}
}

const ROOT_TAG = "parser:Root";

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /<!doctype\s+([^\s>]+)/i;

import { ParentNode } from "./parent-node.js";
import { SaxesParser } from "saxes";
import { Document } from "./document.js";
import { HTMLDocument } from "./html/document.js";
import { SVGDocument } from "./svg/document.js";
