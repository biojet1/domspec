import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html>\n<head><meta charset=\"utf-8\"/>\n<title>Node.prototype.getElementsByClassName tests imported from jsdom</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><div class=\"df-article\" id=\"1\">\n</div>\n<div class=\"df-article\" id=\"2\">\n</div>\n<div class=\"df-article\" id=\"3\">\n</div>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {

  const p = document.createElement("p");
  p.className = "unknown";
  document.body.appendChild(p);

  const elements = document.getElementsByClassName("first-p");
  assert_array_equals(elements, []);

}, "cannot find the class name");

test(() => {

  const p = document.createElement("p");
  p.className = "first-p";
  document.body.appendChild(p);

  const elements = document.getElementsByClassName("first-p");
  assert_array_equals(elements, [p]);

}, "finds the class name");


test(() => {

  const p = document.createElement("p");
  p.className = "the-p second third";
  document.body.appendChild(p);

  const elements1 = document.getElementsByClassName("the-p");
  assert_array_equals(elements1, [p]);

  const elements2 = document.getElementsByClassName("second");
  assert_array_equals(elements2, [p]);

  const elements3 = document.getElementsByClassName("third");
  assert_array_equals(elements3, [p]);

}, "finds the same element with multiple class names");

test(() => {

  const elements = document.getElementsByClassName("df-article");

  assert_equals(elements.length, 3);
  assert_array_equals(Array.prototype.map.call(elements, el => el.id), ["1", "2", "3"]);

}, "does not get confused by numeric IDs");

