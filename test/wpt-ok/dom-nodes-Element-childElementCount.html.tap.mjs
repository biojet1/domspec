import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>childElementCount</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>Test of childElementCount</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of <span id=\"first_element_child\"><span>this</span> <span>test</span></span> is\n<span id=\"middle_element_child\" style=\"font-weight:bold;\">given above.</span>\n\n\n\n<span id=\"last_element_child\" style=\"display:none;\">fnord</span> </p>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var parentEl = document.getElementById("parentEl")
  assert_true("childElementCount" in parentEl)
  assert_equals(parentEl.childElementCount, 3)
})
