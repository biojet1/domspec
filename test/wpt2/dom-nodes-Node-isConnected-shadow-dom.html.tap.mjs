import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Test of Node.isConnected in a shadow tree</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#connected\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

function testIsConnected(mode) {
  test(() => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const root = host.attachShadow({ mode });

    const node = document.createElement("div");
    root.appendChild(node);

    assert_true(node.isConnected);
  }, `Node.isConnected in a ${mode} shadow tree`);
}

for (const mode of ["closed", "open"]) {
  testIsConnected(mode);
}
