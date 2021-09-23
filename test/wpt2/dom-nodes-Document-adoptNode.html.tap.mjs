import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.adoptNode</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-adoptnode\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<!--creates an element with local name \"x<\": --><x>x</x>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var y = document.getElementsByTagName("x<")[0]
  var child = y.firstChild
  assert_equals(y.parentNode, document.body)
  assert_equals(y.ownerDocument, document)
  assert_equals(document.adoptNode(y), y)
  assert_equals(y.parentNode, null)
  assert_equals(y.firstChild, child)
  assert_equals(y.ownerDocument, document)
  assert_equals(child.ownerDocument, document)
  var doc = document.implementation.createDocument(null, null, null)
  assert_equals(doc.adoptNode(y), y)
  assert_equals(y.parentNode, null)
  assert_equals(y.firstChild, child)
  assert_equals(y.ownerDocument, doc)
  assert_equals(child.ownerDocument, doc)
}, "Adopting an Element called 'x<' should work.")

test(function() {
  var x = document.createElement(":good:times:")
  assert_equals(document.adoptNode(x), x);
  var doc = document.implementation.createDocument(null, null, null)
  assert_equals(doc.adoptNode(x), x)
  assert_equals(x.parentNode, null)
  assert_equals(x.ownerDocument, doc)
}, "Adopting an Element called ':good:times:' should work.")

test(function() {
  var doctype = document.doctype;
  assert_equals(doctype.parentNode, document)
  assert_equals(doctype.ownerDocument, document)
  assert_equals(document.adoptNode(doctype), doctype)
  assert_equals(doctype.parentNode, null)
  assert_equals(doctype.ownerDocument, document)
}, "Explicitly adopting a DocumentType should work.")

test(function() {
  var doc = document.implementation.createDocument(null, null, null)
  assert_throws_dom("NOT_SUPPORTED_ERR", function() { document.adoptNode(doc) })
}, "Adopting a Document should throw.")
