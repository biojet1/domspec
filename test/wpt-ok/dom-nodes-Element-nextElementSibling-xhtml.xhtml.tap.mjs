import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>nextElementSibling</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>Test of nextElementSibling</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of <span id=\"first_element_child\">this test</span> is <span id=\"last_element_child\" style=\"font-weight:bold;\">unknown.</span></p>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var fec = document.getElementById("first_element_child");
  var nes = fec.nextElementSibling;
  assert_true(!!nes)
  assert_equals(nes.nodeType, 1)
  assert_equals(nes.getAttribute("id"), "last_element_child")
})
