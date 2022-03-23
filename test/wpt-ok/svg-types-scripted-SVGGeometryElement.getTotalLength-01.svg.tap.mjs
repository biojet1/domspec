import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:h=\"http://www.w3.org/1999/xhtml\">\n  <title>SVGGeometryElement.prototype.getTotalLength() query with 'pathLength'</title>\n  <h:link rel=\"help\" href=\"https://svgwg.org/svg2-draft/types.html#__svg__SVGGeometryElement__getTotalLength\"/>\n  <h:script src=\"/resources/testharness.js\"/>\n  <h:script src=\"/resources/testharnessreport.js\"/>\n  <script/>\n</svg>"
const document = loadDOM(html, `application/xml`)

test(function() {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0L100,0L100,100');
    path.setAttribute('pathLength', '1000');
    assert_approx_equals(path.getTotalLength(), 200, 1e-5);
}, document.title+', getTotalLength');
  