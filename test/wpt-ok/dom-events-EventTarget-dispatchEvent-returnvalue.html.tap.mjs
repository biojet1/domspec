import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>EventTarget.dispatchEvent: return value</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-event-dispatch\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-preventdefault\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-returnvalue\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-defaultprevented\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<table id=\"table\" border=\"1\" style=\"display: none\">\n    <tbody id=\"table-body\">\n    <tr id=\"table-row\">\n        <td id=\"table-cell\">Shady Grove</td>\n        <td>Aeolian</td>\n    </tr>\n    <tr id=\"parent\">\n        <td id=\"target\">Over the river, Charlie</td>\n        <td>Dorian</td>\n    </tr>\n    </tbody>\n</table>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function() {
    var event_type = "foo";
    var target = document.getElementById("target");
    var parent = document.getElementById("parent");
    var default_prevented;
    var return_value;

    parent.addEventListener(event_type, function(e) {}, true);
    target.addEventListener(event_type, function(e) {
        evt.preventDefault();
        default_prevented = evt.defaultPrevented;
        return_value = evt.returnValue;
    }, true);
    target.addEventListener(event_type, function(e) {}, true);

    var evt = document.createEvent("Event");
    evt.initEvent(event_type, true, true);

    assert_true(parent.dispatchEvent(evt));
    assert_false(target.dispatchEvent(evt));
    assert_true(default_prevented);
    assert_false(return_value);
}, "Return value of EventTarget.dispatchEvent() affected by preventDefault().");

test(function() {
    var event_type = "foo";
    var target = document.getElementById("target");
    var parent = document.getElementById("parent");
    var default_prevented;
    var return_value;

    parent.addEventListener(event_type, function(e) {}, true);
    target.addEventListener(event_type, function(e) {
        evt.returnValue = false;
        default_prevented = evt.defaultPrevented;
        return_value = evt.returnValue;
    }, true);
    target.addEventListener(event_type, function(e) {}, true);

    var evt = document.createEvent("Event");
    evt.initEvent(event_type, true, true);

    assert_true(parent.dispatchEvent(evt));
    assert_false(target.dispatchEvent(evt));
    assert_true(default_prevented);
    assert_false(return_value);
}, "Return value of EventTarget.dispatchEvent() affected by returnValue.");
