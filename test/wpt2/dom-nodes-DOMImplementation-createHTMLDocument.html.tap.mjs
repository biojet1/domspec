import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"windows-1252\"/>\n<!-- Using windows-1252 to ensure that DOMImplementation.createHTMLDocument()\n     doesn't inherit utf-8 from the parent document. -->\n<title>DOMImplementation.createHTMLDocument</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-name\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-publicid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-systemid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-documentelement\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"DOMImplementation-createHTMLDocument.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/DOMImplementation-createHTMLDocument.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

createHTMLDocuments(function(doc, expectedtitle, normalizedtitle) {
  assert_true(doc instanceof Document, "Should be a Document")
  assert_true(doc instanceof Node, "Should be a Node")
  assert_equals(doc.childNodes.length, 2,
                "Document should have two child nodes")

  var doctype = doc.doctype
  assert_true(doctype instanceof DocumentType,
              "Doctype should be a DocumentType")
  assert_true(doctype instanceof Node, "Doctype should be a Node")
  assert_equals(doctype.name, "html")
  assert_equals(doctype.publicId, "")
  assert_equals(doctype.systemId, "")

  var documentElement = doc.documentElement
  assert_true(documentElement instanceof HTMLHtmlElement,
              "Document element should be a HTMLHtmlElement")
  assert_equals(documentElement.childNodes.length, 2,
                "Document element should have two child nodes")
  assert_equals(documentElement.localName, "html")
  assert_equals(documentElement.tagName, "HTML")

  var head = documentElement.firstChild
  assert_true(head instanceof HTMLHeadElement,
              "Head should be a HTMLHeadElement")
  assert_equals(head.localName, "head")
  assert_equals(head.tagName, "HEAD")

  if (expectedtitle !== undefined) {
    assert_equals(head.childNodes.length, 1)

    var title = head.firstChild
    assert_true(title instanceof HTMLTitleElement,
                "Title should be a HTMLTitleElement")
    assert_equals(title.localName, "title")
    assert_equals(title.tagName, "TITLE")
    assert_equals(title.childNodes.length, 1)
    assert_equals(title.firstChild.data, expectedtitle)
  } else {
    assert_equals(head.childNodes.length, 0)
  }

  var body = documentElement.lastChild
  assert_true(body instanceof HTMLBodyElement,
              "Body should be a HTMLBodyElement")
  assert_equals(body.localName, "body")
  assert_equals(body.tagName, "BODY")
  assert_equals(body.childNodes.length, 0)
})

test(function() {
  var doc = document.implementation.createHTMLDocument("test");
  assert_equals(doc.URL, "about:blank");
  assert_equals(doc.documentURI, "about:blank");
  assert_equals(doc.compatMode, "CSS1Compat");
  assert_equals(doc.characterSet, "UTF-8");
  assert_equals(doc.contentType, "text/html");
  assert_equals(doc.createElement("DIV").localName, "div");
}, "createHTMLDocument(): metadata")

test(function() {
  var doc = document.implementation.createHTMLDocument("test");
  assert_equals(doc.characterSet, "UTF-8", "characterSet");
  assert_equals(doc.charset, "UTF-8", "charset");
  assert_equals(doc.inputEncoding, "UTF-8", "inputEncoding");
}, "createHTMLDocument(): characterSet aliases")

test(function() {
  var doc = document.implementation.createHTMLDocument("test");
  var a = doc.createElement("a");
  // In UTF-8: 0xC3 0xA4
  a.href = "http://example.org/?\u00E4";
  assert_equals(a.href, "http://example.org/?%C3%A4");
}, "createHTMLDocument(): URL parsing")

// Test the document location getter is null outside of browser context
test(function() {
  var doc = document.implementation.createHTMLDocument();
  assert_equals(doc.location, null);
}, "createHTMLDocument(): document location getter is null")
