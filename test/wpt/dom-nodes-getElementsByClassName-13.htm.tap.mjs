import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html class=\"a\">\n <head>\n  <title>element.getElementsByClassName(): adding an element</title>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body class=\"a\">\n  <div id=\"log\"/>\n  <script/>\n </body>\n</html>"
const document = loadDOM(html, `text/html`)
test(function() {
                 var collection = document.body.getElementsByClassName("a");
                 var ele = document.createElement("x-y-z");
                 ele.className = "a";
                 document.body.appendChild(ele);
                 assert_array_equals(collection, [ele]);
               })
  