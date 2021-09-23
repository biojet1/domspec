import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Test for a Chrome crash when adopting a node into another document</title>\n<link rel=\"help\" href=\"https://crbug.com/981384\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"d1\"/>\n<div id=\"d2\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  test(() => {
    d1.appendChild(document.createElement("iframe"));
    d2.remove();
    const adopted_div = d1;
    const popup = window.open();
    assert_equals(adopted_div.ownerDocument, document);
    popup.document.body.appendChild(document.body);
    assert_equals(adopted_div.ownerDocument, popup.document);
  }, "Check that removing a node and then adopting its parent into a different window/document doesn't crash.");
