import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>ProcessingInstruction literals</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-processinginstruction-target\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

test(function() {
  var pienc = document.firstChild;
  assert_true(pienc instanceof ProcessingInstruction)
  assert_equals(pienc.target, "xml-stylesheet")
  assert_equals(pienc.data, 'href="support/style.css" type="text/css"')
})
