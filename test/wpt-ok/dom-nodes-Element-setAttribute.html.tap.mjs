import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Element.prototype.setAttribute</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-setattribute\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {

  const el = document.createElement("p");
  el.setAttributeNS("foo", "x", "first");
  el.setAttributeNS("foo2", "x", "second");

  el.setAttribute("x", "changed");

  assert_equals(el.attributes.length, 2);
  assert_equals(el.getAttribute("x"), "changed");
  assert_equals(el.getAttributeNS("foo", "x"), "changed");
  assert_equals(el.getAttributeNS("foo2", "x"), "second");

}, "setAttribute should change the first attribute, irrespective of namespace");

test(() => {
  // https://github.com/whatwg/dom/issues/31

  const el = document.createElement("p");
  el.setAttribute("FOO", "bar");

  assert_equals(el.getAttribute("foo"), "bar");
  assert_equals(el.getAttribute("FOO"), "bar");
  assert_equals(el.getAttributeNS("", "foo"), "bar");
  assert_equals(el.getAttributeNS("", "FOO"), null);

}, "setAttribute should lowercase before setting");
