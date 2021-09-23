import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelector(All) must work for attribute values that contain spaces and dashes</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2542 -->\n\n</head><body><a title=\"test with - dash and space\" id=\"testme\">Test One</a>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";
const el = document.getElementById("testme");

test(() => {
  assert_equals(document.querySelector("a[title='test with - dash and space']"), el);
}, "querySelector");

test(() => {
  assert_equals(document.querySelector("a[title='test with - dash and space']"), el);
}, "querySelectorAll");
