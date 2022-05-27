import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"UTF-8\"/>\n<title>Selectors-API Level 2 Test Suite: HTML with Selectors Level 3</title>\n<!-- Selectors API Test Suite Version 3 -->\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"/dom/nodes/selectors.js\"/>\n<script src=\"/dom/nodes/ParentNode-querySelector-All.js\"/>\n<script src=\"Element-matches.js\"/>\n<script src=\"Element-matches-init.js\"/>\n<style>iframe { visibility: hidden; position: absolute; }</style>\n\n</head><body><div id=\"log\">This test requires JavaScript.</div>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/dom/nodes/selectors.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)
const src1 = `${process.env.WPT_ROOT}/dom/nodes/dom/nodes/ParentNode-querySelector-All.js`;
vm.runInThisContext(fs.readFileSync(src1, "utf8"), src1)
const src2 = `${process.env.WPT_ROOT}/dom/nodes/Element-matches.js`;
vm.runInThisContext(fs.readFileSync(src2, "utf8"), src2)
const src3 = `${process.env.WPT_ROOT}/dom/nodes/Element-matches-init.js`;
vm.runInThisContext(fs.readFileSync(src3, "utf8"), src3)

  async_test(function() {
    var frame = document.createElement("iframe");
    frame.onload = this.step_func_done(e => init(e, "matches" ));
    frame.src = "/dom/nodes/ParentNode-querySelector-All-content.html#target";
    document.body.appendChild(frame);
  });
