import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>CustomEvent</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var type = "foo";

  var target = document.createElement("div");
  target.addEventListener(type, this.step_func(function(evt) {
    assert_equals(evt.type, type);
  }), true);

  var fooEvent = document.createEvent("CustomEvent");
  fooEvent.initEvent(type, true, true);
  target.dispatchEvent(fooEvent);
}, "CustomEvent dispatching.");

test(function() {
    var e = document.createEvent("CustomEvent");
    assert_throws_js(TypeError, function() {
        e.initCustomEvent();
    });
}, "First parameter to initCustomEvent should be mandatory.");

test(function() {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("foo");
    assert_equals(e.type, "foo", "type");
    assert_false(e.bubbles, "bubbles");
    assert_false(e.cancelable, "cancelable");
    assert_equals(e.detail, null, "detail");
}, "initCustomEvent's default parameter values.");
