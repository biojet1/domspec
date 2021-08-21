import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html class=\"foo\">\n<head><meta charset=\"utf-8\"/>\n<title>getElementsByClassName across documents</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script class=\"foo\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)

async_test(function() {
  var iframe = document.createElement("iframe");
  iframe.onload = this.step_func_done(function() {
    var collection = iframe.contentDocument.getElementsByClassName("foo");
    assert_equals(collection.length, 3);
    assert_equals(collection[0].localName, "html");
    assert_equals(collection[1].localName, "head");
    assert_equals(collection[2].localName, "body");
  });
  iframe.src = "getElementsByClassNameFrame.htm";
  document.body.appendChild(iframe);
});
