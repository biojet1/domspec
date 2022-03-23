import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Event propagation tests</title>\n<link rel=\"author\" title=\"Aryeh Gregor\" href=\"ayg@aryeh.name\"/>\n</head><body><div id=\"log\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

function testPropagationFlag(ev, expected, desc) {
  test(function() {
    var called = false;
    var callback = function() { called = true };
    this.add_cleanup(function() {
      document.head.removeEventListener("foo", callback)
    });
    document.head.addEventListener("foo", callback);
    document.head.dispatchEvent(ev);
    assert_equals(called, expected, "Propagation flag");
    // dispatchEvent resets the propagation flags so it will happily dispatch
    // the event the second time around.
    document.head.dispatchEvent(ev);
    assert_equals(called, true, "Propagation flag after first dispatch");
  }, desc);
}

var ev = document.createEvent("Event");
ev.initEvent("foo", true, false);
testPropagationFlag(ev, true, "Newly-created Event");
ev.stopPropagation();
testPropagationFlag(ev, false, "After stopPropagation()");
ev.initEvent("foo", true, false);
testPropagationFlag(ev, true, "Reinitialized after stopPropagation()");

var ev = document.createEvent("Event");
ev.initEvent("foo", true, false);
ev.stopImmediatePropagation();
testPropagationFlag(ev, false, "After stopImmediatePropagation()");
ev.initEvent("foo", true, false);
testPropagationFlag(ev, true, "Reinitialized after stopImmediatePropagation()");

var ev = document.createEvent("Event");
ev.initEvent("foo", true, false);
ev.cancelBubble = true;
testPropagationFlag(ev, false, "After cancelBubble=true");
ev.initEvent("foo", true, false);
testPropagationFlag(ev, true, "Reinitialized after cancelBubble=true");
