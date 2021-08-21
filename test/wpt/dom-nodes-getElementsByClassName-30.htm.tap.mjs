import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head class=\"foo\">\n        <title class=\"foo\">getElementsByClassName</title>\n        <meta class=\"foo\" content=\"big element listing\" name=\"description\"/>\n        <link class=\"foo\"/>\n        <base class=\"foo\"/>\n        <script class=\"foo\"/>\n        <style class=\"foo\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n    <link href=\"https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname\" rel=\"help\"/>\n</head>\n    <body class=\"foo\">\n    <div id=\"log\"/>\n        <a class=\"foo\">a</a>\n        <abbr class=\"foo\">abbr</abbr>\n        <acronym class=\"foo\">acronym</acronym>\n        <address class=\"foo\">address</address>\n        <applet class=\"foo\">applet</applet>\n        <b class=\"foo\">b</b>\n        <bdo class=\"foo\">bdo</bdo>\n        <big class=\"foo\">big</big>\n        <blockquote class=\"foo\">blockquote</blockquote>\n        <br class=\"foo\"/>\n        <button class=\"foo\">button</button>\n        <center class=\"foo\">center</center>\n        <cite class=\"foo\">cite</cite>\n        <code class=\"foo\">code</code>\n        <del class=\"foo\">del</del>\n        <dfn class=\"foo\">dfn</dfn>\n        <dir class=\"foo\">dir\n            <li class=\"foo\">li</li>\n        </dir>\n        <div class=\"foo\">div</div>\n        <dl class=\"foo\">\n            <dt class=\"foo\">\n                </dt><dd class=\"foo\">dd</dd>\n        </dl>\n        <em class=\"foo\">em</em>\n        <font class=\"foo\">font</font>\n        <form class=\"foo\">\n            <label class=\"foo\">label</label>\n            <fieldset class=\"foo\">\n                <legend class=\"foo\">legend</legend>\n            </fieldset>\n        </form>\n        <h1 class=\"foo\">h1</h1>\n        <hr class=\"foo\"/>\n        <i class=\"foo\">i</i>\n        <iframe class=\"foo\">iframe</iframe>\n        <img class=\"foo\"/>\n        <input class=\"foo\"/>\n        <ins class=\"foo\">ins</ins>\n        <kbd class=\"foo\">kbd</kbd>\n        <map class=\"foo\">\n            <area class=\"foo\"/>\n        </map>\n        <menu class=\"foo\">menu</menu>\n        <noscript class=\"foo\">noscript</noscript>\n        <object class=\"foo\">\n            <param class=\"foo\"/>\n        </object>\n        <ol class=\"foo\">ol</ol>\n        <p class=\"foo\">p</p>\n        <pre class=\"foo\">pre</pre>\n        <q class=\"foo\">q</q>\n        <s class=\"foo\">s</s>\n        <samp class=\"foo\">samp</samp>\n        <select class=\"foo\">\n            <optgroup class=\"foo\">optgroup</optgroup>\n            <option class=\"foo\">option</option>\n        </select>\n        <small class=\"foo\">small</small>\n        <span class=\"foo\">span</span>\n        <strike class=\"foo\">strike</strike>\n        <strong class=\"foo\">strong</strong>\n        <sub class=\"foo\">sub</sub>\n        <sup class=\"foo\">sup</sup>\n        colgroup<table class=\"foo\">\n            <caption class=\"foo\">caption</caption>\n            <colgroup><col class=\"foo\"/>\n            </colgroup><colgroup class=\"foo\"/>\n            <thead class=\"foo\">\n                <tr><th class=\"foo\">th</th>\n            </tr></thead>\n            <tbody class=\"foo\">\n                <tr class=\"foo\">\n                    <td class=\"foo\">td</td>\n                </tr>\n            </tbody>\n            <tfoot class=\"foo\"/>\n        </table>\n        <textarea class=\"foo\">textarea</textarea>\n        <tt class=\"foo\">tt</tt>\n        <u class=\"foo\">u</u>\n        <ul class=\"foo\">ul</ul>\n        <var class=\"foo\">var</var>\n        <script type=\"text/javascript\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)

    test(function ()
          {
           var arrElements = [
                "HEAD",
                "TITLE",
                "META",
                "LINK",
                "BASE",
                "SCRIPT",
                "STYLE",
                "BODY",
                "A",
                "ABBR",
                "ACRONYM",
                "ADDRESS",
                "APPLET",
                "B",
                "BDO",
                "BIG",
                "BLOCKQUOTE",
                "BR",
                "BUTTON",
                "CENTER",
                "CITE",
                "CODE",
                "DEL",
                "DFN",
                "DIR",
                "LI",
                "DIV",
                "DL",
                "DT",
                "DD",
                "EM",
                "FONT",
                "FORM",
                "LABEL",
                "FIELDSET",
                "LEGEND",
                "H1",
                "HR",
                "I",
                "IFRAME",
                "IMG",
                "INPUT",
                "INS",
                "KBD",
                "MAP",
                "AREA",
                "MENU",
                "NOSCRIPT",
                "OBJECT",
                "PARAM",
                "OL",
                "P",
                "PRE",
                "Q",
                "S",
                "SAMP",
                "SELECT",
                "OPTGROUP",
                "OPTION",
                "SMALL",
                "SPAN",
                "STRIKE",
                "STRONG",
                "SUB",
                "SUP",
                "TABLE",
                "CAPTION",
                "COL",
                "COLGROUP",
                "THEAD",
                "TH",
                "TBODY",
                "TR",
                "TD",
                "TFOOT",
                "TEXTAREA",
                "TT",
                "U",
                "UL",
                "VAR"];

                var collection = document.getElementsByClassName("foo");
                for (var x = 0; x < collection.length; x++)
                {
                    assert_equals(collection[x].nodeName, arrElements[x]);
                }
}, "big element listing");
        