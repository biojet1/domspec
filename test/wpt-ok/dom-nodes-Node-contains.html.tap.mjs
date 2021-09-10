import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Node.contains() tests</title>\n<link rel=\"author\" title=\"Aryeh Gregor\" href=\"ayg@aryeh.name\"/>\n</head><body><div id=\"log\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"../common.js\"/>\n<script/>\n<!-- vim: set expandtab tabstop=2 shiftwidth=2: -->\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/common.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

"use strict";

testNodes.forEach(function(referenceName) {
  var reference = eval(referenceName);

  test(function() {
    assert_false(reference.contains(null));
  }, referenceName + ".contains(null)");

  testNodes.forEach(function(otherName) {
    var other = eval(otherName);
    test(function() {
      var ancestor = other;
      while (ancestor && ancestor !== reference) {
        ancestor = ancestor.parentNode;
      }
      if (ancestor === reference) {
        assert_true(reference.contains(other));
      } else {
        assert_false(reference.contains(other));
      }
    }, referenceName + ".contains(" + otherName + ")");
  });
});

testDiv.parentNode.removeChild(testDiv);
