import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import tap from "tap";

const parser = new DOMParser();
const document =
  parser.parseFromString(`<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title/>
<script src="/resources/testharness.js"/>
<script src="/resources/testharnessreport.js"/>

</head>
<body>
<div id="target"/>
<div id="parent"><span id="target2"/></div>
<div id="log" style="visibility:visible"/>
<span id="test1"/>
<span id="test2"/>
<span id="test3"/>
<span id="test4"/>


</body>
</html>


      `);

console.info(document.outerHTML);

let current_t = null;
function test(fn, msg) {
  tap.test(msg, function (t) {
    current_t = t;
    fn();
    t.end();
  });
}
function assert_throws_dom(what, fn) {
  current_t.throws(fn, { message: what }, what);
}
function assert_equals(a, b) {
  current_t.strictSame(a, b);
}


var target = document.getElementById("target");
var target2 = document.getElementById("target2");

test(function () {
  assert_throws_dom("SyntaxError", function () {
    target.insertAdjacentElement("test", document.getElementById("test1"));
  });

  assert_throws_dom("SyntaxError", function () {
    target2.insertAdjacentElement("test", document.getElementById("test1"));
  });
}, "Inserting to an invalid location should cause a Syntax Error exception");

test(function () {
  var el = target.insertAdjacentElement(
    "beforebegin",
    document.getElementById("test1")
  );
  assert_equals(target.previousSibling.id, "test1");
  assert_equals(el.id, "test1");

  el = target2.insertAdjacentElement(
    "beforebegin",
    document.getElementById("test1")
  );
  assert_equals(target2.previousSibling.id, "test1");
  assert_equals(el.id, "test1");
}, "Inserted element should be target element's previous sibling for 'beforebegin' case");

test(function () {
  var el = target.insertAdjacentElement(
    "afterbegin",
    document.getElementById("test2")
  );
  assert_equals(target.firstChild.id, "test2");
  assert_equals(el.id, "test2");

  el = target2.insertAdjacentElement(
    "afterbegin",
    document.getElementById("test2")
  );
  assert_equals(target2.firstChild.id, "test2");
  assert_equals(el.id, "test2");
}, "Inserted element should be target element's first child for 'afterbegin' case");

test(function () {
  var el = target.insertAdjacentElement(
    "beforeend",
    document.getElementById("test3")
  );
  assert_equals(target.lastChild.id, "test3");
  assert_equals(el.id, "test3");

  el = target2.insertAdjacentElement(
    "beforeend",
    document.getElementById("test3")
  );
  assert_equals(target2.lastChild.id, "test3");
  assert_equals(el.id, "test3");
}, "Inserted element should be target element's last child for 'beforeend' case");

test(function () {
  var el = target.insertAdjacentElement(
    "afterend",
    document.getElementById("test4")
  );
  assert_equals(target.nextSibling.id, "test4");
  assert_equals(el.id, "test4");

  el = target2.insertAdjacentElement(
    "afterend",
    document.getElementById("test4")
  );
  assert_equals(target2.nextSibling.id, "test4");
  assert_equals(el.id, "test4");
}, "Inserted element should be target element's next sibling for 'afterend' case");

// test(function () {
//   var docElement = document.documentElement;
//   docElement.style.visibility = "hidden";

//   assert_throws_dom("HierarchyRequestError", function () {
//     var el = docElement.insertAdjacentElement(
//       "beforebegin",
//       document.getElementById("test1")
//     );
//     assert_equals(el, null);
//   });

//   var el = docElement.insertAdjacentElement(
//     "afterbegin",
//     document.getElementById("test2")
//   );
//   assert_equals(docElement.firstChild.id, "test2");
//   assert_equals(el.id, "test2");

//   el = docElement.insertAdjacentElement(
//     "beforeend",
//     document.getElementById("test3")
//   );
//   assert_equals(docElement.lastChild.id, "test3");
//   assert_equals(el.id, "test3");

//   assert_throws_dom("HierarchyRequestError", function () {
//     var el = docElement.insertAdjacentElement(
//       "afterend",
//       document.getElementById("test4")
//     );
//     assert_equals(el, null);
//   });
// }, "Adding more than one child to document should cause a HierarchyRequestError exception");
