import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Event.type set to the empty string</title>\n<link rel=\"author\" title=\"Ms2ger\" href=\"mailto:Ms2ger@gmail.com\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-type\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function do_test(t, e) {
  assert_equals(e.type, "", "type");
  assert_equals(e.bubbles, false, "bubbles");
  assert_equals(e.cancelable, false, "cancelable");

  var target = document.createElement("div");
  var handled = false;
  target.addEventListener("", t.step_func(function(e) {
    handled = true;
  }));
  assert_true(target.dispatchEvent(e));
  assert_true(handled);
}

async_test(function() {
  var e = document.createEvent("Event");
  e.initEvent("", false, false);
  do_test(this, e);
  this.done();
}, "initEvent");

async_test(function() {
  var e = new Event("");
  do_test(this, e);
  this.done();
}, "Constructor");
