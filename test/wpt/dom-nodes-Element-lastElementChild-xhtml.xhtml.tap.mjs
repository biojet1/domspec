import "./wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>firstElementChild</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<h1>Test of firstElementChild</h1>\n<div id=\"log\"/>\n<p id=\"parentEl\">The result of <span id=\"first_element_child\">this test</span> is <span id=\"last_element_child\" style=\"font-weight:bold;\">logged</span> above.</p>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = parentEl.lastElementChild;
  assert_true(!!lec)
  assert_equals(lec.nodeType, 1)
  assert_equals(lec.getAttribute("id"), "last_element_child")
})
