import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelector/querySelectorAll should not include their thisArg</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2296 -->\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

const button = document.createElement("button");

assert_equals(button.querySelector("*"), null, "querySelector, '*', before modification");
assert_equals(button.querySelector("button"), null, "querySelector, 'button', before modification");
assert_equals(button.querySelector("button, span"), null, "querySelector, 'button, span', before modification");
assert_array_equals(button.querySelectorAll("*"), [], "querySelectorAll, '*', before modification");
assert_array_equals(button.querySelectorAll("button"), [], "querySelectorAll, 'button', before modification");
assert_array_equals(
  button.querySelectorAll("button, span"), [],
  "querySelectorAll, 'button, span', before modification"
);


button.innerHTML = "text";

assert_equals(button.querySelector("*"), null, "querySelector, '*', after modification");
assert_equals(button.querySelector("button"), null, "querySelector, 'button', after modification");
assert_equals(button.querySelector("button, span"), null, "querySelector, 'button, span', after modification");
assert_array_equals(button.querySelectorAll("*"), [], "querySelectorAll, '*', after modification");
assert_array_equals(button.querySelectorAll("button"), [], "querySelectorAll, 'button', after modification");
assert_array_equals(
  button.querySelectorAll("button, span"), [],
  "querySelectorAll, 'button, span', after modification"
);

done();
