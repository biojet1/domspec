import "./wpthelp.mjs"
const html = "<html><head><title>Node.parentElement</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  assert_equals(document.parentElement, null)
}, "When the parent is null, parentElement should be null")
test(function() {
  assert_equals(document.doctype.parentElement, null)
}, "When the parent is a document, parentElement should be null (doctype)")
test(function() {
  assert_equals(document.documentElement.parentElement, null)
}, "When the parent is a document, parentElement should be null (element)")
test(function() {
  var comment = document.appendChild(document.createComment("foo"))
  assert_equals(comment.parentElement, null)
}, "When the parent is a document, parentElement should be null (comment)")
test(function() {
  var df = document.createDocumentFragment()
  assert_equals(df.parentElement, null)
  var el = document.createElement("div")
  assert_equals(el.parentElement, null)
  df.appendChild(el)
  assert_equals(el.parentNode, df)
  assert_equals(el.parentElement, null)
}, "parentElement should return null for children of DocumentFragments (element)")
test(function() {
  var df = document.createDocumentFragment()
  assert_equals(df.parentElement, null)
  var text = document.createTextNode("bar")
  assert_equals(text.parentElement, null)
  df.appendChild(text)
  assert_equals(text.parentNode, df)
  assert_equals(text.parentElement, null)
}, "parentElement should return null for children of DocumentFragments (text)")
test(function() {
  var df = document.createDocumentFragment()
  var parent = document.createElement("div")
  df.appendChild(parent)
  var el = document.createElement("div")
  assert_equals(el.parentElement, null)
  parent.appendChild(el)
  assert_equals(el.parentElement, parent)
}, "parentElement should work correctly with DocumentFragments (element)")
test(function() {
  var df = document.createDocumentFragment()
  var parent = document.createElement("div")
  df.appendChild(parent)
  var text = document.createTextNode("bar")
  assert_equals(text.parentElement, null)
  parent.appendChild(text)
  assert_equals(text.parentElement, parent)
}, "parentElement should work correctly with DocumentFragments (text)")
test(function() {
  var parent = document.createElement("div")
  var el = document.createElement("div")
  assert_equals(el.parentElement, null)
  parent.appendChild(el)
  assert_equals(el.parentElement, parent)
}, "parentElement should work correctly in disconnected subtrees (element)")
test(function() {
  var parent = document.createElement("div")
  var text = document.createTextNode("bar")
  assert_equals(text.parentElement, null)
  parent.appendChild(text)
  assert_equals(text.parentElement, parent)
}, "parentElement should work correctly in disconnected subtrees (text)")
test(function() {
  var el = document.createElement("div")
  assert_equals(el.parentElement, null)
  document.body.appendChild(el)
  assert_equals(el.parentElement, document.body)
}, "parentElement should work correctly in a document (element)")
test(function() {
  var text = document.createElement("div")
  assert_equals(text.parentElement, null)
  document.body.appendChild(text)
  assert_equals(text.parentElement, document.body)
}, "parentElement should work correctly in a document (text)")
