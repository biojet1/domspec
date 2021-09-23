import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:h=\"http://www.w3.org/1999/xhtml\" xmlns:pickle=\"http://ns.example.org/pickle\" version=\"1.1\" width=\"100%\" height=\"100%\" viewBox=\"0 0 400 400\">\n<title>firstElementChild with namespaces</title>\n<h:script src=\"/resources/testharness.js\"/>\n<h:script src=\"/resources/testharnessreport.js\"/>\n\n<text x=\"200\" y=\"40\" font-size=\"25\" fill=\"black\" text-anchor=\"middle\">Test of firstElementChild with namespaces</text>\n<g id=\"parentEl\">\n  <pickle:dill id=\"first_element_child\"/>\n</g>\n\n<h:script/>\n</svg>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var fec = parentEl.firstElementChild;
  assert_true(!!fec)
  assert_equals(fec.nodeType, 1)
  assert_equals(fec.getAttribute("id"), "first_element_child")
  assert_equals(fec.localName, "dill")
})
