import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:g=\"http://www.w3.org/2000/svg\">\n <head>\n  <title>document.getElementsByClassName(): compound</title>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body>\n  <div id=\"log\"/>\n  <div id=\"tests\">\n    <x class=\"a\"/>\n    <g:x class=\"a\"/>\n  </div>\n  <script/>\n </body>\n</html>"
const document = loadDOM(html, `application/xml`)
test(function() {
                 assert_array_equals(document.getElementsByClassName("a"),
                                     document.getElementById("tests").children);
               })
  