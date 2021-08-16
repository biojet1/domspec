import "./wpthelp.mjs";
const html =
  '<html><head><title>Node.contains() tests</title>\n<link rel="author" title="Aryeh Gregor" href="ayg@aryeh.name"/>\n</head><body><div id="log"/>\n<script src="/resources/testharness.js"/>\n<script src="/resources/testharnessreport.js"/>\n<script src="../common.js"/>\n<script/>\n<!-- vim: set expandtab tabstop=2 shiftwidth=2: -->\n</body></html>';
const document = loadDOM(html);

("use strict");
import fs from "fs";
import vm from "vm";
const data = fs.readFileSync(`${process.env.WPT_ROOT}/dom/common.js`, "utf8");
vm.runInThisContext(data);

testNodes.forEach(function (referenceName) {
  var reference = eval(referenceName);

  test(function () {
    assert_false(reference.contains(null));
  }, referenceName + ".contains(null)");

  testNodes.forEach(function (otherName) {
    var other = eval(otherName);
    test(function () {
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
