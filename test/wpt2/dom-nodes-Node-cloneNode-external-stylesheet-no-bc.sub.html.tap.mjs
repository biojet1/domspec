import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>cloneNode on a stylesheet link in a browsing-context-less document</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression test for https://github.com/jsdom/jsdom/issues/2497 -->\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

setup({ single_test: true });

const doc = document.implementation.createHTMLDocument();

// Bug was only triggered by absolute URLs, for some reason...
const absoluteURL = new URL("/common/canvas-frame.css", location.href);
doc.head.innerHTML = `<link rel="stylesheet" href="${absoluteURL}">`;

// Test passes if this does not throw/crash
doc.cloneNode(true);

done();
