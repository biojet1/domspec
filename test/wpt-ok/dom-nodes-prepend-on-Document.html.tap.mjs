import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DocumentType.prepend</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-prepend\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)


function test_prepend_on_Document() {

    var node = document.implementation.createDocument(null, null);
    test(function() {
        var parent = node.cloneNode();
        parent.prepend();
        assert_array_equals(parent.childNodes, []);
    }, 'Document.prepend() without any argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        parent.prepend(x);
        assert_array_equals(parent.childNodes, [x]);
    }, 'Document.prepend() with only one element as an argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        var y = document.createElement('y');
        parent.appendChild(x);
        assert_throws_dom('HierarchyRequestError', function() { parent.prepend(y); });
        assert_array_equals(parent.childNodes, [x]);
    }, 'Document.append() with only one element as an argument, on a Document having one child.');

    test(function() {
        var parent = node.cloneNode();
        assert_throws_dom('HierarchyRequestError', function() { parent.prepend('text'); });
        assert_array_equals(parent.childNodes, []);
    }, 'Document.prepend() with text as an argument, on a Document having no child.');

    test(function() {
        var parent = node.cloneNode();
        var x = document.createElement('x');
        var y = document.createElement('y');
        assert_throws_dom('HierarchyRequestError', function() { parent.prepend(x, y); });
        assert_array_equals(parent.childNodes, []);
    }, 'Document.prepend() with two elements as the argument, on a Document having no child.');

}

test_prepend_on_Document();

