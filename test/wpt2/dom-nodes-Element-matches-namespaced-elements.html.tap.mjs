import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>matches/webkitMatchesSelector must work when an element has a namespace</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<!-- Regression tests for https://github.com/jsdom/jsdom/issues/1846, https://github.com/jsdom/jsdom/issues/2247 -->\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

for (const method of ["matches", "webkitMatchesSelector"]) {
  test(() => {
    assert_true(document.createElementNS("", "element")[method]("element"));
  }, `empty string namespace, ${method}`);

  test(() => {
    assert_true(document.createElementNS("urn:ns", "h")[method]("h"));
  }, `has a namespace, ${method}`);

  test(() => {
    assert_true(document.createElementNS("urn:ns", "h")[method]("*|h"));
  }, `has a namespace, *|, ${method}`);
}
