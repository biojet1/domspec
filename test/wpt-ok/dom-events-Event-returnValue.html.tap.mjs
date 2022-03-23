import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head>\n  <meta charset=\"utf-8\"/>\n  <title>Event.returnValue</title>\n  <link rel=\"author\" title=\"Chris Rebert\" href=\"http://chrisrebert.com\"/>\n  <link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-returnvalue\"/>\n  <meta name=\"flags\" content=\"dom\"/>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n  <div id=\"log\"/>\n  <script/>\n</body>\n</html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var ev = new Event("foo");
  assert_true(ev.returnValue, "returnValue");
}, "When an event is created, returnValue should be initialized to true.");
test(function() {
  var ev = new Event("foo", {"cancelable": false});
  assert_false(ev.cancelable, "cancelable (before)");
  ev.preventDefault();
  assert_false(ev.cancelable, "cancelable (after)");
  assert_true(ev.returnValue, "returnValue");
}, "preventDefault() should not change returnValue if cancelable is false.");
test(function() {
  var ev = new Event("foo", {"cancelable": false});
  assert_false(ev.cancelable, "cancelable (before)");
  ev.returnValue = false;
  assert_false(ev.cancelable, "cancelable (after)");
  assert_true(ev.returnValue, "returnValue");
}, "returnValue=false should have no effect if cancelable is false.");
test(function() {
  var ev = new Event("foo", {"cancelable": true});
  assert_true(ev.cancelable, "cancelable (before)");
  ev.preventDefault();
  assert_true(ev.cancelable, "cancelable (after)");
  assert_false(ev.returnValue, "returnValue");
}, "preventDefault() should change returnValue if cancelable is true.");
test(function() {
  var ev = new Event("foo", {"cancelable": true});
  assert_true(ev.cancelable, "cancelable (before)");
  ev.returnValue = false;
  assert_true(ev.cancelable, "cancelable (after)");
  assert_false(ev.returnValue, "returnValue");
}, "returnValue should change returnValue if cancelable is true.");
test(function() {
  var ev = document.createEvent("Event");
  ev.returnValue = false;
  ev.initEvent("foo", true, true);
  assert_true(ev.bubbles, "bubbles");
  assert_true(ev.cancelable, "cancelable");
  assert_true(ev.returnValue, "returnValue");
}, "initEvent should unset returnValue.");
test(function() {
  var ev = new Event("foo", {"cancelable": true});
  ev.preventDefault();
  ev.returnValue = true;// no-op
  assert_true(ev.defaultPrevented);
  assert_false(ev.returnValue);
}, "returnValue=true should have no effect once the canceled flag was set.");
  