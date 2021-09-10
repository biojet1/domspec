import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createElement</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createelement\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-localname\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-tagname\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-prefix\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-element-namespaceuri\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<iframe src=\"/common/dummy.xml\"/>\n<iframe src=\"/common/dummy.xhtml\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function toASCIIUppercase(str) {
  var diff = "a".charCodeAt(0) - "A".charCodeAt(0);
  var res = "";
  for (var i = 0; i < str.length; ++i) {
    if ("a" <= str[i] && str[i] <= "z") {
      res += String.fromCharCode(str.charCodeAt(i) - diff);
    } else {
      res += str[i];
    }
  }
  return res;
}
function toASCIILowercase(str) {
  var diff = "a".charCodeAt(0) - "A".charCodeAt(0);
  var res = "";
  for (var i = 0; i < str.length; ++i) {
    if ("A" <= str[i] && str[i] <= "Z") {
      res += String.fromCharCode(str.charCodeAt(i) + diff);
    } else {
      res += str[i];
    }
  }
  return res;
}
var HTMLNS = "http://www.w3.org/1999/xhtml",
    valid = [
      undefined,
      null,
      "foo",
      "f1oo",
      "foo1",
      "f\u0BC6",
      "foo\u0BC6",
      ":",
      ":foo",
      "f:oo",
      "foo:",
      "f:o:o",
      "f::oo",
      "f::oo:",
      "foo:0",
      "foo:_",
      // combining char after :, invalid QName but valid Name
      "foo:\u0BC6",
      "foo:foo\u0BC6",
      "foo\u0BC6:foo",
      "xml",
      "xmlns",
      "xmlfoo",
      "xml:foo",
      "xmlns:foo",
      "xmlfoo:bar",
      "svg",
      "math",
      "FOO",
      // Test that non-ASCII chars don't get uppercased/lowercased
      "mar\u212a",
      "\u0130nput",
      "\u0131nput",
    ],
    invalid = [
      "",
      "1foo",
      "1:foo",
      "fo o",
      "\u0300foo",
      "}foo",
      "f}oo",
      "foo}",
      "\ufffffoo",
      "f\uffffoo",
      "foo\uffff",
      "<foo",
      "foo>",
      "<foo>",
      "f<oo",
      "-foo",
      ".foo",
      "\u0300",
    ]

var xmlIframe = document.querySelector('[src="/common/dummy.xml"]');
var xhtmlIframe = document.querySelector('[src="/common/dummy.xhtml"]');

function getWin(desc) {
  if (desc == "HTML document") {
    return window;
  }
  if (desc == "XML document") {
    assert_equals(xmlIframe.contentDocument.documentElement.textContent,
                  "Dummy XML document", "XML document didn't load");
    return xmlIframe.contentWindow;
  }
  if (desc == "XHTML document") {
    assert_equals(xhtmlIframe.contentDocument.documentElement.textContent,
                  "Dummy XHTML document", "XHTML document didn't load");
    return xhtmlIframe.contentWindow;
  }
}


valid.forEach(function(t) {
  ["HTML document", "XML document", "XHTML document"].forEach(function(desc) {
    async_test(function(testObj) {
      window.addEventListener("load", function() {
        testObj.step(function() {
          var win = getWin(desc);
          var doc = win.document;
          var elt = doc.createElement(t)
          assert_true(elt instanceof win.Element, "instanceof Element")
          assert_true(elt instanceof win.Node, "instanceof Node")
          assert_equals(elt.localName,
                        desc == "HTML document" ? toASCIILowercase(String(t))
                                                : String(t),
                        "localName")
          assert_equals(elt.tagName,
                        desc == "HTML document" ? toASCIIUppercase(String(t))
                                                : String(t),
                        "tagName")
          assert_equals(elt.prefix, null, "prefix")
          assert_equals(elt.namespaceURI,
                        desc == "XML document" ? null : HTMLNS, "namespaceURI")
        });
        testObj.done();
      });
    }, "createElement(" + format_value(t) + ") in " + desc);
  });
});
invalid.forEach(function(arg) {
  ["HTML document", "XML document", "XHTML document"].forEach(function(desc) {
    async_test(function(testObj) {
      window.addEventListener("load", function() {
        testObj.step(function() {
          let win = getWin(desc);
          let doc = win.document;
          assert_throws_dom("InvalidCharacterError", win.DOMException,
                            function() { doc.createElement(arg) })
        });
        testObj.done();
      });
    }, "createElement(" + format_value(arg) + ") in " + desc);
  });
});
