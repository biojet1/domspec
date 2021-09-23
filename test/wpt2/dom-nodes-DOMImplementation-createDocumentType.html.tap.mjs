import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DOMImplementation.createDocumentType(qualifiedName, publicId, systemId)</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-name\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-publicid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-documenttype-systemid\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-ownerdocument\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var tests = [
    ["", "", "", "INVALID_CHARACTER_ERR"],
    ["test:root", "1234", "", null],
    ["test:root", "1234", "test", null],
    ["test:root", "test", "", null],
    ["test:root", "test", "test", null],
    ["_:_", "", "", null],
    ["_:h0", "", "", null],
    ["_:test", "", "", null],
    ["_:_.", "", "", null],
    ["_:a-", "", "", null],
    ["l_:_", "", "", null],
    ["ns:_0", "", "", null],
    ["ns:a0", "", "", null],
    ["ns0:test", "", "", null],
    ["ns:EEE.", "", "", null],
    ["ns:_-", "", "", null],
    ["a.b:c", "", "", null],
    ["a-b:c.j", "", "", null],
    ["a-b:c", "", "", null],
    ["foo", "", "", null],
    ["1foo", "", "", "INVALID_CHARACTER_ERR"],
    ["foo1", "", "", null],
    ["f1oo", "", "", null],
    ["@foo", "", "", "INVALID_CHARACTER_ERR"],
    ["foo@", "", "", "INVALID_CHARACTER_ERR"],
    ["f@oo", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:{", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:}", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:~", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:'", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:!", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:@", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:#", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:$", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:%", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:^", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:&", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:*", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:(", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:)", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:+", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:=", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:[", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:]", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:\\", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:/", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:;", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:`", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:<", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:>", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:,", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:a ", "", "", "INVALID_CHARACTER_ERR"],
    ["edi:\"", "", "", "INVALID_CHARACTER_ERR"],
    ["{", "", "", "INVALID_CHARACTER_ERR"],
    ["}", "", "", "INVALID_CHARACTER_ERR"],
    ["'", "", "", "INVALID_CHARACTER_ERR"],
    ["~", "", "", "INVALID_CHARACTER_ERR"],
    ["`", "", "", "INVALID_CHARACTER_ERR"],
    ["@", "", "", "INVALID_CHARACTER_ERR"],
    ["#", "", "", "INVALID_CHARACTER_ERR"],
    ["$", "", "", "INVALID_CHARACTER_ERR"],
    ["%", "", "", "INVALID_CHARACTER_ERR"],
    ["^", "", "", "INVALID_CHARACTER_ERR"],
    ["&", "", "", "INVALID_CHARACTER_ERR"],
    ["*", "", "", "INVALID_CHARACTER_ERR"],
    ["(", "", "", "INVALID_CHARACTER_ERR"],
    [")", "", "", "INVALID_CHARACTER_ERR"],
    ["f:oo", "", "", null],
    [":foo", "", "", "INVALID_CHARACTER_ERR"],
    ["foo:", "", "", "INVALID_CHARACTER_ERR"],
    ["prefix::local", "", "", "INVALID_CHARACTER_ERR"],
    ["foo", "foo", "", null],
    ["foo", "", "foo", null],
    ["foo", "f'oo", "", null],
    ["foo", "", "f'oo", null],
    ["foo", 'f"oo', "", null],
    ["foo", "", 'f"oo', null],
    ["foo", "f'o\"o", "", null],
    ["foo", "", "f'o\"o", null],
    ["foo", "foo>", "", null],
    ["foo", "", "foo>", null]
  ]

  var doc = document.implementation.createHTMLDocument("title");
  var doTest = function(aDocument, aQualifiedName, aPublicId, aSystemId) {
    var doctype = aDocument.implementation.createDocumentType(aQualifiedName, aPublicId, aSystemId);
    assert_equals(doctype.name, aQualifiedName, "name")
    assert_equals(doctype.nodeName, aQualifiedName, "nodeName")
    assert_equals(doctype.publicId, aPublicId, "publicId")
    assert_equals(doctype.systemId, aSystemId, "systemId")
    assert_equals(doctype.ownerDocument, aDocument, "ownerDocument")
    assert_equals(doctype.nodeValue, null, "nodeValue")
  }
  tests.forEach(function(t) {
    var qualifiedName = t[0], publicId = t[1], systemId = t[2], expected = t[3]
    test(function() {
      if (expected) {
        assert_throws_dom(expected, function() {
          document.implementation.createDocumentType(qualifiedName, publicId, systemId)
        })
      } else {
        doTest(document, qualifiedName, publicId, systemId);
        doTest(doc, qualifiedName, publicId, systemId);
      }
    }, "createDocumentType(" + format_value(qualifiedName) + ", " + format_value(publicId) + ", " + format_value(systemId) + ") should " +
       (expected ? "throw " + expected : "work"));
  });
})
