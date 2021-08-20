import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Node.nodeValue</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-nodevalue\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var the_text = document.createTextNode("A span!");
  assert_equals(the_text.nodeValue, "A span!");
  assert_equals(the_text.data, "A span!");
  the_text.nodeValue = "test again";
  assert_equals(the_text.nodeValue, "test again");
  assert_equals(the_text.data, "test again");
  the_text.nodeValue = null;
  assert_equals(the_text.nodeValue, "");
  assert_equals(the_text.data, "");
}, "Text.nodeValue");

test(function() {
  var the_comment = document.createComment("A comment!");
  assert_equals(the_comment.nodeValue, "A comment!");
  assert_equals(the_comment.data, "A comment!");
  the_comment.nodeValue = "test again";
  assert_equals(the_comment.nodeValue, "test again");
  assert_equals(the_comment.data, "test again");
  the_comment.nodeValue = null;
  assert_equals(the_comment.nodeValue, "");
  assert_equals(the_comment.data, "");
}, "Comment.nodeValue");

test(function() {
  var the_pi = document.createProcessingInstruction("pi", "A PI!");
  assert_equals(the_pi.nodeValue, "A PI!");
  assert_equals(the_pi.data, "A PI!");
  the_pi.nodeValue = "test again";
  assert_equals(the_pi.nodeValue, "test again");
  assert_equals(the_pi.data, "test again");
  the_pi.nodeValue = null;
  assert_equals(the_pi.nodeValue, "");
  assert_equals(the_pi.data, "");
}, "ProcessingInstruction.nodeValue");

test(function() {
  var the_link = document.createElement("a");
  assert_equals(the_link.nodeValue, null);
  the_link.nodeValue = "foo";
  assert_equals(the_link.nodeValue, null);
}, "Element.nodeValue");

test(function() {
  assert_equals(document.nodeValue, null);
  document.nodeValue = "foo";
  assert_equals(document.nodeValue, null);
}, "Document.nodeValue");

test(function() {
  var the_frag = document.createDocumentFragment();
  assert_equals(the_frag.nodeValue, null);
  the_frag.nodeValue = "foo";
  assert_equals(the_frag.nodeValue, null);
}, "DocumentFragment.nodeValue");

test(function() {
  var the_doctype = document.doctype;
  assert_equals(the_doctype.nodeValue, null);
  the_doctype.nodeValue = "foo";
  assert_equals(the_doctype.nodeValue, null);
}, "DocumentType.nodeValue");
