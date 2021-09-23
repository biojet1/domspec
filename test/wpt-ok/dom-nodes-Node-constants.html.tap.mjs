import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Node constants</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"../constants.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/constants.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var objects;
setup(function() {
  objects = [
    [Node, "Node interface object"],
    [Node.prototype, "Node prototype object"],
    [document.createElement("foo"), "Element object"],
    [document.createTextNode("bar"), "Text object"]
  ]
})
testConstants(objects, [
  ["ELEMENT_NODE", 1],
  ["ATTRIBUTE_NODE", 2],
  ["TEXT_NODE", 3],
  ["CDATA_SECTION_NODE", 4],
  ["ENTITY_REFERENCE_NODE", 5],
  ["ENTITY_NODE", 6],
  ["PROCESSING_INSTRUCTION_NODE", 7],
  ["COMMENT_NODE", 8],
  ["DOCUMENT_NODE", 9],
  ["DOCUMENT_TYPE_NODE", 10],
  ["DOCUMENT_FRAGMENT_NODE", 11],
  ["NOTATION_NODE", 12]
], "nodeType")
testConstants(objects, [
  ["DOCUMENT_POSITION_DISCONNECTED", 0x01],
  ["DOCUMENT_POSITION_PRECEDING", 0x02],
  ["DOCUMENT_POSITION_FOLLOWING", 0x04],
  ["DOCUMENT_POSITION_CONTAINS", 0x08],
  ["DOCUMENT_POSITION_CONTAINED_BY", 0x10],
  ["DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 0x20]
], "createDocumentPosition")
