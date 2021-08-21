import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><title>Document.getElementsByClassName</title>\n<link rel=\"author\" title=\"Intel\" href=\"http://www.intel.com\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var a = document.createElement("a"),
      b = document.createElement("b");
  a.className = "foo";
  this.add_cleanup(function() {document.body.removeChild(a);});
  document.body.appendChild(a);

  var l = document.getElementsByClassName("foo");
  assert_true(l instanceof HTMLCollection);
  assert_equals(l.length, 1);

  b.className = "foo";
  document.body.appendChild(b);
  assert_equals(l.length, 2);

  document.body.removeChild(b);
  assert_equals(l.length, 1);
}, "getElementsByClassName() should be a live collection");
