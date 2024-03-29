import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Element.getElementsByClassName</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var a = document.createElement("a"), b = document.createElement("b")
  b.className = "foo"
  a.appendChild(b)
  var list = a.getElementsByClassName("foo")
  assert_array_equals(list, [b])
  var secondList = a.getElementsByClassName("foo")
  assert_true(list === secondList || list !== secondList, "Caching is allowed.")
}, "getElementsByClassName should work on disconnected subtrees.")

test(function() {
  var list = document.getElementsByClassName("foo")
  assert_false(list instanceof NodeList, "NodeList")
  assert_true(list instanceof HTMLCollection, "HTMLCollection")
}, "Interface should be correct.")

test(function() {
  var a = document.createElement("a");
  var b = document.createElement("b");
  var c = document.createElement("c");
  b.className = "foo";
  document.body.appendChild(a);
  this.add_cleanup(function() {document.body.removeChild(a)});
  a.appendChild(b);

  var l = a.getElementsByClassName("foo");
  assert_true(l instanceof HTMLCollection);
  assert_equals(l.length, 1);

  c.className = "foo";
  a.appendChild(c);
  assert_equals(l.length, 2);

  a.removeChild(c);
  assert_equals(l.length, 1);
}, "getElementsByClassName() should be a live collection");
