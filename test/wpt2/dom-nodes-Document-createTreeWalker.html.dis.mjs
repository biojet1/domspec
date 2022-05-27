import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createTreeWalker</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  assert_throws_js(TypeError, function() {
    document.createTreeWalker();
  });
}, "Required arguments to createTreeWalker should be required.");
test(function() {
  var tw = document.createTreeWalker(document.body);
  assert_equals(tw.root, document.body);
  assert_equals(tw.currentNode, document.body);
  assert_equals(tw.whatToShow, 0xFFFFFFFF);
  assert_equals(tw.filter, null);
}, "Optional arguments to createTreeWalker should be optional (1 passed).");
test(function() {
  var tw = document.createTreeWalker(document.body, 42);
  assert_equals(tw.root, document.body);
  assert_equals(tw.currentNode, document.body);
  assert_equals(tw.whatToShow, 42);
  assert_equals(tw.filter, null);
}, "Optional arguments to createTreeWalker should be optional (2 passed).");
test(function() {
  var tw = document.createTreeWalker(document.body, 42, null);
  assert_equals(tw.root, document.body);
  assert_equals(tw.currentNode, document.body);
  assert_equals(tw.whatToShow, 42);
  assert_equals(tw.filter, null);
}, "Optional arguments to createTreeWalker should be optional (3 passed, null).");
test(function() {
  var fn = function() {};
  var tw = document.createTreeWalker(document.body, 42, fn);
  assert_equals(tw.root, document.body);
  assert_equals(tw.currentNode, document.body);
  assert_equals(tw.whatToShow, 42);
  assert_equals(tw.filter, fn);
}, "Optional arguments to createTreeWalker should be optional (3 passed, function).");
