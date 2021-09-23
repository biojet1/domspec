import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Text.splitText()</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-text-splittextoffset\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var text = document.createTextNode("camembert");
  assert_throws_dom("INDEX_SIZE_ERR", function () { text.splitText(10) });
}, "Split text after end of data");

test(function() {
  var text = document.createTextNode("");
  var new_text = text.splitText(0);
  assert_equals(text.data, "");
  assert_equals(new_text.data, "");
}, "Split empty text");

test(function() {
  var text = document.createTextNode("comté");
  var new_text = text.splitText(0);
  assert_equals(text.data, "");
  assert_equals(new_text.data, "comté");
}, "Split text at beginning");

test(function() {
  var text = document.createTextNode("comté");
  var new_text = text.splitText(5);
  assert_equals(text.data, "comté");
  assert_equals(new_text.data, "");
}, "Split text at end");

test(function() {
  var text = document.createTextNode("comté");
  var new_text = text.splitText(3);
  assert_equals(text.data, "com");
  assert_equals(new_text.data, "té");
  assert_equals(new_text.parentNode, null);
}, "Split root");

test(function() {
  var parent = document.createElement('div');
  var text = document.createTextNode("bleu");
  parent.appendChild(text);
  var new_text = text.splitText(2);
  assert_equals(text.data, "bl");
  assert_equals(new_text.data, "eu");
  assert_equals(text.nextSibling, new_text);
  assert_equals(new_text.parentNode, parent);
}, "Split child");
