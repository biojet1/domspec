import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>ParentNode.prepend</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-prepend\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"pre-insertion-validation-hierarchy.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/pre-insertion-validation-hierarchy.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

preInsertionValidateHierarchy("prepend");

function test_prepend(node, nodeName) {
    test(function() {
        const parent = node.cloneNode();
        parent.prepend();
        assert_array_equals(parent.childNodes, []);
    }, nodeName + '.prepend() without any argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.prepend(null);
        assert_equals(parent.childNodes[0].textContent, 'null');
    }, nodeName + '.prepend() with null as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.prepend(undefined);
        assert_equals(parent.childNodes[0].textContent, 'undefined');
    }, nodeName + '.prepend() with undefined as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        parent.prepend('text');
        assert_equals(parent.childNodes[0].textContent, 'text');
    }, nodeName + '.prepend() with only text as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        const x = document.createElement('x');
        parent.prepend(x);
        assert_array_equals(parent.childNodes, [x]);
    }, nodeName + '.prepend() with only one element as an argument, on a parent having no child.');

    test(function() {
        const parent = node.cloneNode();
        const child = document.createElement('test');
        parent.appendChild(child);
        parent.prepend(null);
        assert_equals(parent.childNodes[0].textContent, 'null');
        assert_equals(parent.childNodes[1], child);
    }, nodeName + '.prepend() with null as an argument, on a parent having a child.');

    test(function() {
        const parent = node.cloneNode();
        const x = document.createElement('x');
        const child = document.createElement('test');
        parent.appendChild(child);
        parent.prepend(x, 'text');
        assert_equals(parent.childNodes[0], x);
        assert_equals(parent.childNodes[1].textContent, 'text');
        assert_equals(parent.childNodes[2], child);
    }, nodeName + '.prepend() with one element and text as argument, on a parent having a child.');
}

test_prepend(document.createElement('div'), 'Element');
test_prepend(document.createDocumentFragment(), 'DocumentFragment');
