import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=ASCII\" />\n<title>Entity References</title>\n<script src=\"/resources/testharness.js\"></script>\n<script src=\"/resources/testharnessreport.js\"></script>\n</head>\n<body>\n<h1>Test of Entity References</h1>\n<div id=\"log\"></div>\n<p id=\"parentEl\">The result of this test is <span id=\"first_element_child\" style=\"font-weight:bold;\">unknown.</span></p>\n<script></script>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl")
  var fec = parentEl.firstElementChild;
  assert_true(!!fec)
  assert_equals(fec.nodeType, 1)
  assert_equals(fec.getAttribute("id"), "first_element_child")
})
