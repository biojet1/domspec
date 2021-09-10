import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>Dynamic Removal of Elements</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>Test of Removal Adding of Elements</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of this test is\n<span id=\"first_element_child\" style=\"font-weight:bold;\">logged above.</span><span id=\"last_element_child\"> </span></p>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = parentEl.lastElementChild;
  parentEl.removeChild(lec);
  assert_equals(parentEl.childElementCount, 1)
})
