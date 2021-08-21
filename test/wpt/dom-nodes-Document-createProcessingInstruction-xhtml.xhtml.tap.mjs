import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>Document.createProcessingInstruction in XML documents</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-processinginstruction-target\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-ownerdocument\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<script src=\"Document-createProcessingInstruction.js\"/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-createProcessingInstruction.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)
