import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.getElementsByTagNameNS</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbytagnamens\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-Element-getElementsByTagNameNS.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-Element-getElementsByTagNameNS.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

test_getElementsByTagNameNS(document, document.body);
