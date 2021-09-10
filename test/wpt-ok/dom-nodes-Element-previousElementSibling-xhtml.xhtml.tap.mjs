import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>previousElementSibling</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>Test of previousElementSibling</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of <span id=\"first_element_child\">this test</span> is\n<span id=\"middle_element_child\" style=\"font-weight:bold;\">unknown.</span>\n\n\n\n<span id=\"last_element_child\" style=\"display:none;\">fnord</span> </p>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = document.getElementById("last_element_child");
  var pes = lec.previousElementSibling;
  assert_true(!!pes)
  assert_equals(pes.nodeType, 1)
  assert_equals(pes.getAttribute("id"), "middle_element_child")
})
