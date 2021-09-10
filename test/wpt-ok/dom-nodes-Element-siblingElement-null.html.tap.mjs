import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Null test</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>Test of previousElementSibling and nextElementSibling returning null</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of this test is <span id=\"first_element_child\" style=\"font-weight:bold;\">unknown.</span></p>\n<script/>\n\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var fec = document.getElementById("first_element_child");
  assert_equals(fec.previousElementSibling, null)
  assert_equals(fec.nextElementSibling, null)
})
