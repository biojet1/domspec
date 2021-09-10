import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>Node.isEqualNode</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<script/>\n<iframe id=\"subset1\" onload=\"iframeLoaded()\" src=\"Node-isEqualNode-iframe1.xml\"/>\n<iframe id=\"subset2\" onload=\"iframeLoaded()\" src=\"Node-isEqualNode-iframe2.xml\"/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

function testNullHandling(node) {
  test(function() {
    assert_false(node.isEqualNode(null))
    assert_false(node.isEqualNode(undefined))
  })
}
[
  document.createElement("foo"),
  document.createTextNode("foo"),
  document.createProcessingInstruction("foo", "bar"),
  document.createComment("foo"),
  document,
  document.implementation.createDocumentType("html", "", ""),
  document.createDocumentFragment()
].forEach(testNullHandling)

test(function() {
  var a = document.createElement("foo")
  a.setAttribute("a", "bar")
  a.setAttribute("b", "baz")
  var b = document.createElement("foo")
  b.setAttribute("b", "baz")
  b.setAttribute("a", "bar")
  assert_true(a.isEqualNode(b))
}, "isEqualNode should return true when the attributes are in a different order")

test(function() {
  var a = document.createElementNS("ns", "prefix:foo")
  var b = document.createElementNS("ns", "prefix:foo")
  assert_true(a.isEqualNode(b))
}, "isEqualNode should return true if elements have same namespace, prefix, and local name")

test(function() {
  var a = document.createElementNS("ns1", "prefix:foo")
  var b = document.createElementNS("ns2", "prefix:foo")
  assert_false(a.isEqualNode(b))
}, "isEqualNode should return false if elements have different namespace")

test(function() {
  var a = document.createElementNS("ns", "prefix1:foo")
  var b = document.createElementNS("ns", "prefix2:foo")
  assert_false(a.isEqualNode(b))
}, "isEqualNode should return false if elements have different prefix")

test(function() {
  var a = document.createElementNS("ns", "prefix:foo1")
  var b = document.createElementNS("ns", "prefix:foo2")
  assert_false(a.isEqualNode(b))
}, "isEqualNode should return false if elements have different local name")

test(function() {
  var a = document.createElement("foo")
  a.setAttributeNS("ns", "x:a", "bar")
  var b = document.createElement("foo")
  b.setAttributeNS("ns", "y:a", "bar")
  assert_true(a.isEqualNode(b))
}, "isEqualNode should return true when the attributes have different prefixes")
var internalSubset = async_test("isEqualNode should return true when only the internal subsets of DocumentTypes differ.")
var wait = 2;
function iframeLoaded() {
  if (!--wait) {
    internalSubset.step(function() {
      var doc1 = document.getElementById("subset1").contentDocument
      var doc2 = document.getElementById("subset2").contentDocument
      assert_true(doc1.doctype.isEqualNode(doc2.doctype), "doc1.doctype.isEqualNode(doc2.doctype)")
      assert_true(doc1.isEqualNode(doc2), "doc1.isEqualNode(doc2)")
    })
    internalSubset.done()
  }
}
