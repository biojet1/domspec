import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Node.nodeName</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml",
      SVGNS = "http://www.w3.org/2000/svg"
  assert_equals(document.createElementNS(HTMLNS, "I").nodeName, "I")
  assert_equals(document.createElementNS(HTMLNS, "i").nodeName, "I")
  assert_equals(document.createElementNS(SVGNS, "svg").nodeName, "svg")
  assert_equals(document.createElementNS(SVGNS, "SVG").nodeName, "SVG")
  assert_equals(document.createElementNS(HTMLNS, "x:b").nodeName, "X:B")
}, "For Element nodes, nodeName should return the same as tagName.")
test(function() {
  assert_equals(document.createTextNode("foo").nodeName, "#text")
}, "For Text nodes, nodeName should return \"#text\".")
test(function() {
  assert_equals(document.createComment("foo").nodeName, "#comment")
}, "For Comment nodes, nodeName should return \"#comment\".")
test(function() {
  assert_equals(document.nodeName, "#document")
}, "For Document nodes, nodeName should return \"#document\".")
test(function() {
  assert_equals(document.doctype.nodeName, "html")
}, "For DocumentType nodes, nodeName should return the name.")
test(function() {
  assert_equals(document.createDocumentFragment().nodeName,
                "#document-fragment")
}, "For DocumentFragment nodes, nodeName should return \"#document-fragment\".")
