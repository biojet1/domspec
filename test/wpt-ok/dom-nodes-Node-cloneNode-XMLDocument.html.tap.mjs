import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Cloning of an XMLDocument</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-clonenode\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-node-clone\"/>\n\n<!-- This is testing in particular \"that implements the same interfaces as node\" -->\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const doc = document.implementation.createDocument("namespace", "");

  assert_equals(
    doc.constructor, XMLDocument,
    "Precondition check: document.implementation.createDocument() creates an XMLDocument"
  );

  const clone = doc.cloneNode(true);

  assert_equals(clone.constructor, XMLDocument);
}, "Created with createDocument");

