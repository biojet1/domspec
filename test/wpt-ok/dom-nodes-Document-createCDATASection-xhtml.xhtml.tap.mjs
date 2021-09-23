import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta charset=\"utf-8\"/>\n  <title>document.createCDATASection</title>\n  <link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createcdatasection\"/>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n  <script src=\"Document-createComment-createTextNode.js\"/>\n</head>\n\n<body>\n  <script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-createComment-createTextNode.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  "use strict";
  test_create("createCDATASection", CDATASection, 4, "#cdata-section");

  test(() => {
    assert_throws_dom("InvalidCharacterError", () => document.createCDATASection(" ]" + "]>  "));
  }, "Creating a CDATA section containing the string \"]" + "]>\" must throw");
  