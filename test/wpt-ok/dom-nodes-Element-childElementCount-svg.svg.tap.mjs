import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:h=\"http://www.w3.org/1999/xhtml\" version=\"1.1\" width=\"100%\" height=\"100%\" viewBox=\"0 0 400 400\">\n<title>childElementCount</title>\n<h:script src=\"/resources/testharness.js\"/>\n<h:script src=\"/resources/testharnessreport.js\"/>\n\n<text x=\"200\" y=\"40\" font-size=\"25\" fill=\"black\" text-anchor=\"middle\">Test of childElementCount</text>\n<text id=\"parentEl\" x=\"200\" y=\"70\" font-size=\"20\" fill=\"black\" text-anchor=\"middle\">The result of <tspan id=\"first_element_child\"><tspan>this</tspan> <tspan>test</tspan></tspan> is\n<tspan id=\"middle_element_child\" font-weight=\"bold\">unknown.</tspan>\n\n\n\n<tspan id=\"last_element_child\" style=\"display:none;\">fnord</tspan> </text>\n\n<h:script/>\n</svg>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var parentEl = document.getElementById("parentEl")
  assert_true("childElementCount" in parentEl)
  assert_equals(parentEl.childElementCount, 3)
})
