import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Dynamic Removal of Elements</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>Test of Dynamic Removal of Elements</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of this test is\n<span id=\"first_element_child\" style=\"font-weight:bold;\">unknown.</span><span id=\"last_element_child\"> </span></p>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = parentEl.lastElementChild;
  parentEl.removeChild(lec);
  assert_equals(parentEl.childElementCount, 1)
})
