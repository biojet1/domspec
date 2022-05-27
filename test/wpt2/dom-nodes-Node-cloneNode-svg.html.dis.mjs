import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Cloning of SVG elements and attributes</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-clonenode\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-node-clone\"/>\n<!-- regression test for https://github.com/jsdom/jsdom/issues/1601 -->\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\"><use xlink:href=\"#test\"/></svg>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

const svg = document.querySelector("svg");
const clone = svg.cloneNode(true);

test(() => {

  assert_equals(clone.namespaceURI, "http://www.w3.org/2000/svg");
  assert_equals(clone.prefix, null);
  assert_equals(clone.localName, "svg");
  assert_equals(clone.tagName, "svg");

}, "cloned <svg> should have the right properties");

test(() => {

  const attr = clone.attributes[0];

  assert_equals(attr.namespaceURI, "http://www.w3.org/2000/xmlns/");
  assert_equals(attr.prefix, "xmlns");
  assert_equals(attr.localName, "xlink");
  assert_equals(attr.name, "xmlns:xlink");
  assert_equals(attr.value, "http://www.w3.org/1999/xlink");

}, "cloned <svg>'s xmlns:xlink attribute should have the right properties");

test(() => {

  const use = clone.firstElementChild;
  assert_equals(use.namespaceURI, "http://www.w3.org/2000/svg");
  assert_equals(use.prefix, null);
  assert_equals(use.localName, "use");
  assert_equals(use.tagName, "use");

}, "cloned <use> should have the right properties");

test(() => {

  const use = clone.firstElementChild;
  const attr = use.attributes[0];

  assert_equals(attr.namespaceURI, "http://www.w3.org/1999/xlink");
  assert_equals(attr.prefix, "xlink");
  assert_equals(attr.localName, "href");
  assert_equals(attr.name, "xlink:href");
  assert_equals(attr.value, "#test");

}, "cloned <use>'s xlink:href attribute should have the right properties");

