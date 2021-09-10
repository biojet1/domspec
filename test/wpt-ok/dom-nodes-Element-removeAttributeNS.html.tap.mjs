import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Element.removeAttributeNS</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"attributes.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/attributes.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var XML = "http://www.w3.org/XML/1998/namespace"

test(function() {
  var el = document.createElement("foo")
  el.setAttributeNS(XML, "a:bb", "pass")
  attr_is(el.attributes[0], "pass", "bb", XML, "a", "a:bb")
  el.removeAttributeNS(XML, "a:bb")
  assert_equals(el.attributes.length, 1)
  attr_is(el.attributes[0], "pass", "bb", XML, "a", "a:bb")
}, "removeAttributeNS should take a local name.")
