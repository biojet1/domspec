import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>document.createCDATASection must throw in HTML documents</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createcdatasection\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

assert_throws_dom("NotSupportedError", () => document.createCDATASection("foo"));

done();
