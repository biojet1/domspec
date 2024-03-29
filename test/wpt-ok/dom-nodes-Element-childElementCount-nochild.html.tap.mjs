import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>childElementCount without Child Element Nodes</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>Test of childElementCount with No Child Element Nodes</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\" style=\"font-weight:bold;\">Test.</p>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var parentEl = document.getElementById("parentEl")
  assert_equals(parentEl.childElementCount, 0)
})
