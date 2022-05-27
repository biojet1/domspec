import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelectorAll must work with namespace attribute selectors on SVG</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2028 -->\n\n<svg id=\"thesvg\" xlink:href=\"foo\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

const el = document.getElementById("thesvg");

assert_equals(document.querySelector("[*|href]"), el);
assert_array_equals(document.querySelectorAll("[*|href]"), [el]);

done();
