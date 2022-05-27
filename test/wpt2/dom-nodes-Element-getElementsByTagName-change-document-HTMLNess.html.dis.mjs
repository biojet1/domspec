import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><iframe src=\"Element-getElementsByTagName-change-document-HTMLNess-iframe.xml\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  setup({ single_test: true });
  onload = function() {
    var parent = document.createElement("div");
    var child1 = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    child1.textContent = "xhtml:a";
    var child2 = document.createElementNS("http://www.w3.org/1999/xhtml", "A");
    child2.textContent = "xhtml:A";
    var child3 = document.createElementNS("", "a");
    child3.textContent = "a";
    var child4 = document.createElementNS("", "A");
    child4.textContent = "A";

    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);
    parent.appendChild(child4);

    var list = parent.getElementsByTagName("A");
    assert_array_equals(list, [child1, child4],
      "In an HTML document, should lowercase the tagname passed in for HTML " +
      "elements only");

    frames[0].document.documentElement.appendChild(parent);
    assert_array_equals(list, [child1, child4],
      "After changing document, should still be lowercasing for HTML");

    assert_array_equals(parent.getElementsByTagName("A"),
                        [child2, child4],
      "New list with same root and argument should not be lowercasing now");

    // Now reinsert all those nodes into the parent, to blow away caches.
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);
    parent.appendChild(child4);
    assert_array_equals(list, [child1, child4],
      "After blowing away caches, should still have the same list");

    assert_array_equals(parent.getElementsByTagName("A"),
                        [child2, child4],
      "New list with same root and argument should still not be lowercasing");
    done();
  }
