import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n<head><meta charset=\"utf-8\"/>\n<title>Node.prototype.getElementsByClassName with no real class names</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><span class=\"\">LINE TABULATION</span>\n<span class=\"&#133;\">NEXT LINE</span>\n<span class=\"&#160;\">NO-BREAK SPACE</span>\n<span class=\"&#5760;\">OGHAM SPACE MARK</span>\n<span class=\"&#8192;\">EN QUAD</span>\n<span class=\"&#8193;\">EM QUAD</span>\n<span class=\"&#8194;\">EN SPACE</span>\n<span class=\"&#8195;\">EM SPACE</span>\n<span class=\"&#8196;\">THREE-PER-EM SPACE</span>\n<span class=\"&#8197;\">FOUR-PER-EM SPACE</span>\n<span class=\"&#8198;\">SIX-PER-EM SPACE</span>\n<span class=\"&#8199;\">FIGURE SPACE</span>\n<span class=\"&#8200;\">PUNCTUATION SPACE</span>\n<span class=\"&#8201;\">THIN SPACE</span>\n<span class=\"&#8202;\">HAIR SPACE</span>\n<span class=\"&#8232;\">LINE SEPARATOR</span>\n<span class=\"&#8233;\">PARAGRAPH SEPARATOR</span>\n<span class=\"&#8239;\">NARROW NO-BREAK SPACE</span>\n<span class=\"&#8287;\">MEDIUM MATHEMATICAL SPACE</span>\n<span class=\"&#12288;\">IDEOGRAPHIC SPACE</span>\n\n<span class=\"&#6158;\">MONGOLIAN VOWEL SEPARATOR</span>\n<span class=\"&#8203;\">ZERO WIDTH SPACE</span>\n<span class=\"&#8204;\">ZERO WIDTH NON-JOINER</span>\n<span class=\"&#8205;\">ZERO WIDTH JOINER</span>\n<span class=\"&#8288;\">WORD JOINER</span>\n<span class=\"&#65279;\">ZERO WIDTH NON-BREAKING SPACE</span>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

const spans = document.querySelectorAll("span");

for (const span of spans) {
  test(() => {
    const className = span.getAttribute("class");
    assert_equals(className.length, 1, "Sanity check: the class name was retrieved and is a single character");
    const shouldBeSpan = document.getElementsByClassName(className);
    assert_array_equals(shouldBeSpan, [span]);
  }, `Passing a ${span.textContent} to getElementsByClassName still finds the span`);
}
