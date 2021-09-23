import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head>\n        <meta charset=\"utf-8\"/>\n        <title>getElementsByClassName</title>\n        <meta content=\"handle unicode chars\" name=\"description\"/>\n    <link href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\" rel=\"help\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n</head>\n    <body>\n        <div id=\"log\"/>\n        <div>\n            <div>\n                <a class=\"&#916;&#1049;&#12354;&#21494;&#33865; &#47568; link\" href=\"#foo\">&#916;&#1049;&#12354;&#21494;&#33865; &#47568; link</a>\n            </div>\n            <b class=\"text\">text</b>\n        </div>\n        <div class=\"&#916;&#1049;&#12354;&#21494;&#33865; &#1511;&#1605;\">&#916;&#1049;&#12354;&#21494;&#33865; &#1511;&#1605;</div>\n\n        <script type=\"text/javascript\"/>\n\n</body></html>"
const document = loadDOM(html, `text/html`)

            test(function()
            {
                var collection = document.getElementsByClassName("ΔЙあ叶葉");
                assert_equals(collection.length, 2);
                assert_equals(collection[0].parentNode.nodeName, "DIV");
                assert_equals(collection[1].parentNode.nodeName, "BODY");
            }, "handle unicode chars");
        