import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelector(All) must work with :scope</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2359 -->\n\n</head><body><div><p><span>hello</span></p></div>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";
const div = document.querySelector("div");
const p = document.querySelector("p");

test(() => {
  assert_equals(div.querySelector(":scope > p"), p);
  assert_equals(div.querySelector(":scope > span"), null);
}, "querySelector");

test(() => {
  assert_array_equals(div.querySelectorAll(":scope > p"), [p]);
  assert_array_equals(div.querySelectorAll(":scope > span"), []);
}, "querySelectorAll");
