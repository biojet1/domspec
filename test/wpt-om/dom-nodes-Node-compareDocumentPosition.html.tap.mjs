import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Node.compareDocumentPosition() tests</title>\n<link rel=\"author\" title=\"Aryeh Gregor\" href=\"ayg@aryeh.name\"/>\n</head><body><div id=\"log\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"../common.js\"/>\n<script/>\n<!-- vim: set expandtab tabstop=2 shiftwidth=2: -->\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/common.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

"use strict";

testNodes.forEach(function(referenceName) {
  var reference = eval(referenceName);
  testNodes.forEach(function(otherName) {
    var other = eval(otherName);
    test(function() {
      var result = reference.compareDocumentPosition(other);

      // "If other and reference are the same object, return zero and
      // terminate these steps."
      if (other === reference) {
        assert_equals(result, 0);
        return;
      }

      // "If other and reference are not in the same tree, return the result of
      // adding DOCUMENT_POSITION_DISCONNECTED,
      // DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either
      // DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING, with the
      // constraint that this is to be consistent, together and terminate these
      // steps."
      if (furthestAncestor(reference) !== furthestAncestor(other)) {
      //   // TODO: Test that it's consistent.
        assert_in_array(result, [Node.DOCUMENT_POSITION_DISCONNECTED +
                                 Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC +
                                 Node.DOCUMENT_POSITION_PRECEDING,
                                 Node.DOCUMENT_POSITION_DISCONNECTED +
                                 Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC +
                                 Node.DOCUMENT_POSITION_FOLLOWING,
                                 // Added
                                 Node.DOCUMENT_POSITION_DISCONNECTED +
                                 Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                                 ]);
        return;
      }

      // "If other is an ancestor of reference, return the result of
      // adding DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING
      // and terminate these steps."
      var ancestor = reference.parentNode;
      while (ancestor && ancestor !== other) {
        ancestor = ancestor.parentNode;
      }
      if (ancestor === other) {
        assert_equals(result, Node.DOCUMENT_POSITION_CONTAINS +
                              Node.DOCUMENT_POSITION_PRECEDING);
        return;
      }

      // "If other is a descendant of reference, return the result of adding
      // DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING and
      // terminate these steps."
      ancestor = other.parentNode;
      while (ancestor && ancestor !== reference) {
        ancestor = ancestor.parentNode;
      }
      if (ancestor === reference) {
        assert_equals(result, Node.DOCUMENT_POSITION_CONTAINED_BY +
                              Node.DOCUMENT_POSITION_FOLLOWING);
        return;
      }

      // "If other is preceding reference return DOCUMENT_POSITION_PRECEDING
      // and terminate these steps."
      var prev = previousNode(reference);
      while (prev && prev !== other) {
        prev = previousNode(prev);
      }
      if (prev === other) {
        assert_equals(result, Node.DOCUMENT_POSITION_PRECEDING);
        return;
      }

      // "Return DOCUMENT_POSITION_FOLLOWING."
      assert_equals(result, Node.DOCUMENT_POSITION_FOLLOWING);
    }, referenceName + ".compareDocumentPosition(" + otherName + ")");
  });
});

testDiv.parentNode.removeChild(testDiv);
