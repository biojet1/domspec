import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>ProcessingInstruction numeric escapes</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-processinginstruction-target\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)


test(function() {
  var pienc = document.firstChild.nextSibling;
  assert_true(pienc instanceof ProcessingInstruction)
  assert_equals(pienc.target, "xml-stylesheet")
  assert_equals(pienc.data, 'href="data:text/css,&#x41;&amp;&apos;" type="text/css"')
  assert_equals(pienc.sheet.href, "data:text/css,A&'");

  pienc = pienc.nextSibling;
  assert_true(pienc instanceof ProcessingInstruction)
  assert_equals(pienc.target, "xml-stylesheet")
  assert_equals(pienc.data, 'href="data:text/css,&#65;&amp;&apos;" type="text/css"')
  assert_equals(pienc.sheet.href, "data:text/css,A&'");
})

