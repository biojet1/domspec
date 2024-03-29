import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>ParentNode.replaceChildren</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-parentnode-replacechildren\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"pre-insertion-validation-hierarchy.js\"/>\n<script/>\n\n</head></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/pre-insertion-validation-hierarchy.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  preInsertionValidateHierarchy("replaceChildren");

  function test_replacechildren(node, nodeName) {
    test(() => {
      const parent = node.cloneNode();
      parent.replaceChildren();
      assert_array_equals(parent.childNodes, []);
    }, `${nodeName}.replaceChildren() without any argument, on a parent having no child.`);

    test(() => {
      const parent = node.cloneNode();
      parent.replaceChildren(null);
      assert_equals(parent.childNodes[0].textContent, 'null');
    }, `${nodeName}.replaceChildren() with null as an argument, on a parent having no child.`);

    test(() => {
      const parent = node.cloneNode();
      parent.replaceChildren(undefined);
      assert_equals(parent.childNodes[0].textContent, 'undefined');
    }, `${nodeName}.replaceChildren() with undefined as an argument, on a parent having no child.`);

    test(() => {
      const parent = node.cloneNode();
      parent.replaceChildren('text');
      assert_equals(parent.childNodes[0].textContent, 'text');
    }, `${nodeName}.replaceChildren() with only text as an argument, on a parent having no child.`);

    test(() => {
      const parent = node.cloneNode();
      const x = document.createElement('x');
      parent.replaceChildren(x);
      assert_array_equals(parent.childNodes, [x]);
    }, `${nodeName}.replaceChildren() with only one element as an argument, on a parent having no child.`);

    test(() => {
      const parent = node.cloneNode();
      const child = document.createElement('test');
      parent.appendChild(child);
      parent.replaceChildren();
      assert_array_equals(parent.childNodes, []);
    }, `${nodeName}.replaceChildren() without any argument, on a parent having a child.`);

    test(() => {
      const parent = node.cloneNode();
      const child = document.createElement('test');
      parent.appendChild(child);
      parent.replaceChildren(null);
      assert_equals(parent.childNodes.length, 1);
      assert_equals(parent.childNodes[0].textContent, 'null');
    }, `${nodeName}.replaceChildren() with null as an argument, on a parent having a child.`);

    test(() => {
      const parent = node.cloneNode();
      const x = document.createElement('x');
      const child = document.createElement('test');
      parent.appendChild(child);
      parent.replaceChildren(x, 'text');
      assert_equals(parent.childNodes.length, 2);
      assert_equals(parent.childNodes[0], x);
      assert_equals(parent.childNodes[1].textContent, 'text');
    }, `${nodeName}.replaceChildren() with one element and text as argument, on a parent having a child.`);

    async_test(t => {
      let phase = 0;

      const previousParent = node.cloneNode();
      const insertions = [
        document.createElement("test1"),
        document.createElement("test2")
      ];
      previousParent.append(...insertions);

      const parent = node.cloneNode();
      const children = [
        document.createElement("test3"),
        document.createElement("test4")
      ];
      parent.append(...children);

      const previousObserver = new MutationObserver(mutations => {
        t.step(() => {
          assert_equals(phase, 0);
          assert_equals(mutations.length, 2);
          for (const [i, mutation] of Object.entries(mutations)) {
            assert_equals(mutation.type, "childList");
            assert_equals(mutation.addedNodes.length, 0);
            assert_equals(mutation.removedNodes.length, 1);
            assert_equals(mutation.removedNodes[0], insertions[i]);
          }
          phase = 1;
        });
      });
      previousObserver.observe(previousParent, { childList: true });

      const observer = new MutationObserver(mutations => {
        t.step(() => {
          assert_equals(phase, 1, "phase");
          assert_equals(mutations.length, 1, "mutations.length");
          const mutation = mutations[0];
          assert_equals(mutation.type, "childList", "mutation.type");
          assert_equals(mutation.addedNodes.length, 2, "added nodes length");
          assert_array_equals([...mutation.addedNodes], insertions, "added nodes");
          assert_equals(mutation.removedNodes.length, 2, "removed nodes length");
          assert_array_equals([...mutation.removedNodes], children, "removed nodes");
        });
        t.done();
      });
      observer.observe(parent, { childList: true });

      parent.replaceChildren(...previousParent.children);
    }, `${nodeName}.replaceChildren() should move nodes in the right order`);
  }

  test_replacechildren(document.createElement('div'), 'Element');
  test_replacechildren(document.createDocumentFragment(), 'DocumentFragment');
