import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>ParentNode.children</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-children\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<div style=\"display: none\">\n  <ul><li id=\"test\">1</li><li>2</li><li>3</li><li>4</li></ul>\n</div>\n<script/>\n</body></html>"
const document = loadDOM(html)

test(() => {
  var node = document.getElementById("test");
  var parentNode = node.parentNode;
  var children = parentNode.children;
  assert_true(children instanceof HTMLCollection);
  var li = document.createElement("li");
  assert_equals(children.length, 4);

  parentNode.appendChild(li);
  assert_equals(children.length, 5);

  parentNode.removeChild(li);
  assert_equals(children.length, 4);
}, "ParentNode.children should be a live collection");
