import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Text constructor</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-text\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Comment-Text-constructor.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Comment-Text-constructor.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

test_constructor("Text");
