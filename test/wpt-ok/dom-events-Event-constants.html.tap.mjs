import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>Event constants</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"../constants.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/constants.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

var objects;
setup(function() {
  objects = [
    [Event, "Event interface object"],
    [Event.prototype, "Event prototype object"],
    [document.createEvent("Event"), "Event object"],
    [document.createEvent("CustomEvent"), "CustomEvent object"]
  ]
})
testConstants(objects, [
  ["NONE", 0],
  ["CAPTURING_PHASE", 1],
  ["AT_TARGET", 2],
  ["BUBBLING_PHASE", 3]
], "eventPhase")
