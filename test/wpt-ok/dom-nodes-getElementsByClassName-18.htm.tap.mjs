import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html class=\"a,b\">\n <head>\n  <title>element.getElementsByClassName(array): \"a\", \"b\"</title>\n  <script src=\"/resources/testharness.js\"/>\n  <script src=\"/resources/testharnessreport.js\"/>\n </head>\n <body class=\"a,b x\">\n  <div id=\"log\"/>\n  <p id=\"r\" class=\"a,bx\"/>\n  <script class=\"xa,b\"/>\n </body>\n</html>"
const document = loadDOM(html, `text/html`)
test(function() {
                             assert_array_equals(document.documentElement.getElementsByClassName(["\fa","b\n"]),
                                                 [document.body])
                            })
  