import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head>\n<title>Setting cancelBubble=true prior to dispatchEvent()</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<div id=\"log\"/>\n\n<table id=\"table\" border=\"1\" style=\"display: none\">\n    <tbody id=\"table-body\">\n    <tr id=\"table-row\">\n        <td id=\"table-cell\">Shady Grove</td>\n        <td>Aeolian</td>\n    </tr>\n    <tr id=\"parent\">\n        <td id=\"target\">Over the river, Charlie</td>\n        <td>Dorian</td>\n    </tr>\n    </tbody>\n</table>\n\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `text/html`)

test(function() {
    var event = "foo";
    var target = document.getElementById("target");
    var parent = document.getElementById("parent");
    var tbody = document.getElementById("table-body");
    var table = document.getElementById("table");
    var body = document.body;
    var html = document.documentElement;
    var current_targets = [window, document, html, body, table, tbody, parent, target];
    var expected_targets = [];
    var actual_targets = [];
    var expected_phases = [];
    var actual_phases = [];

    var test_event = function(evt) {
        actual_targets.push(evt.currentTarget);
        actual_phases.push(evt.eventPhase);
    };

    for (var i = 0; i < current_targets.length; ++i) {
        current_targets[i].addEventListener(event, test_event, true);
        current_targets[i].addEventListener(event, test_event, false);
    }

    var evt = document.createEvent("Event");
    evt.initEvent(event, true, true);
    evt.cancelBubble = true;
    target.dispatchEvent(evt);

    assert_array_equals(actual_targets, expected_targets, "actual_targets");
    assert_array_equals(actual_phases, expected_phases, "actual_phases");
});
