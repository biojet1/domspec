import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n  <head>\n    <meta charset=\"utf-8\"/>\n    <title>Element Reflection for aria-activedescendant and aria-errormessage</title>\n    <link rel=\"help\" href=\"https://wicg.github.io/aom/spec/aria-reflection.html\"/>\n    <link rel=\"author\" title=\"Meredith Lane\" href=\"meredithl@chromium.org\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n  </head>\n<body><div id=\"role\" role=\"button\"/>\n\n<script/>\n\n<div id=\"atomic\" aria-atomic=\"true\"/>\n\n<script/>\n\n<div id=\"autocomplete\" aria-autocomplete=\"list\"/>\n\n<script/>\n\n<div id=\"busy\" aria-busy=\"true\"/>\n\n<script/>\n\n<div id=\"checked\" aria-checked=\"mixed\"/>\n\n<script/>\n\n<div id=\"colcount\" aria-colcount=\"5\"/>\n\n<script/>\n\n<div id=\"colindex\" aria-colindex=\"1\"/>\n\n<script/>\n\n<div id=\"colspan\" aria-colspan=\"2\"/>\n\n<script/>\n\n<div id=\"current\" aria-current=\"page\"/>\n\n<script/>\n\n<div id=\"disabled\" aria-disabled=\"true\"/>\n\n<div id=\"description\" aria-description=\"cold as ice\"/>\n\n<script/>\n\n<script/>\n\n<div id=\"expanded\" aria-expanded=\"true\"/>\n\n<script/>\n\n<div id=\"haspopup\" aria-haspopup=\"menu\"/>\n\n<script/>\n\n<div id=\"hidden\" aria-hidden=\"true\" tabindex=\"-1\"/>\n\n<script/>\n\n<div id=\"keyshortcuts\" aria-keyshortcuts=\"x\"/>\n\n<script/>\n\n<div id=\"label\" aria-label=\"x\"/>\n\n<script/>\n\n<div id=\"level\" aria-level=\"1\"/>\n\n<script/>\n\n<div id=\"live\" aria-live=\"polite\"/>\n\n<script/>\n\n<div id=\"modal\" aria-modal=\"true\"/>\n\n<script/>\n\n<div id=\"multiline\" aria-multiline=\"true\"/>\n\n<script/>\n\n<div id=\"multiselectable\" aria-multiselectable=\"true\"/>\n\n<script/>\n\n<div id=\"orientation\" aria-orientation=\"vertical\"/>\n\n<script/>\n\n<div id=\"placeholder\" aria-placeholder=\"x\"/>\n\n<script/>\n\n<div id=\"posinset\" aria-posinset=\"10\"/>\n\n<script/>\n\n<button id=\"pressed\" aria-pressed=\"true\"/>\n\n<script/>\n\n<div id=\"readonly\" aria-readonly=\"true\"/>\n\n<script/>\n\n<div id=\"relevant\" aria-relevant=\"text\"/>\n\n<script/>\n\n<div id=\"required\" aria-required=\"true\"/>\n\n<script/>\n\n<div id=\"roledescription\" aria-roledescription=\"x\"/>\n\n<script/>\n\n<div id=\"rowcount\" aria-rowcount=\"10\"/>\n\n<script/>\n\n<div id=\"rowindex\" aria-rowindex=\"1\"/>\n\n<script/>\n\n<div id=\"rowspan\" aria-rowspan=\"2\"/>\n\n<script/>\n\n<div id=\"selected\" aria-selected=\"true\"/>\n\n<script/>\n\n<div id=\"setsize\" aria-setsize=\"10\"/>\n\n<script/>\n\n<div id=\"sort\" aria-sort=\"descending\"/>\n\n<script/>\n\n<div id=\"valuemax\" aria-valuemax=\"99\"/>\n\n<script/>\n\n<div id=\"valuemin\" aria-valuemin=\"3\"/>\n\n<script/>\n\n<div id=\"valuenow\" aria-valuenow=\"50\"/>\n\n<script/>\n\n<div id=\"valuetext\" aria-valuetext=\"50%\"/>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

test(function(t) {
    var element = document.getElementById("role");
    assert_equals(element.role, "button");
    element.role = "checkbox";
    assert_equals(element.getAttribute("role"), "checkbox");
}, "role attribute reflects.");


test(function(t) {
    var element = document.getElementById("atomic");
    assert_equals(element.ariaAtomic, "true");
    element.ariaAtomic = "false";
    assert_equals(element.getAttribute("aria-atomic"), "false");
}, "aria-atomic attribute reflects.");


test(function(t) {
    var element = document.getElementById("autocomplete");
    assert_equals(element.ariaAutoComplete, "list");
    element.ariaAutoComplete = "inline";
    assert_equals(element.getAttribute("aria-autocomplete"), "inline");
}, "aria-autocomplete attribute reflects.");


