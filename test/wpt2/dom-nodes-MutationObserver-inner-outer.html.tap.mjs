import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObservers: innerHTML, outerHTML mutations</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"mutationobservers.js\"/>\n</head><body><h1>MutationObservers: innerHTML, outerHTML mutations</h1>\n<div id=\"log\"/>\n\n<section style=\"display: none\">\n\n<p id=\"n00\">old text</p>\n\n<p id=\"n01\">old text</p>\n\n<div id=\"n02\"><p>old text</p></div>\n</section>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/mutationobservers.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

  var n00;
  var n00oldText;
  var n01;
  var n01oldText;
  var n02;

  setup(function() {
    n00 = document.getElementById('n00');
    n00oldText = n00.firstChild;
    n01 = document.getElementById('n01');
    n01oldText = n01.firstChild;
    n02 = document.getElementById('n02');
  })

  runMutationTest(n00,
                  {childList:true,attributes:true},
                  [{type: "childList",
                    removedNodes: [n00oldText],
                    addedNodes: function() {
                      return [document.getElementById("n00").firstChild];
                    }},
                    {type: "attributes", attributeName: "class"}],
                  function() { n00.innerHTML = "new text"; n00.className = "c01"},
                  "innerHTML mutation");

  runMutationTest(n01,
                  {childList:true},
                  [{type: "childList",
                    removedNodes: [n01oldText],
                    addedNodes: function() {
                      return [document.getElementById("n01").firstChild,
                              document.getElementById("n01").lastChild];
                    }}],
                  function() { n01.innerHTML = "<span>new</span><span>text</span>"; },
                  "innerHTML with 2 children mutation");

  runMutationTest(n02,
                  {childList:true},
                  [{type: "childList",
                    removedNodes: [n02.firstChild],
                    addedNodes: function() {
                      return [n02.firstChild];
                    }}],
                  function() { n02.firstChild.outerHTML = "<p>next text</p>"; },
                  "outerHTML mutation");
