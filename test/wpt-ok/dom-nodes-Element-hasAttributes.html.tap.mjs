import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body>\n\n<button/>\n<div id=\"foo\"/>\n<p data-foo=\"\"/>\n\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `text/html`)

test(function() {
    var buttonElement = document.getElementsByTagName('button')[0];
    assert_equals(buttonElement.hasAttributes(), false, 'hasAttributes() on empty element must return false.');

    var emptyDiv = document.createElement('div');
    assert_equals(emptyDiv.hasAttributes(), false, 'hasAttributes() on dynamically created empty element must return false.');

}, 'element.hasAttributes() must return false when the element does not have attribute.');

test(function() {
    var divWithId = document.getElementById('foo');
    assert_equals(divWithId.hasAttributes(), true, 'hasAttributes() on element with id attribute must return true.');

    var divWithClass = document.createElement('div');
    divWithClass.setAttribute('class', 'foo');
    assert_equals(divWithClass.hasAttributes(), true, 'hasAttributes() on dynamically created element with class attribute must return true.');

    var pWithCustomAttr = document.getElementsByTagName('p')[0];
    assert_equals(pWithCustomAttr.hasAttributes(), true, 'hasAttributes() on element with custom attribute must return true.');

    var divWithCustomAttr = document.createElement('div');
    divWithCustomAttr.setAttribute('data-custom', 'foo');
    assert_equals(divWithCustomAttr.hasAttributes(), true, 'hasAttributes() on dynamically created element with custom attribute must return true.');

}, 'element.hasAttributes() must return true when the element has attribute.');

