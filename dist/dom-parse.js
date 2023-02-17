function domParse(doc, top, options) {
    const opt = options || {};
    const parent = top;
    const parser = new SaxesParser({
        xmlns: true,
        strictEntities: true,
        ...opt,
    });
    const scripts = opt.runScripts !== false ? [] : undefined;
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
    parser.on("text", (str) => {
        if (top.nodeType !== 9)
            top.appendChild(doc.createTextNode(str));
    });
    parser.on("comment", (str) => {
        top.appendChild(doc.createComment(str));
    });
    parser.on("cdata", (data) => {
        if (isHTML) {
            top.appendChild(doc.createTextNode(data));
        }
        else
            top.appendChild(doc.createCDATASection(data));
    });
    parser.on("opentag", (node) => {
        const { local, attributes, uri, prefix, name } = node;
        let ns = uri || null;
        if (!ns && prefix) {
            ns = top.lookupNamespaceURI(prefix);
        }
        if (!ns) {
            ns = parent?.namespaceURI;
        }
        if (!ns && doc.isSVG) {
            ns = "http://www.w3.org/2000/svg";
        }
        let tag;
        if (ns) {
            tag = doc.createElementNS(ns, name);
        }
        else {
            tag = doc.createElement(name);
        }
        const attrs = Object.entries(attributes);
        for (const [key, { uri, value }] of attrs) {
            if (uri) {
                tag.setAttributeNS(uri, key, value);
            }
            else {
                tag.setAttribute(key, value);
            }
        }
        top.appendChild(tag);
        top = tag;
    });
    parser.on("closetag", (node) => {
        const { parentNode } = top;
        if (node.isSelfClosing) {
            top._parsed_closed = true;
        }
        if (scripts && top.localName == "script") {
            scripts.push(top);
        }
        if (parentNode) {
            top = parentNode;
        }
        else {
            throw new Error(`unexpected null parentNode of ${top}`);
        }
    });
    parser.on("end", function () {
        if (scripts) {
            runScripts(scripts, opt.resourceLoader)
                .then(() => {
                if (scripts.length !== 0) {
                    throw new Error();
                }
                const { defaultView: window } = doc;
                if (window) {
                    window.dispatchEvent(new Event("load"));
                }
            });
        }
    });
    return parser;
}
export function getNamespace(prefix, cur, attribs) {
    if (attribs) {
        for (const [key, value] of Object.entries(attribs)) {
            const i = key.indexOf(":");
            if (i < 0) {
                if (!prefix && key === "xmlns") {
                    return value;
                }
            }
            else if (key.substring(0, i) === "xmlns" &&
                key.substring(i + 1) === prefix) {
                return value;
            }
        }
    }
    if (!prefix) {
        return cur.namespaceURI;
    }
    return cur.lookupNamespaceURI(prefix) || "";
}
function _appendChild(parent, node) {
    const ref = parent.endNode;
    node._attach(ref[PREV] || parent, ref, parent);
}
export function htmlParser2(doc, top, options) {
    const opt = options || {};
    const TOP = top;
    opt.recognizeSelfClosing = true;
    if (opt.xmlMode === undefined) {
        opt.xmlMode = doc.contentType.indexOf("xml") >= 0;
    }
    return import("htmlparser2").then((mod) => {
        let cdata;
        const handler = {
            onopentag(name, attribs) {
                let tag;
                const i = name.indexOf(":");
                if (i < 0) {
                    const ns = getNamespace("", top, attribs);
                    L1: {
                        if (name === "svg") {
                            if (HTML_NS == ns) {
                                tag = doc.createElementNS(SVG_NS, name);
                                break L1;
                            }
                        }
                        if (ns) {
                            tag = doc.createElementNS(ns, name);
                        }
                        else {
                            tag = doc.createElement(name);
                        }
                    }
                }
                else {
                    const prefix = name.substring(0, i);
                    const local = name.substring(i + 1);
                    const ns = getNamespace(prefix, top, attribs);
                    if (ns) {
                        tag = doc.createElementNS(ns, local);
                    }
                    else {
                        throw new Error(`no namespace for ${name}`);
                    }
                }
                for (const [key, value] of Object.entries(attribs)) {
                    const i = key.indexOf(":");
                    if (i < 0) {
                        tag._letAttributeNode(key).value = value;
                    }
                    else {
                        const prefix = key.substring(0, i);
                        let ns;
                        switch (prefix) {
                            case "xmlns":
                                ns = XMLNS;
                                break;
                            default:
                                ns = getNamespace(prefix, top, attribs);
                        }
                        tag._letAttributeNodeNS(ns, key).value = value;
                    }
                }
                _appendChild(top, tag);
                top = tag;
            },
            onclosetag(name) {
                const { parentNode } = top;
                const tag = top;
                if (parentNode) {
                    top = parentNode;
                }
                else {
                    throw new Error(`unexpected null parentNode of ${top}`);
                }
                if (tag.localName == "script") {
                    let ss = parser.scripts;
                    if (ss) {
                        ss.push(tag);
                    }
                    else {
                        parser.scripts = [tag];
                    }
                }
            },
            ontext(text) {
                if (cdata) {
                    cdata.data += text;
                }
                else if (top.nodeType !== 9) {
                    _appendChild(top, doc.createTextNode(text));
                }
            },
            oncomment(data) {
                _appendChild(top, doc.createComment(data));
            },
            onprocessinginstruction(name, data) {
                switch (name) {
                    case "!DOCTYPE":
                    case "!doctype":
                        if (top !== doc) {
                            throw new Error("Doctype can only be appended to document");
                        }
                        _appendChild(top, createDocumentType(doc, data));
                        break;
                    case "?xml":
                        if (!top.firstChild) {
                            break;
                        }
                    default:
                        const m = data.match(/^\?\s*([^\s]+)\s+(.*)\s*\?$/);
                        m && _appendChild(top, doc.createProcessingInstruction(m[1], m[2]));
                }
            },
            oncdatastart() {
                cdata = doc.createCDATASection("");
            },
            oncdataend() {
                if (cdata) {
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
                                switch (child.localName) {
                                    case "head":
                                        if (head) {
                                            for (const c of Array.from(child.childNodes)) {
                                                c._detach();
                                                _appendChild(head, c);
                                            }
                                        }
                                        else {
                                            head = child;
                                        }
                                        break;
                                    case "body":
                                        if (body) {
                                            for (const c of Array.from(child.childNodes)) {
                                                c._detach();
                                                _appendChild(body, c);
                                            }
                                        }
                                        else {
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
                                        }
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
                let scripts = parser.scripts;
                if (scripts) {
                    process.nextTick(() => {
                        runScripts(scripts, opt.resourceLoader)
                            .then(() => {
                            if (scripts.length !== 0) {
                                throw new Error(`Unexpected`);
                            }
                            const { defaultView: window } = doc;
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
export const pushDOMParser = function (parent, opt) {
    if (parent instanceof Document) {
        return domParse(parent, parent, opt);
    }
    const { ownerDocument: doc } = parent;
    if (doc) {
        if (opt) {
            opt.fragment = true;
        }
        else {
            opt = { fragment: true };
        }
        return domParse(doc, parent, opt);
    }
    throw new Error(`No ownerDocument`);
};
export const parseDOM = function (str, parent, opt = {}) {
    pushDOMParser(parent, opt).write(str);
};
export class DOMParser {
    static parseString(markup, type) {
        let doc;
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
    parseFromString(markup, type) {
        return DOMParser.parseString(markup, type);
    }
    async parseFile(path, type) {
        return import("fs/promises")
            .then((mod) => mod.readFile(path, { encoding: "utf-8" }))
            .then((content) => this.parseFromString(content));
    }
    static async loadXML(src, opt = {}) {
        const { xinclude, select, type } = opt;
        return (() => {
            if (xinclude || select) {
                const cmd = Array.from((function* () {
                    if (src instanceof URL) {
                        yield `curl -L "${src}" | xmllint --xinclude -`;
                    }
                    else {
                        yield `xmllint --xinclude "${src}"`;
                    }
                    if (select) {
                        yield `--xpath '${select}'`;
                    }
                })()).join(" ");
                return Promise.all([import("util"), import("child_process")])
                    .then(([{ promisify }, { exec }]) => promisify(exec)(cmd))
                    .then(({ stdout: data }) => data);
            }
            else {
                return import("fs").then((fs) => fs.promises.readFile(src, { encoding: "utf8", flag: "r" }));
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
const PUBLIC_DOCTYPE = /^<?!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /^<?!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;
const CUSTOM_NAME_DOCTYPE = /^<?!doctype\s+([^\s>]+)/i;
function createDocumentType(doc, dt) {
    let [name, pub, sys] = ["html", "", ""];
    if (!HTML5_DOCTYPE.test(dt)) {
        let m;
        if ((m = PUBLIC_DOCTYPE.exec(dt))) {
            [name, pub, sys] = [m[1], m[2], m[3]];
        }
        else if ((m = SYSTEM_DOCTYPE.exec(dt))) {
            [name, sys] = [m[1], m[2]];
        }
        else if ((m = CUSTOM_NAME_DOCTYPE.exec(dt))) {
            name = m[1];
        }
    }
    return doc.implementation.createDocumentType(name, pub, sys);
}
import { SaxesParser } from "saxes";
import { runScripts } from "./resource.js";
import { Document, HTMLDocument, SVGDocument, XMLDocument, } from "./document.js";
import { DocumentType } from "./document-type.js";
import { Event } from "./event-target.js";
import { XMLNS } from "./namespace.js";
import { PREV, NEXT, END } from "./node.js";
import { HTML_NS, SVG_NS } from "./namespace.js";
//# sourceMappingURL=dom-parse.js.map