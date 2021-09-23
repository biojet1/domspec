import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Element.getElementsByTagName</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-getelementsbytagname\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-Element-getElementsByTagName.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-Element-getElementsByTagName.js`;
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

test_getElementsByTagName(element, element);

test(function() {
  assert_array_equals(element.getElementsByTagName(element.localName), []);
}, "Matching the context object");
