import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html class=\"a A\">\n <head>\n  <title>document.getElementsByClassName(): case-insensitive (quirks mode)</title>\n  <link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-getelementsbyclassname\"/>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body class=\"a a\">\n  <div id=\"log\"/>\n  <div class=\"k\"/>\n  <div class=\"K\"/>\n  <div class=\"&#8490;\" id=\"kelvin\"/>\n  <script/>\n </body>\n</html>"
const document = loadDOM(html, `text/html`)

test(function() {
  assert_array_equals(document.getElementsByClassName("A a"),
                      [document.documentElement, document.body]);
})

test(function() {
  assert_array_equals(document.getElementsByClassName("\u212a"),
                      [document.getElementById("kelvin")]);
}, 'Unicode-case should be sensitive even in quirks mode.');
  