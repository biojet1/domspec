import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><div id=\"target\"/>\n<div id=\"parent\"><span id=\"target2\"/></div>\n<div id=\"log\" style=\"visibility:visible\"/>\n<span id=\"test1\"/>\n<span id=\"test2\"/>\n<span id=\"test3\"/>\n<span id=\"test4\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var target = document.getElementById("target");
var target2 = document.getElementById("target2");

test(function() {
  assert_throws_dom("SyntaxError", function() {
    target.insertAdjacentElement("test", document.getElementById("test1"))
  });

  assert_throws_dom("SyntaxError", function() {
    target2.insertAdjacentElement("test", document.getElementById("test1"))
  });
}, "Inserting to an invalid location should cause a Syntax Error exception")

test(function() {
  var el = target.insertAdjacentElement("beforebegin", document.getElementById("test1"));
  assert_equals(target.previousSibling.id, "test1");
  assert_equals(el.id, "test1");

  el = target2.insertAdjacentElement("beforebegin", document.getElementById("test1"));
  assert_equals(target2.previousSibling.id, "test1");
  assert_equals(el.id, "test1");
}, "Inserted element should be target element's previous sibling for 'beforebegin' case")

test(function() {
  var el = target.insertAdjacentElement("afterbegin", document.getElementById("test2"));
  assert_equals(target.firstChild.id, "test2");
  assert_equals(el.id, "test2");

  el = target2.insertAdjacentElement("afterbegin", document.getElementById("test2"));
  assert_equals(target2.firstChild.id, "test2");
  assert_equals(el.id, "test2");
}, "Inserted element should be target element's first child for 'afterbegin' case")

test(function() {
  var el = target.insertAdjacentElement("beforeend", document.getElementById("test3"));
  assert_equals(target.lastChild.id, "test3");
  assert_equals(el.id, "test3");

  el = target2.insertAdjacentElement("beforeend", document.getElementById("test3"));
  assert_equals(target2.lastChild.id, "test3");
  assert_equals(el.id, "test3");
}, "Inserted element should be target element's last child for 'beforeend' case")

test(function() {
  var el = target.insertAdjacentElement("afterend", document.getElementById("test4"));
  assert_equals(target.nextSibling.id, "test4");
  assert_equals(el.id, "test4");

  el = target2.insertAdjacentElement("afterend", document.getElementById("test4"));
  assert_equals(target2.nextSibling.id, "test4");
  assert_equals(el.id, "test4");
}, "Inserted element should be target element's next sibling for 'afterend' case")

test(function() {
  var docElement = document.documentElement;
  docElement.style.visibility="hidden";

  assert_throws_dom("HierarchyRequestError", function() {
    var el = docElement.insertAdjacentElement("beforebegin", document.getElementById("test1"));
    assert_equals(el, null);
  });

  var el = docElement.insertAdjacentElement("afterbegin", document.getElementById("test2"));
  assert_equals(docElement.firstChild.id, "test2");
  assert_equals(el.id, "test2");

  el = docElement.insertAdjacentElement("beforeend", document.getElementById("test3"));
  assert_equals(docElement.lastChild.id, "test3");
  assert_equals(el.id, "test3");

  assert_throws_dom("HierarchyRequestError", function() {
    var el = docElement.insertAdjacentElement("afterend", document.getElementById("test4"));
    assert_equals(el, null);
  });
}, "Adding more than one child to document should cause a HierarchyRequestError exception")

