import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.implementation</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-implementation\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var implementation = document.implementation;
  assert_true(implementation instanceof DOMImplementation,
              "implementation should implement DOMImplementation");
  assert_equals(document.implementation, implementation);
}, "Getting implementation off the same document");

test(function() {
  var doc = document.implementation.createHTMLDocument();
  assert_not_equals(document.implementation, doc.implementation);
}, "Getting implementation off different documents");