test(function(t) {
    var element = document.getElementById("busy");
    assert_equals(element.ariaBusy, "true");
    element.ariaBusy = "false";
    assert_equals(element.getAttribute("aria-busy"), "false");
}, "aria-busy attribute reflects.");


test(function(t) {
    var element = document.getElementById("checked");
    assert_equals(element.ariaChecked, "mixed");
    element.ariaChecked = "true";
    assert_equals(element.getAttribute("aria-checked"), "true");
}, "aria-checked attribute reflects.");


test(function(t) {
    var element = document.getElementById("colcount");
    assert_equals(element.ariaColCount, "5");
    element.ariaColCount = "6";
    assert_equals(element.getAttribute("aria-colcount"), "6");
}, "aria-colcount attribute reflects.");


test(function(t) {
    var element = document.getElementById("colindex");
    assert_equals(element.ariaColIndex, "1");
    element.ariaColIndex = "2";
    assert_equals(element.getAttribute("aria-colindex"), "2");
}, "aria-colindex attribute reflects.");


test(function(t) {
    var element = document.getElementById("colspan");
    assert_equals(element.ariaColSpan, "2");
    element.ariaColSpan = "3";
    assert_equals(element.getAttribute("aria-colspan"), "3");
}, "aria-colspan attribute reflects.");


test(function(t) {
    var element = document.getElementById("current");
    assert_equals(element.ariaCurrent, "page");
    element.ariaCurrent = "step";
    assert_equals(element.getAttribute("aria-current"), "step");
}, "aria-current attribute reflects.");


test(function(t) {
    var element = document.getElementById("description");
    assert_equals(element.ariaDescription, "cold as ice");
    element.ariaDescription = "hot as fire";
    assert_equals(element.getAttribute("aria-description"), "hot as fire");
}, "aria-description attribute reflects.");


test(function(t) {
    var element = document.getElementById("disabled");
    assert_equals(element.ariaDisabled, "true");
    element.ariaDisabled = "false";
    assert_equals(element.getAttribute("aria-disabled"), "false");
}, "aria-disabled attribute reflects.");


test(function(t) {
    var element = document.getElementById("expanded");
    assert_equals(element.ariaExpanded, "true");
    element.ariaExpanded = "false";
    assert_equals(element.getAttribute("aria-expanded"), "false");
}, "aria-expanded attribute reflects.");


test(function(t) {
    var element = document.getElementById("haspopup");
    assert_equals(element.ariaHasPopup, "menu");
    element.ariaHasPopup = "listbox";
    assert_equals(element.getAttribute("aria-haspopup"), "listbox");
}, "aria-haspopup attribute reflects.");


test(function(t) {
    var element = document.getElementById("hidden");
    assert_equals(element.ariaHidden, "true");
    element.ariaHidden = "false";
    assert_equals(element.getAttribute("aria-hidden"), "false");
}, "aria-hidden attribute reflects.");


test(function(t) {
    var element = document.getElementById("keyshortcuts");
    assert_equals(element.ariaKeyShortcuts, "x");
    element.ariaKeyShortcuts = "y";
    assert_equals(element.getAttribute("aria-keyshortcuts"), "y");
}, "aria-keyshortcuts attribute reflects.");


test(function(t) {
    var element = document.getElementById("label");
    assert_equals(element.ariaLabel, "x");
    element.ariaLabel = "y";
    assert_equals(element.getAttribute("aria-label"), "y");
}, "aria-label attribute reflects.");


test(function(t) {
    var element = document.getElementById("level");
    assert_equals(element.ariaLevel, "1");
    element.ariaLevel = "2";
    assert_equals(element.getAttribute("aria-level"), "2");
}, "aria-level attribute reflects.");


test(function(t) {
    var element = document.getElementById("live");
    assert_equals(element.ariaLive, "polite");
    element.ariaLive = "assertive";
    assert_equals(element.getAttribute("aria-live"), "assertive");
}, "aria-live attribute reflects.");


test(function(t) {
    var element = document.getElementById("modal");
    assert_equals(element.ariaModal, "true");
    element.ariaModal = "false";
    assert_equals(element.getAttribute("aria-modal"), "false");
}, "aria-modal attribute reflects.");


test(function(t) {
    var element = document.getElementById("multiline");
    assert_equals(element.ariaMultiLine, "true");
    element.ariaMultiLine = "false";
    assert_equals(element.getAttribute("aria-multiline"), "false");
}, "aria-multiline attribute reflects.");


test(function(t) {
    var element = document.getElementById("multiselectable");
    assert_equals(element.ariaMultiSelectable, "true");
    element.ariaMultiSelectable = "false";
    assert_equals(element.getAttribute("aria-multiselectable"), "false");
}, "aria-multiselectable attribute reflects.");


