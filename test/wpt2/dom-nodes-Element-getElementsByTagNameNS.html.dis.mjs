import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Element.getElementsByTagNameNS</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-getelementsbytagnamens\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-Element-getElementsByTagNameNS.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-Element-getElementsByTagNameNS.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var element;
setup(function() {
  element = document.createElement("div");
  element.appendChild(document.createTextNode("text"));
  var p = element.appendChild(document.createElement("p"));
  p.appendChild(document.createElement("a"))
   .appendChild(document.createTextNode("link"));
  p.appendChild(document.createElement("b"))
   .appendChild(document.createTextNode("bold"));
  p.appendChild(document.createElement("em"))
   .appendChild(document.createElement("u"))
   .appendChild(document.createTextNode("emphasized"));
  element.appendChild(document.createComment("comment"));
});

test_getElementsByTagNameNS(element, element);

test(function() {
  assert_array_equals(element.getElementsByTagNameNS("*", element.localName), []);
}, "Matching the context object (wildcard namespace)");

test(function() {
  assert_array_equals(
    element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml",
                                   element.localName),
    []);
}, "Matching the context object (specific namespace)");
