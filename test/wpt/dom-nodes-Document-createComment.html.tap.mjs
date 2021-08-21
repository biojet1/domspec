import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createComment</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createcomment\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-ownerdocument\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-nodevalue\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-textcontent\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-length\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-nodetype\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-haschildnodes\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-childnodes\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-firstchild\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-lastchild\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-createComment-createTextNode.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-createComment-createTextNode.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

test_create("createComment", Comment, 8, "#comment");