test(function(t) {
    var element = document.getElementById("orientation");
    assert_equals(element.ariaOrientation, "vertical");
    element.ariaOrientation = "horizontal";
    assert_equals(element.getAttribute("aria-orientation"), "horizontal");
}, "aria-orientation attribute reflects.");


test(function(t) {
    var element = document.getElementById("placeholder");
    assert_equals(element.ariaPlaceholder, "x");
    element.ariaPlaceholder = "y";
    assert_equals(element.getAttribute("aria-placeholder"), "y");
}, "aria-placeholder attribute reflects.");


test(function(t) {
    var element = document.getElementById("posinset");
    assert_equals(element.ariaPosInSet, "10");
    element.ariaPosInSet = "11";
    assert_equals(element.getAttribute("aria-posinset"), "11");
}, "aria-posinset attribute reflects.");


test(function(t) {
    var element = document.getElementById("pressed");
    assert_equals(element.ariaPressed, "true");
    element.ariaPressed = "false";
    assert_equals(element.getAttribute("aria-pressed"), "false");
}, "aria-pressed attribute reflects.");


test(function(t) {
    var element = document.getElementById("readonly");
    assert_equals(element.ariaReadOnly, "true");
    element.ariaReadOnly = "false";
    assert_equals(element.getAttribute("aria-readonly"), "false");
}, "aria-readonly attribute reflects.");


test(function(t) {
    var element = document.getElementById("relevant");
    assert_equals(element.ariaRelevant, "text");
    element.ariaRelevant = "removals";
    assert_equals(element.getAttribute("aria-relevant"), "removals");
}, "aria-relevant attribute reflects.");


test(function(t) {
    var element = document.getElementById("required");
    assert_equals(element.ariaRequired, "true");
    element.ariaRequired = "false";
    assert_equals(element.getAttribute("aria-required"), "false");
}, "aria-required attribute reflects.");


test(function(t) {
    var element = document.getElementById("roledescription");
    assert_equals(element.ariaRoleDescription, "x");
    element.ariaRoleDescription = "y";
    assert_equals(element.getAttribute("aria-roledescription"), "y");
}, "aria-roledescription attribute reflects.");


test(function(t) {
    var element = document.getElementById("rowcount");
    assert_equals(element.ariaRowCount, "10");
    element.ariaRowCount = "11";
    assert_equals(element.getAttribute("aria-rowcount"), "11");
}, "aria-rowcount attribute reflects.");


test(function(t) {
    var element = document.getElementById("rowindex");
    assert_equals(element.ariaRowIndex, "1");
    element.ariaRowIndex = "2";
    assert_equals(element.getAttribute("aria-rowindex"), "2");
}, "aria-rowindex attribute reflects.");


test(function(t) {
    var element = document.getElementById("rowspan");
    assert_equals(element.ariaRowSpan, "2");
    element.ariaRowSpan = "3";
    assert_equals(element.getAttribute("aria-rowspan"), "3");
}, "aria-rowspan attribute reflects.");


test(function(t) {
    var element = document.getElementById("selected");
    assert_equals(element.ariaSelected, "true");
    element.ariaSelected = "false";
    assert_equals(element.getAttribute("aria-selected"), "false");
}, "aria-selected attribute reflects.");


test(function(t) {
    var element = document.getElementById("setsize");
    assert_equals(element.ariaSetSize, "10");
    element.ariaSetSize = "11";
    assert_equals(element.getAttribute("aria-setsize"), "11");
}, "aria-setsize attribute reflects.");


test(function(t) {
    var element = document.getElementById("sort");
    assert_equals(element.ariaSort, "descending");
    element.ariaSort = "ascending";
    assert_equals(element.getAttribute("aria-sort"), "ascending");
}, "aria-sort attribute reflects.");


test(function(t) {
    var element = document.getElementById("valuemax");
    assert_equals(element.ariaValueMax, "99");
    element.ariaValueMax = "100";
    assert_equals(element.getAttribute("aria-valuemax"), "100");
}, "aria-valuemax attribute reflects.");


test(function(t) {
    var element = document.getElementById("valuemin");
    assert_equals(element.ariaValueMin, "3");
    element.ariaValueMin = "2";
    assert_equals(element.getAttribute("aria-valuemin"), "2");
}, "aria-valuemin attribute reflects.");


test(function(t) {
    var element = document.getElementById("valuenow");
    assert_equals(element.ariaValueNow, "50");
    element.ariaValueNow = "51";
    assert_equals(element.getAttribute("aria-valuenow"), "51");
}, "aria-valuenow attribute reflects.");


test(function(t) {
    var element = document.getElementById("valuetext");
    assert_equals(element.ariaValueText, "50%");
    element.ariaValueText = "51%";
    assert_equals(element.getAttribute("aria-valuetext"), "51%");
}, "aria-valuetext attribute reflects.");
