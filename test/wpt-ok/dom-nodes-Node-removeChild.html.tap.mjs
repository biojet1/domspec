import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Node.removeChild</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"creators.js\"/>\n</head><body><div id=\"log\"/>\n<iframe src=\"about:blank\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/creators.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var documents = [
  [function() { return document }, "the main document"],
  [function() { return frames[0].document }, "a frame document"],
  [function() { return document.implementation.createHTMLDocument() },
   "a synthetic document"],
];

documents.forEach(function(d) {
  var get = d[0], description = d[1]
  for (var p in creators) {
    var creator = creators[p];
    test(function() {
      var doc = get();
      var s = doc[creator]("a")
      assert_equals(s.ownerDocument, doc)
      assert_throws_dom("NOT_FOUND_ERR", function() { document.body.removeChild(s) })
      assert_equals(s.ownerDocument, doc)
    }, "Passing a detached " + p + " from " + description +
       " to removeChild should not affect it.")

    test(function() {
      var doc = get();
      var s = doc[creator]("b")
      doc.documentElement.appendChild(s)
      assert_equals(s.ownerDocument, doc)
      assert_throws_dom("NOT_FOUND_ERR", function() { document.body.removeChild(s) })
      assert_equals(s.ownerDocument, doc)
    }, "Passing a non-detached " + p + " from " + description +
       " to removeChild should not affect it.")

    test(function() {
      var doc = get();
      var s = doc[creator]("test")
      doc.body.appendChild(s)
      assert_equals(s.ownerDocument, doc);
      // s.removeChild(doc);
      assert_throws_dom(
        "NOT_FOUND_ERR",
        // (doc.defaultView || self).DOMException,
        function() { s.removeChild(doc) }
      );
    }, "Calling removeChild on a " + p + " from " + description +
       " with no children should throw NOT_FOUND_ERR.")
  }
});

test(function() {
  assert_throws_js(TypeError, function() { document.body.removeChild(null) })
  assert_throws_js(TypeError, function() { document.body.removeChild({'a':'b'}) })
}, "Passing a value that is not a Node reference to removeChild should throw TypeError.")
