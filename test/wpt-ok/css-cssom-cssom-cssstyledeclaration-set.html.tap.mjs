import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n    <head>\n        <title>CSSOM: CSSStyleDeclaration on HTMLElement represents inline style changes</title>\n        <link rel=\"author\" title=\"Paul Irish\" href=\"mailto:paul.irish@gmail.com\"/>\n        <link rel=\"help\" href=\"http://www.w3.org/TR/cssom-1/#the-cssstyledeclaration-interface\"/>\n\n        <link rel=\"source\" href=\"http://trac.webkit.org/export/120528/trunk/LayoutTests/fast/css/cssText-cache.html\"/>\n        <meta name=\"flags\" content=\"dom\"/>\n\n        <script src=\"/resources/testharness.js\"/>\n        <script src=\"/resources/testharnessreport.js\"/>\n    </head>\n\n    <body>\n        <div id=\"log\"/>\n\n        <div id=\"box\"/>\n\n        <script/>\n\n\n    </body>\n</html>"
const document = loadDOM(html, `text/html`)


          var style = document.getElementById('box').style;

          test(function(){

            style.left = "10px";
            assert_equals(style.left, "10px", 'left property set on element\'s CSSStyleDeclaration Object');
            style.left = "20px";
            assert_equals(style.left, "20px", 'left property set on element\'s CSSStyleDeclaration Object');

          }, 'CSSStyleDeclaration on HTMLElement represents inline style changes');

        