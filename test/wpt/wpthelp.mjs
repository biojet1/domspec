import { parseDOM, DOMParser } from "../../dist/dom-parse.js";
import tap from "tap";

const parser = new DOMParser();
global.loadDOM = function (xml) {
  return (global.document = parser.parseFromString(xml));
};

let current_t = null;
global.test = function (fn, msg) {
  tap.test(msg, function (t) {
    current_t = t;
    fn();
    t.end();
  });
};

global.assert_throws_dom = function (what, fn) {
  if (/^[A-Z_]+$/.test(what)) {
    what = what
      .toLowerCase()
      .replace(/(_[a-z])/g, (m, p1) => p1.slice(1).toUpperCase())
      .replace(/^[a-z]/g, (m) => m.toUpperCase());
  }
  (current_t || tap).throws(fn, { message: what }, what);
};

global.assert_equals = function (a, b, msg) {
  (current_t || tap).strictSame(a, b, msg);
};
global.assert_true = function (a, msg) {
  (current_t || tap).strictSame(a, true, msg);
};

global.assert_array_equals = function (a, b, msg) {
  (current_t || tap).match(a, b, msg);
};

global.setup = function (fn) {
  if (typeof fn === "function") {
    fn();
  }
};

global.done = function () {};
global.assert_throws_js = function (constructor, func, description) {
  // assert_throws_js_impl(constructor, func, description, "assert_throws_js");

  (current_t || tap).throws(func, constructor, description, [
    constructor,
    "assert_throws_js",
  ]);
};
const NULL = undefined;
global.testRemove = function (node, parent, type) {
  test(function () {
    assert_true("remove" in node);
    assert_equals(typeof node.remove, "function");
    assert_equals(node.remove.length, 0);
  }, type + " should support remove()");
  test(function () {
    assert_equals(node.parentNode, NULL, "Node should not have a parent");
    assert_equals(node.remove(), undefined);
    assert_equals(
      node.parentNode,
      NULL,
      "Removed new node should not have a parent"
    );
  }, "remove() should work if " + type + " doesn't have a parent");
  test(function () {
    assert_equals(node.parentNode, NULL, "Node should not have a parent");
    parent.appendChild(node);
    assert_equals(
      node.parentNode,
      parent,
      "Appended node should have a parent"
    );
    assert_equals(node.remove(), undefined);
    assert_equals(
      node.parentNode,
      NULL,
      "Removed node should not have a parent"
    );
    assert_array_equals(
      parent.childNodes,
      [],
      "Parent should not have children"
    );
  }, "remove() should work if " + type + " does have a parent");
  test(function () {
    assert_equals(node.parentNode, NULL, "Node should not have a parent");
    var before = parent.appendChild(document.createComment("before"));
    parent.appendChild(node);
    var after = parent.appendChild(document.createComment("after"));
    assert_equals(
      node.parentNode,
      parent,
      "Appended node should have a parent"
    );
    assert_equals(node.remove(), undefined);
    assert_equals(
      node.parentNode,
      NULL,
      "Removed node should not have a parent"
    );
    assert_array_equals(
      parent.childNodes,
      [before, after],
      "Parent should have two children left"
    );
  }, "remove() should work if " + type + " does have a parent and siblings");
};
