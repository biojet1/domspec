import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createElementNS</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createelementns\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-createElementNS.js\"/>\n</head><body><div id=\"log\"/>\n<iframe src=\"/common/dummy.xml\"/>\n<iframe src=\"/common/dummy.xhtml\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-createElementNS.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var tests = createElementNS_tests.concat([
  /* Arrays with three elements:
   *   the namespace argument
   *   the qualifiedName argument
   *   the expected exception, or null if none
   */
  ["", "", "INVALID_CHARACTER_ERR"],
  [null, "", "INVALID_CHARACTER_ERR"],
  [undefined, "", "INVALID_CHARACTER_ERR"],
  ["http://example.com/", null, null],
  ["http://example.com/", "", "INVALID_CHARACTER_ERR"],
  ["/", null, null],
  ["/", "", "INVALID_CHARACTER_ERR"],
  ["http://www.w3.org/XML/1998/namespace", null, null],
  ["http://www.w3.org/XML/1998/namespace", "", "INVALID_CHARACTER_ERR"],
  ["http://www.w3.org/2000/xmlns/", null, "NAMESPACE_ERR"],
  ["http://www.w3.org/2000/xmlns/", "", "INVALID_CHARACTER_ERR"],
  ["foo:", null, null],
  ["foo:", "", "INVALID_CHARACTER_ERR"],
])

var xmlIframe = document.querySelector('[src="/common/dummy.xml"]');
var xhtmlIframe = document.querySelector('[src="/common/dummy.xhtml"]');

function runTest(t, i, desc) {
  async_test(function(testObj) {
    window.addEventListener("load", function() {
      testObj.step(function() {
        var doc;
        if (desc == "HTML document") {
          doc = document;
        } else if (desc == "XML document") {
          doc = xmlIframe.contentDocument;
          // Make sure we're testing the right document
          assert_equals(doc.documentElement.textContent, "Dummy XML document");
        } else if (desc == "XHTML document") {
          doc = xhtmlIframe.contentDocument;
          assert_equals(doc.documentElement.textContent, "Dummy XHTML document");
        }
        var namespace = t[0], qualifiedName = t[1], expected = t[2]
        if (expected != null) {
          assert_throws_dom(expected, doc.defaultView.DOMException, function() {doc.createElementNS(namespace, qualifiedName) });
        } else {
          var element = doc.createElementNS(namespace, qualifiedName)
          assert_not_equals(element, null)
          assert_equals(element.nodeType, Node.ELEMENT_NODE)
          assert_equals(element.nodeType, element.ELEMENT_NODE)
          assert_equals(element.nodeValue, null)
          assert_equals(element.ownerDocument, doc)
          var qualified = String(qualifiedName), names = []
          if (qualified.indexOf(":") >= 0) {
            names = qualified.split(":", 2)
          } else {
            names = [null, qualified]
          }
          assert_equals(element.prefix, names[0])
          assert_equals(element.localName, names[1])
          assert_equals(element.tagName, qualified)
          assert_equals(element.nodeName, qualified)
          assert_equals(element.namespaceURI,
                        namespace === undefined || namespace === "" ? null
                                                                    : namespace)
        }
      });
      testObj.done();
    });
  }, "createElementNS test in " + desc + ": " + t.map(format_value))
}

tests.forEach(function(t, i) {
  runTest(t, i, "HTML document")
  runTest(t, i, "XML document")
  runTest(t, i, "XHTML document")
})


test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml";
  var element = document.createElementNS(HTMLNS, "span");
  assert_equals(element.namespaceURI, HTMLNS);
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_true(element instanceof HTMLElement, "Should be an HTMLElement");
  assert_true(element instanceof HTMLSpanElement, "Should be an HTMLSpanElement");
}, "Lower-case HTML element without a prefix");

test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml";
  var element = document.createElementNS(HTMLNS, "html:span");
  assert_equals(element.namespaceURI, HTMLNS);
  assert_equals(element.prefix, "html");
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "HTML:SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_true(element instanceof HTMLElement, "Should be an HTMLElement");
  assert_true(element instanceof HTMLSpanElement, "Should be an HTMLSpanElement");
}, "Lower-case HTML element with a prefix");

test(function() {
  var element = document.createElementNS("test", "span");
  assert_equals(element.namespaceURI, "test");
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "span");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Lower-case non-HTML element without a prefix");

test(function() {
  var element = document.createElementNS("test", "html:span");
  assert_equals(element.namespaceURI, "test");
  assert_equals(element.prefix, "html");
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "html:span");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Lower-case non-HTML element with a prefix");

test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml";
  var element = document.createElementNS(HTMLNS, "SPAN");
  assert_equals(element.namespaceURI, HTMLNS);
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "SPAN");
  assert_equals(element.tagName, "SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_true(element instanceof HTMLElement, "Should be an HTMLElement");
  assert_true(element instanceof HTMLUnknownElement, "Should be an HTMLUnknownElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Upper-case HTML element without a prefix");

test(function() {
  var HTMLNS = "http://www.w3.org/1999/xhtml";
  var element = document.createElementNS(HTMLNS, "html:SPAN");
  assert_equals(element.namespaceURI, HTMLNS);
  assert_equals(element.prefix, "html");
  assert_equals(element.localName, "SPAN");
  assert_equals(element.tagName, "HTML:SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_true(element instanceof HTMLElement, "Should be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Upper-case HTML element with a prefix");

test(function() {
  var element = document.createElementNS("test", "SPAN");
  assert_equals(element.namespaceURI, "test");
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "SPAN");
  assert_equals(element.tagName, "SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Upper-case non-HTML element without a prefix");

test(function() {
  var element = document.createElementNS("test", "html:SPAN");
  assert_equals(element.namespaceURI, "test");
  assert_equals(element.prefix, "html");
  assert_equals(element.localName, "SPAN");
  assert_equals(element.tagName, "html:SPAN");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "Upper-case non-HTML element with a prefix");

test(function() {
  var element = document.createElementNS(null, "span");
  assert_equals(element.namespaceURI, null);
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "span");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "null namespace");

test(function() {
  var element = document.createElementNS(undefined, "span");
  assert_equals(element.namespaceURI, null);
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "span");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "undefined namespace");

test(function() {
  var element = document.createElementNS("", "span");
  assert_equals(element.namespaceURI, null);
  assert_equals(element.prefix, null);
  assert_equals(element.localName, "span");
  assert_equals(element.tagName, "span");
  assert_true(element instanceof Node, "Should be a Node");
  assert_true(element instanceof Element, "Should be an Element");
  assert_false(element instanceof HTMLElement, "Should not be an HTMLElement");
  assert_false(element instanceof HTMLSpanElement, "Should not be an HTMLSpanElement");
}, "empty string namespace");
