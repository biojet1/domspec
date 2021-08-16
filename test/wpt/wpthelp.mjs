import { parseDOM, DOMParser } from "../../dist/dom-parse.js";
import { Node } from "../../dist/node.js";
import { Document } from "../../dist/document.js";
import { Window } from "../../dist/window.js";
import tap from "tap";

global.Node = Node;
global.Document = Document;

const parser = new DOMParser();
global.loadDOM = function (xml) {
  const doc = (global.document = parser.parseFromString(xml, "text/html"));
  global.window = new Window(doc);
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
  (current_t || tap).throws(fn, { message: what }, what);
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
// const NULL = undefined;
const NULL = null;
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

// wpt-master/dom/nodes/pre-insertion-validation-hierarchy.js
/**
 * Validations where `child` argument is irrelevant.
 * @param {Function} methodName
 */
global.preInsertionValidateHierarchy = function (methodName) {
  function insert(parent, node) {
    if (parent[methodName].length > 1) {
      // This is for insertBefore(). We can't blindly pass `null` for all methods
      // as doing so will move nodes before validation.
      parent[methodName](node, null);
    } else {
      parent[methodName](node);
    }
  }

  // Step 2
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    assert_throws_dom("HierarchyRequestError", () =>
      insert(doc.body, doc.body)
    );
    assert_throws_dom("HierarchyRequestError", () =>
      insert(doc.body, doc.documentElement)
    );
  }, "If node is a host-including inclusive ancestor of parent, then throw a HierarchyRequestError DOMException.");

  // Step 4
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    const doc2 = document.implementation.createHTMLDocument("title2");
    assert_throws_dom("HierarchyRequestError", () => insert(doc, doc2));
  }, "If node is not a DocumentFragment, DocumentType, Element, Text, ProcessingInstruction, or Comment node, then throw a HierarchyRequestError DOMException.");

  // Step 5, in case of inserting a text node into a document
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    assert_throws_dom("HierarchyRequestError", () =>
      insert(doc, doc.createTextNode("text"))
    );
  }, "If node is a Text node and parent is a document, then throw a HierarchyRequestError DOMException.");

  // Step 5, in case of inserting a doctype into a non-document
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    const doctype = doc.childNodes[0];
    assert_throws_dom("HierarchyRequestError", () =>
      insert(doc.createElement("a"), doctype)
    );
  }, "If node is a doctype and parent is not a document, then throw a HierarchyRequestError DOMException.");

  // Step 6, in case of DocumentFragment including multiple elements
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    doc.documentElement.remove();
    const df = doc.createDocumentFragment();
    df.appendChild(doc.createElement("a"));
    df.appendChild(doc.createElement("b"));
    assert_throws_dom("HierarchyRequestError", () => insert(doc, df));
  }, "If node is a DocumentFragment with multiple elements and parent is a document, then throw a HierarchyRequestError DOMException.");

  // Step 6, in case of DocumentFragment has multiple elements when document already has an element
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    const df = doc.createDocumentFragment();
    df.appendChild(doc.createElement("a"));
    assert_throws_dom("HierarchyRequestError", () => insert(doc, df));
  }, "If node is a DocumentFragment with an element and parent is a document with another element, then throw a HierarchyRequestError DOMException.");

  // Step 6, in case of an element
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    const el = doc.createElement("a");
    assert_throws_dom("HierarchyRequestError", () => insert(doc, el));
  }, "If node is an Element and parent is a document with another element, then throw a HierarchyRequestError DOMException.");

  // Step 6, in case of a doctype when document already has another doctype
  test(() => {
    const doc = document.implementation.createHTMLDocument("title");
    const doctype = doc.childNodes[0].cloneNode();
    doc.documentElement.remove();
    assert_throws_dom("HierarchyRequestError", () => insert(doc, doctype));
  }, "If node is a doctype and parent is a document with another doctype, then throw a HierarchyRequestError DOMException.");

  // Step 6, in case of a doctype when document has an element
  if (methodName !== "prepend") {
    // Skip `.prepend` as this doesn't throw if `child` is an element
    test(() => {
      const doc = document.implementation.createHTMLDocument("title");
      const doctype = doc.childNodes[0].cloneNode();
      doc.childNodes[0].remove();
      assert_throws_dom("HierarchyRequestError", () => insert(doc, doctype));
    }, "If node is a doctype and parent is a document with an element, then throw a HierarchyRequestError DOMException.");
  }
};
