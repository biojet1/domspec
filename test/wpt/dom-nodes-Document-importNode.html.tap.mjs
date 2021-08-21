import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.importNode</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-importnode\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var doc = document.implementation.createHTMLDocument("Title");
  var div = doc.body.appendChild(doc.createElement("div"));
  div.appendChild(doc.createElement("span"));
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  var newDiv = document.importNode(div);
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  assert_equals(newDiv.ownerDocument, document);
  assert_equals(newDiv.firstChild, null);
}, "No 'deep' argument.")
test(function() {
  var doc = document.implementation.createHTMLDocument("Title");
  var div = doc.body.appendChild(doc.createElement("div"));
  div.appendChild(doc.createElement("span"));
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  var newDiv = document.importNode(div, undefined);
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  assert_equals(newDiv.ownerDocument, document);
  assert_equals(newDiv.firstChild, null);
}, "Undefined 'deep' argument.")
test(function() {
  var doc = document.implementation.createHTMLDocument("Title");
  var div = doc.body.appendChild(doc.createElement("div"));
  div.appendChild(doc.createElement("span"));
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  var newDiv = document.importNode(div, true);
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  assert_equals(newDiv.ownerDocument, document);
  assert_equals(newDiv.firstChild.ownerDocument, document);
}, "True 'deep' argument.")
test(function() {
  var doc = document.implementation.createHTMLDocument("Title");
  var div = doc.body.appendChild(doc.createElement("div"));
  div.appendChild(doc.createElement("span"));
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  var newDiv = document.importNode(div, false);
  assert_equals(div.ownerDocument, doc);
  assert_equals(div.firstChild.ownerDocument, doc);
  assert_equals(newDiv.ownerDocument, document);
  assert_equals(newDiv.firstChild, null);
}, "False 'deep' argument.")

test(function() {
  let doc = document.implementation.createHTMLDocument("Title");
  doc.body.setAttributeNS("http://example.com/", "p:name", "value");
  let originalAttr = doc.body.getAttributeNodeNS("http://example.com/", "name");
  let imported = document.importNode(originalAttr, true);
  assert_equals(imported.prefix, originalAttr.prefix);
  assert_equals(imported.namespaceURI, originalAttr.namespaceURI);
  assert_equals(imported.localName, originalAttr.localName);
}, "Import an Attr node with namespace/prefix correctly.");
