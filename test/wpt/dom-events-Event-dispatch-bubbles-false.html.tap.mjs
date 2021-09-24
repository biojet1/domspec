import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title> Event.bubbles attribute is set to false </title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-event-initevent\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-event-dispatch\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<table id=\"table\" border=\"1\" style=\"display: none\">\n    <tbody id=\"table-body\">\n    <tr id=\"table-row\">\n        <td id=\"table-cell\">Shady Grove</td>\n        <td>Aeolian</td>\n    </tr>\n    <tr id=\"parent\">\n        <td id=\"target\">Over the river, Charlie</td>\n        <td>Dorian</td>\n    </tr>\n    </tbody>\n</table>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function targetsForDocumentChain(document) {
    return [
        document,
        document.documentElement,
        document.getElementsByTagName("body")[0],
        document.getElementById("table"),
        document.getElementById("table-body"),
        document.getElementById("parent")
    ];
}

function testChain(document, targetParents, phases, event_type) {
    var target = document.getElementById("target");
    var targets = targetParents.concat(target);
    var expected_targets = targets.concat(target);

    var actual_targets = [], actual_phases = [];
    var test_event = function(evt) {
        actual_targets.push(evt.currentTarget);
        actual_phases.push(evt.eventPhase);
    }

    for (var i = 0; i < targets.length; i++) {
        targets[i].addEventListener(event_type, test_event, true);
        targets[i].addEventListener(event_type, test_event, false);
    }

    var evt = document.createEvent("Event");
    evt.initEvent(event_type, false, true);

    target.dispatchEvent(evt);

    assert_array_equals(actual_targets, expected_targets, "targets");
    assert_array_equals(actual_phases, phases, "phases");
}

var phasesForDocumentChain = [
    Event.CAPTURING_PHASE,
    Event.CAPTURING_PHASE,
    Event.CAPTURING_PHASE,
    Event.CAPTURING_PHASE,
    Event.CAPTURING_PHASE,
    Event.CAPTURING_PHASE,
    Event.AT_TARGET,
    Event.AT_TARGET,
];

test(function () {
    var chainWithWindow = [window].concat(targetsForDocumentChain(document));
    testChain(
        document, chainWithWindow, [Event.CAPTURING_PHASE].concat(phasesForDocumentChain), "click");
}, "In window.document with click event");

test(function () {
    testChain(document, targetsForDocumentChain(document), phasesForDocumentChain, "load");
}, "In window.document with load event")

test(function () {
    var documentClone = document.cloneNode(true);
    testChain(
        documentClone, targetsForDocumentChain(documentClone), phasesForDocumentChain, "click");
}, "In window.document.cloneNode(true)");

test(function () {
    var newDocument = new Document();
    newDocument.appendChild(document.documentElement.cloneNode(true));
    testChain(
        newDocument, targetsForDocumentChain(newDocument), phasesForDocumentChain, "click");
}, "In new Document()");

test(function () {
    var HTMLDocument = document.implementation.createHTMLDocument();
    HTMLDocument.body.appendChild(document.getElementById("table").cloneNode(true));
    testChain(
        HTMLDocument, targetsForDocumentChain(HTMLDocument), phasesForDocumentChain, "click");
}, "In DOMImplementation.createHTMLDocument()");
