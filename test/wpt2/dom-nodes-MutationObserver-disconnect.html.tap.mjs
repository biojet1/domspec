import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: disconnect</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><h1>MutationObservers: disconnect</h1>\n<div id=\"log\"/>\n<section style=\"display: none\">\n<p id=\"n00\"/>\n</section>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var n00 = document.getElementById('n00');
var parentTest = async_test("subtree mutations");
function masterMO(sequence, obs) {
  parentTest.step(function() {
    assert_equals(sequence.length, 4, "mutation records must match");
  });
  parentTest.done();
}
parentTest.step(function() {
  (new MutationObserver(masterMO)).observe(n00.parentNode, {"subtree": true, "attributes": true});
});

var disconnectTest = async_test("disconnect discarded some mutations");
function observerCallback(sequence, obs) {
  disconnectTest.step(function() {
    assert_equals(sequence.length, 1);
    assert_equals(sequence[0].type, "attributes");
    assert_equals(sequence[0].attributeName, "id");
    assert_equals(sequence[0].oldValue, "latest");
    disconnectTest.done();
  });
}

var observer;
disconnectTest.step(function() {
  observer = new MutationObserver(observerCallback);
  observer.observe(n00, {"attributes": true});
  n00.id = "foo";
  n00.id = "bar";
  observer.disconnect();
  observer.observe(n00, {"attributes": true, "attributeOldValue": true});
  n00.id = "latest";
  observer.disconnect();
  observer.observe(n00, {"attributes": true, "attributeOldValue": true});
  n00.id = "n0000";
});
