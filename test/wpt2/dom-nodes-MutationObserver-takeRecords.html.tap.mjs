import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: takeRecords</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"mutationobservers.js\"/>\n</head><body><h1>MutationObservers: takeRecords</h1>\n<div id=\"log\"/>\n\n<section style=\"display: none\">\n\n<p id=\"n00\"/>\n\n</section>\n\n<script/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/mutationobservers.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)


  var n00 = document.getElementById('n00');

  var unused = async_test("unreachabled test");

  var observer;
  unused.step(function () {
    observer = new MutationObserver(unused.unreached_func("the observer callback should not fire"));
    observer.observe(n00, { "subtree": true,
                          "childList": true,
                          "attributes": true,
                          "characterData": true,
                          "attributeOldValue": true,
                          "characterDataOldValue": true});
    n00.id = "foo";
    n00.id = "bar";
    n00.className = "bar";
    n00.textContent = "old data";
    n00.firstChild.data = "new data";
  });

  test(function() {
    checkRecords(n00, observer.takeRecords(), [{type: "attributes", attributeName: "id", oldValue: "n00"},
                           {type: "attributes", attributeName: "id", oldValue: "foo"},
                           {type: "attributes", attributeName: "class"},
                           {type: "childList", addedNodes: [n00.firstChild]},
                           {type: "characterData", oldValue: "old data", target: n00.firstChild}]);
  }, "All records present");

  test(function() {
    checkRecords(n00, observer.takeRecords(), []);
  }, "No more records present");


  unused.done();

