import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Node.appendChild</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-appendchild\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<iframe src=\"about:blank\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

// TODO: Exhaustive tests
function testLeaf(node, desc) {
  // WebIDL.
  test(function() {
    assert_throws_js(TypeError, function() { node.appendChild(null) })
  }, "Appending null to a " + desc)

  // Pre-insert step 1.
  test(function() {
    assert_throws_dom("HIERARCHY_REQUEST_ERR", function() { node.appendChild(document.createTextNode("fail")) })
  }, "Appending to a " + desc)
}

// WebIDL.
test(function() {
  assert_throws_js(TypeError, function() { document.body.appendChild(null) })
  assert_throws_js(TypeError, function() { document.body.appendChild({'a':'b'}) })
}, "WebIDL tests")

// WebIDL and pre-insert step 1.
test(function() {
  testLeaf(document.createTextNode("Foo"), "text node")
  testLeaf(document.createComment("Foo"), "comment")
  testLeaf(document.doctype, "doctype")
}, "Appending to a leaf node.")

// Pre-insert step 5.
test(function() {
  var frameDoc = frames[0].document
  assert_throws_dom("HIERARCHY_REQUEST_ERR", function() { document.body.appendChild(frameDoc) })
}, "Appending a document")

// Pre-insert step 8.
test(function() {
  var frameDoc = frames[0].document
  var s = frameDoc.createElement("a")
  assert_equals(s.ownerDocument, frameDoc)
  document.body.appendChild(s)
  assert_equals(s.ownerDocument, document)
}, "Adopting an orphan")
test(function() {
  var frameDoc = frames[0].document
  var s = frameDoc.createElement("b")
  assert_equals(s.ownerDocument, frameDoc)
  frameDoc.body.appendChild(s)
  assert_equals(s.ownerDocument, frameDoc)
  document.body.appendChild(s)
  assert_equals(s.ownerDocument, document)
}, "Adopting a non-orphan")
