import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelectorAll should still work on DocumentFragments after they are modified</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2290 -->\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

const frag = document.createDocumentFragment();
frag.appendChild(document.createElement("div"));

assert_array_equals(frag.querySelectorAll("img"), [], "before modification");

frag.appendChild(document.createElement("div"));

// If the bug is present, this will throw.
assert_array_equals(frag.querySelectorAll("img"), [], "after modification");

done();
