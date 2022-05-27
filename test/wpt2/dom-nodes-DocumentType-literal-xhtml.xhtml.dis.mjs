import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>DocumentType literals</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-name\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-publicid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-systemid\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var doctype = document.firstChild;
  assert_true(doctype instanceof DocumentType)
  assert_equals(doctype.name, "html")
  assert_equals(doctype.publicId, 'STAFF')
  assert_equals(doctype.systemId, 'staffNS.dtd')
})
