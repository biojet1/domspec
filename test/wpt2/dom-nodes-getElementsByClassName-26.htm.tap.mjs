import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head>\n        <title>getElementsByClassName</title>\n        <meta content=\"multiple class attributes\" name=\"description\"/>\n    <link href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\" rel=\"help\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n</head>\n    <body>\n       <div id=\"log\"/>\n         <div class=\"te xt\">\n            te xt\n            <div class=\"te\">\n                te; xt\n                <a class=\"text link\" href=\"#foo\">test link #foo</a>\n            </div>\n            <b class=\"text\">text</b>\n        </div>\n        <div class=\"xt te\">xt te</div>\n         <script type=\"text/javascript\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)

            test(function()
            {
                var collection = document.getElementsByClassName("te xt");

                assert_equals(collection.length, 2);
                assert_equals(collection[0].parentNode.nodeName, "BODY");
                assert_equals(collection[1].parentNode.nodeName, "BODY");
            }, "multiple class attributes");
        