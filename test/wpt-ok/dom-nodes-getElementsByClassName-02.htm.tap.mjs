import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html class=\"a&#10;b\">\n <head>\n  <title>document.getElementsByClassName(): also simple</title>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body class=\"a&#10;\">\n  <div id=\"log\"/>\n  <script/>\n </body>\n</html>"
const document = loadDOM(html, `text/html`)
 test(function() {assert_array_equals(document.getElementsByClassName("a\n"), [document.documentElement, document.body])}) 