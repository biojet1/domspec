import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DocumentFragment constructor</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documentfragment-documentfragment\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const fragment = new DocumentFragment();
  assert_equals(fragment.ownerDocument, document);
}, "Sets the owner document to the current global object associated document");

test(() => {
  const fragment = new DocumentFragment();
  const text = document.createTextNode("");
  fragment.appendChild(text);
  assert_equals(fragment.firstChild, text);
}, "Create a valid document DocumentFragment");
