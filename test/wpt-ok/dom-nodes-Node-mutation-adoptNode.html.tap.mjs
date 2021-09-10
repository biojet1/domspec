import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Node-manipulation-adopted</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#mutation-algorithms\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const old = document.implementation.createHTMLDocument("");
  const div = old.createElement("div");
  div.appendChild(old.createTextNode("text"));
  assert_equals(div.ownerDocument, old);
  assert_equals(div.firstChild.ownerDocument, old);
  document.body.appendChild(div);
  assert_equals(div.ownerDocument, document);
  assert_equals(div.firstChild.ownerDocument, document);
}, "simple append of foreign div with text");

