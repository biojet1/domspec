import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><title>Element.tagName</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml"
  assert_equals(document.createElementNS(HTMLNS, "I").tagName, "I")
  assert_equals(document.createElementNS(HTMLNS, "i").tagName, "I")
  assert_equals(document.createElementNS(HTMLNS, "x:b").tagName, "X:B")
}, "tagName should upper-case for HTML elements in HTML documents.")

test(function() {
  var SVGNS = "http://www.w3.org/2000/svg"
  assert_equals(document.createElementNS(SVGNS, "svg").tagName, "svg")
  assert_equals(document.createElementNS(SVGNS, "SVG").tagName, "SVG")
  assert_equals(document.createElementNS(SVGNS, "s:svg").tagName, "s:svg")
  assert_equals(document.createElementNS(SVGNS, "s:SVG").tagName, "s:SVG")

  assert_equals(document.createElementNS(SVGNS, "textPath").tagName, "textPath");
}, "tagName should not upper-case for SVG elements in HTML documents.")

test(() => {
  const el2 = document.createElementNS("http://example.com/", "mixedCase");
  assert_equals(el2.tagName, "mixedCase");
}, "tagName should not upper-case for other non-HTML namespaces");

test(function() {
  if ("DOMParser" in window) {
    var xmlel = new DOMParser()
      .parseFromString('<div xmlns="http://www.w3.org/1999/xhtml">Test</div>', 'text/xml')
      .documentElement;
    assert_equals(xmlel.tagName, "div", "tagName should be lowercase in XML")
    var htmlel = document.importNode(xmlel, true)
    assert_equals(htmlel.tagName, "DIV", "tagName should be uppercase in HTML")
  }
}, "tagName should be updated when changing ownerDocument")

test(function() {
  var xmlel = document.implementation
    .createDocument("http://www.w3.org/1999/xhtml", "div", null)
    .documentElement;
  assert_equals(xmlel.tagName, "div", "tagName should be lowercase in XML")
  var htmlel = document.importNode(xmlel, true)
  assert_equals(htmlel.tagName, "DIV", "tagName should be uppercase in HTML")
}, "tagName should be updated when changing ownerDocument (createDocument without prefix)")

test(function() {
  var xmlel = document.implementation
    .createDocument("http://www.w3.org/1999/xhtml", "foo:div", null)
    .documentElement;
  assert_equals(xmlel.tagName, "foo:div", "tagName should be lowercase in XML")
  var htmlel = document.importNode(xmlel, true)
  assert_equals(htmlel.tagName, "FOO:DIV", "tagName should be uppercase in HTML")
}, "tagName should be updated when changing ownerDocument (createDocument with prefix)")
