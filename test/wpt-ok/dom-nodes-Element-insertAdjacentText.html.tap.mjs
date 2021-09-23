import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body style=\"visibility:hidden\">\n<div id=\"target\"/>\n<div id=\"parent\"><span id=\"target2\"/></div>\n<div id=\"log\" style=\"visibility:visible\"/>\n</body>\n<script/>\n</html>"
const document = loadDOM(html, `text/html`)

var target = document.getElementById("target");
var target2 = document.getElementById("target2");

test(function() {
  assert_throws_dom("SyntaxError", function() {
    target.insertAdjacentText("test", "text")
  });

  assert_throws_dom("SyntaxError", function() {
    target2.insertAdjacentText("test", "test")
  });
}, "Inserting to an invalid location should cause a Syntax Error exception")

test(function() {
  target.insertAdjacentText("beforebegin", "test1");
  assert_equals(target.previousSibling.nodeValue, "test1");

  target2.insertAdjacentText("beforebegin", "test1");
  assert_equals(target2.previousSibling.nodeValue, "test1");
}, "Inserted text node should be target element's previous sibling for 'beforebegin' case")

test(function() {
  target.insertAdjacentText("afterbegin", "test2");
  assert_equals(target.firstChild.nodeValue, "test2");

  target2.insertAdjacentText("afterbegin", "test2");
  assert_equals(target2.firstChild.nodeValue, "test2");
}, "Inserted text node should be target element's first child for 'afterbegin' case")

test(function() {
  target.insertAdjacentText("beforeend", "test3");
  assert_equals(target.lastChild.nodeValue, "test3");

  target2.insertAdjacentText("beforeend", "test3");
  assert_equals(target2.lastChild.nodeValue, "test3");
}, "Inserted text node should be target element's last child for 'beforeend' case")

test(function() {
  target.insertAdjacentText("afterend", "test4");
  assert_equals(target.nextSibling.nodeValue, "test4");

  target2.insertAdjacentText("afterend", "test4");
  assert_equals(target.nextSibling.nodeValue, "test4");
}, "Inserted text node should be target element's next sibling for 'afterend' case")

test(function() {
  var docElement = document.documentElement;
  docElement.style.visibility="hidden";

  assert_throws_dom("HierarchyRequestError", function() {
    docElement.insertAdjacentText("beforebegin", "text1")
  });

  docElement.insertAdjacentText("afterbegin", "test2");
  assert_equals(docElement.firstChild.nodeValue, "test2");

  docElement.insertAdjacentText("beforeend", "test3");
  assert_equals(docElement.lastChild.nodeValue, "test3");

  assert_throws_dom("HierarchyRequestError", function() {
    docElement.insertAdjacentText("afterend", "test4")
  });
}, "Adding more than one child to document should cause a HierarchyRequestError exception")

