import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head><meta charset=\"utf-8\"/>\n<title>Node.prototype.getElementsByClassName with no real class names</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><span class=\" \">test</span>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const elements = document.getElementsByClassName("");
  assert_array_equals(elements, []);
}, "Passing an empty string to getElementsByClassName should return an empty HTMLCollection");

test(() => {
  const elements = document.getElementsByClassName(" ");
  assert_array_equals(elements, []);
}, "Passing a space to getElementsByClassName should return an empty HTMLCollection");

test(() => {
  const elements = document.getElementsByClassName("   ");
  assert_array_equals(elements, []);
}, "Passing three spaces to getElementsByClassName should return an empty HTMLCollection");

