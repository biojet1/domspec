import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>ParentNode.append</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-append\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"pre-insertion-validation-hierarchy.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/pre-insertion-validation-hierarchy.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

preInsertionValidateHierarchy("append");

function test_append(node, nodeName) {
    test(function() {
        const parent = node.cloneNode();
        parent.append();
        assert_array_equals(parent.childNodes, []);
    }, nodeName + '.append() without any argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.append(null);
        assert_equals(parent.childNodes[0].textContent, 'null');
    }, nodeName + '.append() with null as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.append(undefined);
        assert_equals(parent.childNodes[0].textContent, 'undefined');
    }, nodeName + '.append() with undefined as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.append('text');
        assert_equals(parent.childNodes[0].textContent, 'text');
    }, nodeName + '.append() with only text as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        const x = document.createElement('x');
        parent.append(x);
        assert_array_equals(parent.childNodes, [x]);
    }, nodeName + '.append() with only one element as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        const child = document.createElement('test');
        parent.appendChild(child);
        parent.append(null);
        assert_equals(parent.childNodes[0], child);
        assert_equals(parent.childNodes[1].textContent, 'null');
    }, nodeName + '.append() with null as an argument, on a parent having a child.');

    test(function() {
        const parent = node.cloneNode();
        const x = document.createElement('x');
        const child = document.createElement('test');
        parent.appendChild(child);
        parent.append(x, 'text');
        assert_equals(parent.childNodes[0], child);
        assert_equals(parent.childNodes[1], x);
        assert_equals(parent.childNodes[2].textContent, 'text');
    }, nodeName + '.append() with one element and text as argument, on a parent having a child.');
}

test_append(document.createElement('div'), 'Element');
test_append(document.createDocumentFragment(), 'DocumentFragment');
