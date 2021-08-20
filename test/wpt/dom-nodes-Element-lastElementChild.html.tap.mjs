import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>lastElementChild</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>Test of lastElementChild</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of <span id=\"first_element_child\">this test</span> is <span id=\"last_element_child\" style=\"font-weight:bold;\">logged</span> above.</p>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = parentEl.lastElementChild;
  assert_true(!!lec)
  assert_equals(lec.nodeType, 1)
  assert_equals(lec.getAttribute("id"), "last_element_child")
})
