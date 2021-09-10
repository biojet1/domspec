import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DOMImplementation.createHTMLDocument()</title>\n<link rel=\"author\" title=\"Nate Chapin\" href=\"mailto:japhet@chromium.org\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument\"/>\n<link rel=\"help\" href=\"https://bugs.chromium.org/p/chromium/issues/detail?id=1086800\"/>\n<meta name=\"assert\" content=\"Calling on createHTMLDocument() on a DOMImplementation from a document with a null browsing context should not crash\"/>\n</head><body><iframe id=\"i\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var doc = i.contentDocument;
i.remove();
doc.implementation.createHTMLDocument();
