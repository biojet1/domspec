import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>ChildNode.replaceWith</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-childnode-replaceWith\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)


function test_replaceWith(child, nodeName, innerHTML) {

    test(function() {
        var parent = document.createElement('div');
        parent.appendChild(child);
        child.replaceWith();
        assert_equals(parent.innerHTML, '');
    }, nodeName + '.replaceWith() without any argument.');

    test(function() {
        var parent = document.createElement('div');
        parent.appendChild(child);
        child.replaceWith(null);
        assert_equals(parent.innerHTML, 'null');
    }, nodeName + '.replaceWith() with null as an argument.');

    test(function() {
        var parent = document.createElement('div');
        parent.appendChild(child);
        child.replaceWith(undefined);
        assert_equals(parent.innerHTML, 'undefined');
    }, nodeName + '.replaceWith() with undefined as an argument.');

    test(function() {
        var parent = document.createElement('div');
        parent.appendChild(child);
        child.replaceWith('');
        assert_equals(parent.innerHTML, '');
    }, nodeName + '.replaceWith() with empty string as an argument.');

    test(function() {
        var parent = document.createElement('div');
        parent.appendChild(child);
        child.replaceWith('text');
        assert_equals(parent.innerHTML, 'text');
    }, nodeName + '.replaceWith() with only text as an argument.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        parent.appendChild(child);
        child.replaceWith(x);
        assert_equals(parent.innerHTML, '<x></x>');
    }, nodeName + '.replaceWith() with only one element as an argument.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        var y = document.createElement('y');
        var z = document.createElement('z');
        parent.appendChild(y);
        parent.appendChild(child);
        parent.appendChild(x);
        child.replaceWith(x, y, z);
        assert_equals(parent.innerHTML, '<x></x><y></y><z></z>');
    }, nodeName + '.replaceWith() with sibling of child as arguments.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        parent.appendChild(child);
        parent.appendChild(x);
        parent.appendChild(document.createTextNode('1'));
        child.replaceWith(x, '2');
        assert_equals(parent.innerHTML, '<x></x>21');
    }, nodeName + '.replaceWith() with one sibling of child and text as arguments.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        parent.appendChild(child);
        parent.appendChild(x);
        parent.appendChild(document.createTextNode('text'));
        child.replaceWith(x, child);
        assert_equals(parent.innerHTML, '<x></x>' + innerHTML + 'text');
    }, nodeName + '.replaceWith() with one sibling of child and child itself as arguments.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        parent.appendChild(child);
        child.replaceWith(x, 'text');
        assert_equals(parent.innerHTML, '<x></x>text');
    }, nodeName + '.replaceWith() with one element and text as arguments.');

    test(function() {
        var parent = document.createElement('div');
        var x = document.createElement('x');
        var y = document.createElement('y');
        parent.appendChild(x);
        parent.appendChild(y);
        child.replaceWith(x, y);
        assert_equals(parent.innerHTML, '<x></x><y></y>');
    }, nodeName + '.replaceWith() on a parentless child with two elements as arguments.');
}

test_replaceWith(document.createComment('test'), 'Comment', '<!--test-->');
test_replaceWith(document.createElement('test'), 'Element', '<test></test>');
test_replaceWith(document.createTextNode('test'), 'Text', 'test');

