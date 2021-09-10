import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DocumentType.append</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-append\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)


function test_append_on_Document() {

    var node = document.implementation.createDocument(null, null);
    test(function() {
        var parent = node.cloneNode();
        parent.append();
        assert_array_equals(parent.childNodes, []);
    }, 'Document.append() without any argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        parent.append(x);
        assert_array_equals(parent.childNodes, [x]);
    }, 'Document.append() with only one element as an argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        var y = document.createElement('y');
        parent.appendChild(x);
        assert_throws_dom('HierarchyRequestError', function() { parent.append(y); });
        assert_array_equals(parent.childNodes, [x]);
    }, 'Document.append() with only one element as an argument, on a Document having one child.');

    test(function() {
        var parent = node.cloneNode();
        assert_throws_dom('HierarchyRequestError', function() { parent.append('text'); });
        assert_array_equals(parent.childNodes, []);
    }, 'Document.append() with text as an argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        var y = document.createElement('y');
        assert_throws_dom('HierarchyRequestError', function() { parent.append(x, y); });
        assert_array_equals(parent.childNodes, []);
    }, 'Document.append() with two elements as the argument, on a Document having no child.');

}

test_append_on_Document();

