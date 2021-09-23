import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html =
`
<!-- comment -->
<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>Document.doctype</title>
<link rel="help" href="https://dom.spec.whatwg.org/#dom-document-doctype"/>
<script src="/resources/testharness.js"/>
<script src="/resources/testharnessreport.js"/>
</head><body><div id="log"/>
<script>
test(function() {
  assert_true(document.doctype instanceof DocumentType,
              "Doctype should be a DocumentType");
  assert_equals(document.doctype, document.childNodes[1]);
}, "Window document with doctype");

test(function() {
  var newdoc = new Document();
  newdoc.appendChild(newdoc.createElement("html"));
  assert_equals(newdoc.doctype, null);
}, "new Document()");
</script>
</body></html>

`

const document = loadDOM(html, `text/html`)

test(function() {
  assert_true(document.doctype instanceof DocumentType,
              "Doctype should be a DocumentType");
  assert_equals(document.doctype, document.childNodes[1]);
}, "Window document with doctype");

test(function() {
  var newdoc = new Document();
  newdoc.appendChild(newdoc.createElement("html"));
  assert_equals(newdoc.doctype, null);
}, "new Document()");
