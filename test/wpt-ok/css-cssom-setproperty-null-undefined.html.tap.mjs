import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head>\n<link rel=\"help\" href=\"https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head>\n<body>\n<script/>\n</body>\n</html>"
const document = loadDOM(html, `text/html`)

var style = document.body.style;

test(function() {
    style.color = 'white';

    assert_equals(style.color, 'white');
    style.setProperty('color', undefined);
    assert_equals(style.color, 'white');
}, "Verify that setting a CSS property to undefined has no effect.");

test(function() {
    style.color = 'white';

    assert_equals(style.color, 'white');
    assert_equals(style.getPropertyPriority('color'), '');
    style.setProperty('color', 'red', undefined);
    assert_equals(style.color, 'red');
    assert_equals(style.getPropertyPriority('color'), '');
}, "Verify that setting a CSS property priority to undefined is accepted.");

test(function() {
    style.color = 'white';

    assert_equals(style.color, 'white');
    style.setProperty('color', null);
    assert_equals(style.color, '');
}, "Verify that setting a CSS property to null is treated like empty string.");

test(function() {
    style.color = 'white';

    assert_equals(style.color, 'white');
    style.setProperty('color', 'red', null);
    assert_equals(style.color, 'red');
}, "Verify that setting a CSS property priority to null is treated like empty string.");
