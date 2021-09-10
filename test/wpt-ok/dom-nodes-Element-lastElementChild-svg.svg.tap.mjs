import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:h=\"http://www.w3.org/1999/xhtml\" version=\"1.1\" width=\"100%\" height=\"100%\" viewBox=\"0 0 400 400\">\n<title>lastElementChild</title>\n<h:script src=\"/resources/testharness.js\"/>\n<h:script src=\"/resources/testharnessreport.js\"/>\n\n<text x=\"200\" y=\"40\" font-size=\"25\" fill=\"black\" text-anchor=\"middle\">Test of lastElementChild</text>\n<text id=\"parentEl\" x=\"200\" y=\"70\" font-size=\"20\" fill=\"black\" text-anchor=\"middle\">The result of <tspan id=\"first_element_child\">this test</tspan> is <tspan id=\"last_element_child\" font-weight=\"bold\">not</tspan> known.</text>\n\n<h:script/>\n</svg>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl");
  var lec = parentEl.lastElementChild;
  assert_true(!!lec)
  assert_equals(lec.nodeType, 1)
  assert_equals(lec.getAttribute("id"), "last_element_child")
})
