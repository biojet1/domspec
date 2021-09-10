import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Element.prototype.hasAttribute</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-hasattribute\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><span data-e2=\"2\" data-f2=\"3\" id=\"t\"/>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {

  const el = document.createElement("p");
  el.setAttributeNS("foo", "x", "first");

  assert_true(el.hasAttribute("x"));

}, "hasAttribute should check for attribute presence, irrespective of namespace");

test(() => {

  const el = document.getElementById("t");

  assert_true(el.hasAttribute("data-e2"));
  assert_true(el.hasAttribute("data-E2"));
  assert_true(el.hasAttribute("data-f2"));
  assert_true(el.hasAttribute("data-F2"));

}, "hasAttribute should work with all attribute casings");
