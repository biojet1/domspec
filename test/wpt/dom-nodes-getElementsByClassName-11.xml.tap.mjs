import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:g=\"http://www.w3.org/2000/svg\" xmlns:h=\"http://www.w3.org/1999/xhtml\" xmlns:t=\"http://tc.labs.opera.com/#test\">\n <head>\n  <title>document.getElementsByClassName(): \"tricky\" compound</title>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body>\n  <div id=\"log\"/>\n  <div id=\"tests\">\n    <x class=\"a\"/>\n    <g:x class=\"a\"/>\n    <x t:class=\"a\" h:class=\"a\" g:class=\"a\"/>\n    <g:x t:class=\"a\" h:class=\"a\" g:class=\"a\"/>\n    <t:x class=\"a\" t:class=\"a\" h:class=\"a\" g:class=\"a\"/>\n  </div>\n  <script/>\n </body>\n</html>"
const document = loadDOM(html, `application/xml`)

   test(function() {
          var collection = document.getElementsByClassName("a");
          var test = document.getElementById("tests").children;
          assert_array_equals(collection, [test[0], test[1], test[4]]);
         })
  