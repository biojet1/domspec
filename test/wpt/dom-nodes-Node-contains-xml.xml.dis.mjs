import "./wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<title>Node.nodeName</title>\n<link rel=\"author\" title=\"Olli Pettay\" href=\"mailto:Olli@Pettay.fi\"/>\n<link rel=\"author\" title=\"Ms2ger\" href=\"mailto:Ms2ger@gmail.com\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n<div id=\"test\">\n  <input type=\"button\" id=\"testbutton\"/>\n  <a id=\"link\">Link text</a>\n</div>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `application/xml`)


test(function() {
  assert_throws_js(TypeError, function() {
    document.contains();
  });
  assert_throws_js(TypeError, function() {
    document.contains(9);
  });
}, "Should throw TypeError if the arguments are wrong.");

test(function() {
  assert_equals(document.contains(null), false, "Document shouldn't contain null.");
}, "contains(null) should be false");

test(function() {
  assert_equals(document.contains(document), true, "Document should contain itself!");
  assert_equals(document.contains(document.createElement("foo")), false, "Document shouldn't contain element which is't in the document");
  assert_equals(document.contains(document.createTextNode("foo")), false, "Document shouldn't contain text node which is't in the document");
}, "document.contains");

test(function() {
  var tb = document.getElementById("testbutton");
  assert_equals(tb.contains(tb), true, "Element should contain itself.")
  assert_equals(document.contains(tb), true, "Document should contain element in it!");
  assert_equals(document.documentElement.contains(tb), true, "Element should contain element in it!");
}, "contains with a button");

test(function() {
  var link = document.getElementById("link");
  var text = link.firstChild;
  assert_equals(document.contains(text), true, "Document should contain a text node in it.");
  assert_equals(link.contains(text), true, "Element should contain a text node in it.");
  assert_equals(text.contains(text), true, "Text node should contain itself.");
  assert_equals(text.contains(link), false, "text node shouldn't contain its parent.");
}, "contains with a text node");

test(function() {
  var pi = document.createProcessingInstruction("adf", "asd");
  assert_equals(pi.contains(document), false, "Processing instruction shouldn't contain document");
  assert_equals(document.contains(pi), false, "Document shouldn't contain newly created processing instruction");
  document.documentElement.appendChild(pi);
  assert_equals(document.contains(pi), true, "Document should contain processing instruction");
}, "contains with a processing instruction");

test(function() {
  if ("createContextualFragment" in document.createRange()) {
    var df = document.createRange().createContextualFragment("<div>foo</div>");
    assert_equals(df.contains(df.firstChild), true, "Document fragment should contain its child");
    assert_equals(df.contains(df.firstChild.firstChild), true,
       "Document fragment should contain its descendant");
    assert_equals(df.contains(df), true, "Document fragment should contain itself.");
  }
}, "contains with a document fragment");

test(function() {
  var d = document.implementation.createHTMLDocument("");
  assert_equals(document.contains(d), false,
     "Document shouldn't contain another document.");
  assert_equals(document.contains(d.createElement("div")), false,
     "Document shouldn't contain an element from another document.");
  assert_equals(document.contains(d.documentElement), false,
     "Document shouldn't contain an element from another document.");
}, "contaibs with another document");

