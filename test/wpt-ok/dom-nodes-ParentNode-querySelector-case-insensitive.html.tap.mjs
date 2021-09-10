import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelector(All) must work with the i and *= selectors</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2551 -->\n\n<input name=\"User\" id=\"testInput\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";
const input = document.getElementById("testInput");

test(() => {
  assert_equals(document.querySelector("input[name*=user i]"), input);
}, "querySelector");

test(() => {
  assert_array_equals(document.querySelectorAll("input[name*=user i]"), [input]);
}, "querySelectorAll");
