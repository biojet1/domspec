import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Element.prototype.removeAttribute</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-removeattribute\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {

  const el = document.createElement("p");
  el.setAttribute("x", "first");
  el.setAttributeNS("foo", "x", "second");

  assert_equals(el.attributes.length, 2);
  assert_equals(el.getAttribute("x"), "first");
  assert_equals(el.getAttributeNS(null, "x"), "first");
  assert_equals(el.getAttributeNS("foo", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  el.removeAttribute("x");

  // The only attribute remaining should be the second one.
  assert_equals(el.getAttribute("x"), "second");
  assert_equals(el.getAttributeNS(null, "x"), null);
  assert_equals(el.getAttributeNS("foo", "x"), "second");
  assert_equals(el.attributes.length, 1, "one attribute");

}, "removeAttribute should remove the first attribute, irrespective of namespace, when the first attribute is " +
   "not in a namespace");

test(() => {

  const el = document.createElement("p");
  el.setAttributeNS("foo", "x", "first");
  el.setAttributeNS("foo2", "x", "second");

  assert_equals(el.attributes.length, 2);
  assert_equals(el.getAttribute("x"), "first");
  assert_equals(el.getAttributeNS("foo", "x"), "first");
  assert_equals(el.getAttributeNS("foo2", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  el.removeAttribute("x");

  // The only attribute remaining should be the second one.
  assert_equals(el.getAttribute("x"), "second");
  assert_equals(el.getAttributeNS("foo", "x"), null);
  assert_equals(el.getAttributeNS("foo2", "x"), "second");
  assert_equals(el.attributes.length, 1, "one attribute");

}, "removeAttribute should remove the first attribute, irrespective of namespace, when the first attribute is " +
   "in a namespace");
