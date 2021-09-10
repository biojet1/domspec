import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>DOMImplementation.createHTMLDocument</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

// Test the document location getter is null outside of browser context
test(function() {
  var iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  var implementation = iframe.contentDocument.implementation;
  iframe.remove();
  assert_not_equals(implementation.createHTMLDocument(), null);
}, "createHTMLDocument(): from a saved and detached implementation does not return null")
