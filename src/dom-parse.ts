function domParse(
	doc: Document,
	top: Document | Element | ParentNode,
	options?: any
) {
	const opt = options || {};
	const parent = top;
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
		if (!ns) {
			ns = (parent as Element)?.namespaceURI;
		}
		if (!ns && doc.isSVG) {
			ns = "http://www.w3.org/2000/svg";
		}
		let tag;
		if (ns) {
			tag = doc.createElementNS(ns, name);
		} else {
			tag = doc.createElement(name);
		}

		const attrs = Object.entries(attributes);

		for (const [key, { uri, value }] of attrs) {
			if (uri) {
				tag.setAttributeNS(uri, key, value);
			} else {
				tag.setAttribute(key, value);
			}
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

export function getNamespace(
	prefix: string,
	cur: Element,
	attribs?: { [key: string]: string }
) {
	if (attribs) {
		for (const [key, value] of Object.entries(attribs)) {
			const i = key.indexOf(":");
			if (i < 0) {
				if (!prefix && key === "xmlns") {
					return value;
				}
			} else if (
				key.substring(0, i) === "xmlns" &&
				key.substring(i + 1) === prefix
			) {
				return value;
			}
		}
	}
	if (!prefix) {
		return cur.namespaceURI;
	}
	return cur.lookupNamespaceURI(prefix) || "";
}

function _appendChild(parent: ParentNode, node: Node) {
	const ref = parent.endNode;
	node._attach(ref[PREV] || parent, ref, parent);
}

export function htmlParser2(doc: Document, top: ParentNode, options?: any) {
	const opt = options || {};
	const TOP = top;
	opt.recognizeSelfClosing = true;
	if (opt.xmlMode === undefined) {
		opt.xmlMode = doc.contentType.indexOf("xml") >= 0;
	}
	// opt.recognizeCDATA = true;
	return import("htmlparser2").then((mod) => {
		let cdata: CDATASection | null;
		const handler = {
			// onopentagname(name: string) {
			// 	let tag;
			// 	const i = name.indexOf(":");
			// 	if (i < 0) {
			// 		// const ns = top.lookupNamespaceURI("");
			// 		// tag = doc.createElement(name);
			// 		// tag = doc.createElementNS(ns, name);
			// 		tag = doc.createElement(name);
			// 	} else {
			// 		const prefix = name.substring(0, i);
			// 		const local = name.substring(i + 1);
			// 		const ns = top.lookupNamespaceURI(prefix);
			// 		tag = doc.createElementNS(ns, local);
			// 	}
			// 	top.appendChild(tag);
			// 	top = tag;
			// },
			onopentag(name: string, attribs: { [key: string]: string }): void {
				// const type = this.options.xmlMode ? ElementType.Tag : undefined;
				// const element = new Element(name, attribs, undefined, type);
				// this.addNode(element);
				// this.tagStack.push(element);
				let tag;
				const i = name.indexOf(":");
				if (i < 0) {
					const ns = getNamespace("", top as Element, attribs);
					// tag = doc.createElement(name);
					L1: {
						if (name === "svg") {
							if (HTML_NS == ns) {
								tag = doc.createElementNS(SVG_NS, name);
								break L1;
							}
						}
						if (ns) {
							tag = doc.createElementNS(ns, name);
						} else {
							tag = doc.createElement(name);
						}
					}
				} else {
					const prefix = name.substring(0, i);
					const local = name.substring(i + 1);
					// const ns = top.lookupNamespaceURI(prefix);
					const ns = getNamespace(prefix, top as Element, attribs);
					if (ns) {
						tag = doc.createElementNS(ns, local);
					} else {
						throw new Error(`no namespace for ${name}`);
					}
				}
				for (const [key, value] of Object.entries(attribs)) {
					const i = key.indexOf(":");
					if (i < 0) {
						// tag.setAttributeNS(null, key, value);
						tag._letAttributeNode(key).value = value;
					} else {
						const prefix = key.substring(0, i);
						let ns;
						switch (prefix) {
							case "xmlns":
								ns = XMLNS;
								break;
							default:
								ns = getNamespace(prefix, top as Element, attribs);
						}
						// tag.setAttributeNS(ns, key, value);
						tag._letAttributeNodeNS(ns, key).value = value;
					}
				}
				// top.appendChild(tag);
				_appendChild(top, tag);

				top = tag;
			},
			onclosetag(name: string) {
				const { parentNode } = top;
				// delete (top as any)._nsmap;
				const tag = top as Element;
				if (parentNode) {
					top = parentNode;
				} else {
					/* c8 ignore next */
					throw new Error(`unexpected null parentNode of ${top}`);
				}

				if (tag.localName == "script") {
					// console.warn("script", "pause");
					// parser.pause();
					// const P = runScript(tag, opt.resourceLoader).then(() => {
					// 	console.warn("script", "resume");
					// 	parser.resume();
					// });
					// let PS = (parser as any)._promises;
					// if (PS) {
					// 	PS.push(P);
					// } else {
					// 	(parser as any)._promises = [P];
					// }

					let ss = (parser as any).scripts;
					if (ss) {
						ss.push(tag);
					} else {
						(parser as any).scripts = [tag];
					}
				}
			},
			// onattribute(name: string, value: string) {
			// 	const i = name.indexOf(":");
			// 	if (i < 0) {
			// 		// switch (name) {
			// 		// 	case "xmlns": {
			// 		// 		get_prefix_map(top)[true] = value;
			// 		// 		break;
			// 		// 	}
			// 		// }
			// 		(top as Element).setAttributeNS(null, name, value);
			// 	} else {
			// 		const prefix = name.substring(0, i);
			// 		// const local = name.substring(i + 1);
			// 		let ns;
			// 		switch (prefix) {
			// 			case "xmlns":
			// 				ns = XMLNS;
			// 				break;
			// 			default:
			// 				ns = top.lookupNamespaceURI(prefix);
			// 		}
			// 		(top as Element).setAttributeNS(ns, name, value);
			// 	}
			// },
			ontext(text: string) {
				if (cdata) {
					// console.warn(`ontext cdata (${text})`);
					cdata.data += text;
				} else if (top.nodeType !== 9) {
					// console.warn(`ontext (${text})`);
					// top.appendChild(doc.createTextNode(text));
					_appendChild(top, doc.createTextNode(text));
				}
			},
			oncomment(data: string) {
				// top.appendChild(doc.createComment(data));
				_appendChild(top, doc.createComment(data));
			},
			onprocessinginstruction(name: string, data: string) {
				// console.warn(`onprocessinginstruction (${name}) (${data})`);
				switch (name) {
					case "!DOCTYPE":
					case "!doctype":
						if (top !== doc) {
							throw new Error("Doctype can only be appended to document");
						}
						// top.appendChild(createDocumentType(doc, data));
						_appendChild(top, createDocumentType(doc, data));
						break;
					case "?xml":
						// case "?xml-stylesheet":
						if (!top.firstChild) {
							break;
						}
					default:
						const m = data.match(/^\?\s*([^\s]+)\s+(.*)\s*\?$/);
						// console.warn(
						// 	`onpi`,
						// 	JSON.stringify(data),
						// 	JSON.stringify(m)
						// );
						m && _appendChild(top, doc.createProcessingInstruction(m[1], m[2]));
					// top.appendChild(
					// 	doc.createProcessingInstruction(m[1], m[2])
					// )
				}
			},
			oncdatastart() {
				cdata = doc.createCDATASection("");
			},
			oncdataend() {
				if (cdata) {
					// top.appendChild(cdata);
					_appendChild(top, cdata);
					cdata = null;
				}
			},

			onend() {
				if (TOP === doc && doc.isHTML) {
					let first;
					for (const e of doc.children) {
						if (e.localName !== "html") {
							const ref = e.startNode[PREV] || doc;
							const kids = Array.from(doc.childNodes).filter((e) => {
								switch (e.nodeType) {
									case 8:
									case 1:
										return true;
								}
							});
							const html = doc.createElement("html");
							html._attach(ref, ref.endNode[NEXT] || doc[END], doc);
							for (const c of kids) {
								c._detach();
								_appendChild(html, c);
							}
							break;
						}
					}
					for (const html of doc.children) {
						if (html.localName === "html") {
							let head, body;
							for (const child of Array.from(html.children)) {
								// console.warn("child", child.localName)
								switch (child.localName) {
									case "head":
										if (head) {
											for (const c of Array.from(child.childNodes)) {
												c._detach();
												_appendChild(head, c);
											}
										} else {
											head = child;
										}
										break;
									case "body":
										if (body) {
											for (const c of Array.from(child.childNodes)) {
												c._detach();
												_appendChild(body, c);
											}
										} else {
											body = child;
										}
										break;
									case "meta":
									case "style":
									case "script":
									case "noscript":
									case "base":
									case "link":
									case "title":
										if (!body) {
											if (!head) {
												head = doc.createElement("head");
												head._attach(child[PREV] || html, child, html);
											}
											child._detach();
											_appendChild(head, child);
											break;
										} // fall
									default:
										if (!body) {
											body = doc.createElement("body");
											body._attach(child[PREV] || html, child, html);
										}
										child._detach();
										_appendChild(body, child);
								}
							}
							break;
						}
					}
				}
				let scripts = (parser as any).scripts;
				if (scripts) {
					process.nextTick(() => {
						runScripts(scripts, opt.resourceLoader)
							.then(() => {
								if (scripts.length !== 0) {
									throw new Error(`Unexpected`);
								}
								const { defaultView: window } = doc;
								// console.error("WINDOW LOAD");
								if (window) {
									window.dispatchEvent(new Event("load"));
								}
							})
							.catch((err) => {
								console.error("Error running scripts", err);
							});
					});
				}
			},
		};

		const { Parser } = mod;
		const parser = new Parser(handler, opt);
		return parser;
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
	static parseString(markup: string, type?: string) {
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

	parseFromString(markup: string, type?: string) {
		return DOMParser.parseString(markup, type);
	}
	async parseFile(path: string, type?: string) {
		return import("fs/promises")
			.then((mod) => mod.readFile(path, { encoding: "utf-8" }))
			.then((content) => this.parseFromString(content));
	}

	static async loadXML(
		src: string | URL,
		opt: { xinclude?: boolean | string; select?: string; type?: string } = {}
	) {
		const { xinclude, select, type } = opt;
		return (() => {
			if (xinclude || select) {
				const cmd = Array.from(
					(function* () {
						if (src instanceof URL) {
							yield `curl -L "${src}" | xmllint --xinclude -`;
						} else {
							yield `xmllint --xinclude "${src}"`;
						}
						if (select) {
							yield `--xpath '${select}'`;
						}
					})()
				).join(" ");
				return Promise.all([import("util"), import("child_process")])
					.then(([{ promisify }, { exec }]) => promisify(exec)(cmd))
					.then(({ stdout: data }) => data);
			} else {
				return import("fs").then((fs) =>
					fs.promises.readFile(src as string, { encoding: "utf8", flag: "r" })
				);
			}
		})()
			.then((data) => DOMParser.parseString(data, type))
			.catch((err) => {
				console.error(`Failed to load "${src}"`);
				throw err;
			});
	}
}

const HTML5_DOCTYPE = /^<?!doctype\s+html\s+>?$/i;
const PUBLIC_DOCTYPE =
	/^<?!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /^<?!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /^<?!doctype\s+([^\s>]+)/i;

function createDocumentType(doc: Document, dt: string) {
	let [name, pub, sys] = ["html", "", ""];
	// console.info(`createDocumentType`, dt);
	if (!HTML5_DOCTYPE.test(dt)) {
		let m;
		if ((m = PUBLIC_DOCTYPE.exec(dt))) {
			[name, pub, sys] = [m[1], m[2], m[3]];
		} else if ((m = SYSTEM_DOCTYPE.exec(dt))) {
			[name, sys] = [m[1], m[2]];
		} else if ((m = CUSTOM_NAME_DOCTYPE.exec(dt))) {
			name = m[1];
		}
		// console.info(`createDocumentType !HTML5_DOCTYPE`, [name, pub, sys], m);
	}

	return doc.implementation.createDocumentType(name, pub, sys);
}

import { SaxesParser, SaxesTagNS } from "saxes";
import { ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { runScripts, runScript } from "./resource.js";
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
import { PREV, NEXT, END, Node } from "./node.js";
import { HTML_NS, SVG_NS } from "./namespace.js";
