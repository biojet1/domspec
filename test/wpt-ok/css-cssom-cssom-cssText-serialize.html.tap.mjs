import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n    <head>\n        <title>CSSOM Parsing Test: getting cssText must return the result of serializing the CSS declaration blocks.</title>\n        <link rel=\"author\" title=\"Paul Irish\" href=\"mailto:paul.irish@gmail.com\"/>\n        <link rel=\"help\" href=\"http://www.w3.org/TR/cssom-1/#the-cssstyledeclaration-interface\"/>\n\n        <link rel=\"source\" href=\"http://trac.webkit.org/export/120528/trunk/LayoutTests/fast/css/cssText-cache.html\"/>\n        <meta name=\"flags\" content=\"dom\"/>\n\n        <script src=\"/resources/testharness.js\"/>\n        <script src=\"/resources/testharnessreport.js\"/>\n    </head>\n\n    <body>\n        <div id=\"log\"/>\n        <div id=\"box\"/>\n        <script/>\n    </body>\n</html>"
const document = loadDOM(html, `text/html`)

          test(function() {
            var style = document.getElementById('box').style;
            style.left = "10px";
            assert_equals(style.cssText, "left: 10px;");
            style.right = "20px";
            assert_equals(style.cssText, "left: 10px; right: 20px;");
          }, 'CSSStyleDeclaration cssText serializes declaration blocks.');
        