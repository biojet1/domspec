import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Event.defaultPrevented</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var ev;
test(function() {
  ev = document.createEvent("Event");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "When an event is created, defaultPrevented should be initialized to false.");
test(function() {
  ev.initEvent("foo", true, false);
  assert_equals(ev.bubbles, true, "bubbles");
  assert_equals(ev.cancelable, false, "cancelable");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "initEvent should work correctly (not cancelable).");
test(function() {
  assert_equals(ev.cancelable, false, "cancelable (before)");
  ev.preventDefault();
  assert_equals(ev.cancelable, false, "cancelable (after)");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "preventDefault() should not change defaultPrevented if cancelable is false.");
test(function() {
  assert_equals(ev.cancelable, false, "cancelable (before)");
  ev.returnValue = false;
  assert_equals(ev.cancelable, false, "cancelable (after)");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "returnValue should not change defaultPrevented if cancelable is false.");
test(function() {
  ev.initEvent("foo", true, true);
  assert_equals(ev.bubbles, true, "bubbles");
  assert_equals(ev.cancelable, true, "cancelable");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "initEvent should work correctly (cancelable).");
test(function() {
  assert_equals(ev.cancelable, true, "cancelable (before)");
  ev.preventDefault();
  assert_equals(ev.cancelable, true, "cancelable (after)");
  assert_equals(ev.defaultPrevented, true, "defaultPrevented");
}, "preventDefault() should change defaultPrevented if cancelable is true.");
test(function() {
  ev.initEvent("foo", true, true);
  assert_equals(ev.cancelable, true, "cancelable (before)");
  ev.returnValue = false;
  assert_equals(ev.cancelable, true, "cancelable (after)");
  assert_equals(ev.defaultPrevented, true, "defaultPrevented");
}, "returnValue should change defaultPrevented if cancelable is true.");
test(function() {
  ev.initEvent("foo", true, true);
  assert_equals(ev.bubbles, true, "bubbles");
  assert_equals(ev.cancelable, true, "cancelable");
  assert_equals(ev.defaultPrevented, false, "defaultPrevented");
}, "initEvent should unset defaultPrevented.");
