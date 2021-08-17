import { parseDOM, DOMParser } from "../../dist/dom-parse.js";
import { Node } from "../../dist/node.js";
import { Document } from "../../dist/document.js";
import { Element } from "../../dist/element.js";
import { HTMLCollection } from "../../dist/parent-node.js";
import { Window } from "../../dist/window.js";
import tap from "tap";

global.Node = Node;
global.Document = Document;
global.HTMLCollection = HTMLCollection;
global.Element = Element;

const parser = new DOMParser();
global.loadDOM = function (xml) {
  const doc = (global.document = parser.parseFromString(xml, "text/html"));
  global.window = new Window(doc);
  global.frames = global.window.frames;
  return doc;
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
  (current_t || tap).throws(fn, Error, { message: what }, what);
};

global.assert_equals = function (a, b, msg) {
  (current_t || tap).strictSame(a, b, msg);
};
global.assert_true = function (a, msg) {
  (current_t || tap).strictSame(a, true, msg);
};
global.assert_false = function (a, msg) {
  (current_t || tap).strictSame(a, false, msg);
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

global.async_test = function (func, name, properties) {};
