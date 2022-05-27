import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Tests for case-sensitivity in APIs</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createelement\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createelementns\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbytagname\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbytagnamens\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-setattribute\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-setattributens\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-hasattribute\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-hasattributens\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-getelementsbytagname\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-getelementsbytagnamens\"/>\n<script/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"case.js\"/>\n</head><body><div id=\"log\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/case.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)
var is_html = true;