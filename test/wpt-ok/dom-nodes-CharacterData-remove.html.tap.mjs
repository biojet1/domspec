import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.remove</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-childnode-remove\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"ChildNode-remove.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/ChildNode-remove.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var text, text_parent,
    comment, comment_parent,
    pi, pi_parent;
setup(function() {
  text = document.createTextNode("text");
  text_parent = document.createElement("div");
  comment = document.createComment("comment");
  comment_parent = document.createElement("div");
  pi = document.createProcessingInstruction("foo", "bar");
  pi_parent = document.createElement("div");
});
testRemove(text, text_parent, "text");
testRemove(comment, comment_parent, "comment");
testRemove(pi, pi_parent, "PI");
