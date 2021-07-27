import { Document } from "./document.js";

function domParse(str: string, doc: Document, currentTag: ParentNode) {
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

		if (currentTag !== doc) {
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
		currentTag.appendChild(node);
	});
	parser.on("text", (str: string) => {
		console.log("text", currentTag.nodeName, str);
		currentTag.appendChild(doc.createTextNode(str));
	});
	parser.on("comment", (str: string) => {
		console.log("comment", currentTag.nodeName, str);

		currentTag.appendChild(doc.createComment(str));
	});
	parser.on("cdata", (data) => {
		currentTag.appendChild(doc.createCDATASection(data));
	});

	parser.on("opentag", (node) => {
		console.log("opentag", node.name, currentTag.nodeName);
		// console.dir(currentTag, { depth: 1 });

		const { local, attributes, uri, prefix, name } = node;
		if (name === ROOT_TAG) return;
		let ns = !uri || uri === "" ? null : uri;
		if (!ns && prefix && prefix != "") {
			ns = currentTag.lookupNamespaceURI(prefix);
		}

		const tag = doc.createElementNS(ns, name);

		for (const [key, { uri, value }] of Object.entries(attributes)) {
			tag.setAttributeNS(uri, key, value);
		}
		currentTag.appendChild(tag);
		currentTag = tag;
	});

	// parser.on("opentag", (tag) => {
	// 	const { local: tagLocal, attributes: tagAttributes } = tag;

	// 	const ownerDocument = getOwnerDocument();
	// 	const tagNamespace = tag.uri === "" ? null : tag.uri;
	// 	const tagPrefix = tag.prefix === "" ? null : tag.prefix;
	// 	const isValue =
	// 		tagAttributes.is === undefined ? null : tagAttributes.is.value;

	// 	const elem = createElement(
	// 		ownerDocument,
	// 		tagLocal,
	// 		tagNamespace,
	// 		tagPrefix,
	// 		isValue,
	// 		true
	// 	);

	// 	// We mark a script element as "parser-inserted", which prevents it from
	// 	// being immediately executed.
	// 	if (tagLocal === "script" && tagNamespace === HTML_NS) {
	// 		elem._parserInserted = true;
	// 	}

	// 	for (const key of Object.keys(tagAttributes)) {
	// 		const { prefix, local, uri, value } = tagAttributes[key];
	// 		attributes.setAttributeValue(
	// 			elem,
	// 			local,
	// 			value,
	// 			prefix === "" ? null : prefix,
	// 			uri === "" ? null : uri
	// 		);
	// 	}

	// 	appendChild(elem);
	// 	openStack.push(elem);
	// });

	parser.on("closetag", (node) => {
		if (node.name === ROOT_TAG) return;
		console.log("closetag", node.name, currentTag.nodeName);

		const { parentNode } = currentTag;
		// console.dir(currentTag, { depth: 1 });
		if (parentNode) {
			currentTag = parentNode;
		} else {
			throw new Error(`unexpected null parentNode of ${currentTag}`);
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

const ROOT_TAG = "parser:Root";

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /<!doctype\s+([^\s>]+)/i;

import { ParentNode } from "./parent-node.js";
import { SaxesParser } from "saxes";
