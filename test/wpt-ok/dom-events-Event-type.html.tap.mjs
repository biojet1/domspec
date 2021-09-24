import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Event.type</title>\n<link rel=\"author\" title=\"Ms2ger\" href=\"mailto:Ms2ger@gmail.com\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-type\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
  var e = document.createEvent("Event")
  assert_equals(e.type, "");
}, "Event.type should initially be the empty string");
test(function() {
  var e = document.createEvent("Event")
  e.initEvent("foo", false, false)
  assert_equals(e.type, "foo")
}, "Event.type should be initialized by initEvent");
test(function() {
  var e = new Event("bar")
  assert_equals(e.type, "bar")
}, "Event.type should be initialized by the constructor");
