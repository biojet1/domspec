import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><title>DocumentType literals</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-name\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-publicid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-systemid\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var doctype = document.firstChild;
  assert_true(doctype instanceof DocumentType)
  assert_equals(doctype.name, "html")
  assert_equals(doctype.publicId, 'STAFF')
  assert_equals(doctype.systemId, 'staffNS.dtd')
})
