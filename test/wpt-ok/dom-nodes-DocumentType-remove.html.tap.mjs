import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DocumentType.remove</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-childnode-remove\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"ChildNode-remove.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/ChildNode-remove.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var node, parentNode;
setup(function() {
  node = document.implementation.createDocumentType("html", "", "");
  parentNode = document.implementation.createDocument(null, "", null);
});
testRemove(node, parentNode, "doctype");
