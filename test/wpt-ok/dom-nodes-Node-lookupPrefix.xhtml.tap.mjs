import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:x=\"test\">\n<head>\n<title>Node.lookupPrefix</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body xmlns:s=\"test\">\n<div id=\"log\"/>\n<x xmlns:t=\"test\"><!--comment--><?test test?>TEST<x/></x>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)

function lookupPrefix(node, ns, prefix) {
  test(function() {
    assert_equals(node.lookupPrefix(ns), prefix)
  })
}
var x = document.getElementsByTagName("x")[0];
lookupPrefix(document, "test", "x") // XXX add test for when there is no documentElement
lookupPrefix(document, null, null)
lookupPrefix(x, "http://www.w3.org/1999/xhtml", null)
lookupPrefix(x, "something", null)
lookupPrefix(x, null, null)
lookupPrefix(x, "test", "t")
lookupPrefix(x.parentNode, "test", "s")
lookupPrefix(x.firstChild, "test", "t")
lookupPrefix(x.childNodes[1], "test", "t")
lookupPrefix(x.childNodes[2], "test", "t")
lookupPrefix(x.lastChild, "test", "t")
x.parentNode.removeChild(x)
