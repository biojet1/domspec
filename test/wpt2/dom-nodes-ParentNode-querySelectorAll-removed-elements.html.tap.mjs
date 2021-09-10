import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelectorAll must not return removed elements</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2519 -->\n\n</head><body><div id=\"container\"/>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

const container = document.querySelector("#container");
function getIDs() {
  return [...container.querySelectorAll("a.test")].map(el => el.id);
}

container.innerHTML = `<a id="link-a" class="test">a link</a>`;
assert_array_equals(getIDs(), ["link-a"], "Sanity check: initial setup");

container.innerHTML = `<a id="link-b" class="test"><img src="foo.jpg"></a>`;
assert_array_equals(getIDs(), ["link-b"], "After replacement");

container.innerHTML = `<a id="link-a" class="test">a link</a>`;
assert_array_equals(getIDs(), ["link-a"], "After changing back to the original HTML");

done();
