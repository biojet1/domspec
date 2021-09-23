import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Node.appendChild applied to CharacterData</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-appendchild\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#introduction-to-the-dom\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function create(type) {
  switch (type) {
    case "Text": return document.createTextNode("test"); break;
    case "Comment": return document.createComment("test"); break;
    case "ProcessingInstruction": return document.createProcessingInstruction("target", "test"); break;
  }
}

function testNode(type1, type2) {
  test(function() {
    var node1 = create(type1);
    var node2 = create(type2);
    assert_throws_dom("HierarchyRequestError", function () {
      node1.appendChild(node2);
    }, "CharacterData type " + type1 + " must not have children");
  }, type1 + ".appendChild(" + type2 + ")");
}

var types = ["Text", "Comment", "ProcessingInstruction"];
types.forEach(function(type1) {
  types.forEach(function(type2) {
    testNode(type1, type2);
  });
});
