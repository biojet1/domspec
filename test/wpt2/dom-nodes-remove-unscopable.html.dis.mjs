import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"testDiv\" onclick=\"result1 = remove; result2 = this.remove;\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var result1;
var result2;
var unscopables = [
    "before",
    "after",
    "replaceWith",
    "remove",
    "prepend",
    "append"
];
for (var i in unscopables) {
    var name = unscopables[i];
    window[name] = "Hello there";
    result1 = result2 = undefined;
    test(function () {
        assert_true(Element.prototype[Symbol.unscopables][name]);
        var div = document.querySelector('#testDiv');
        div.setAttribute(
            "onclick", "result1 = " + name + "; result2 = this." + name + ";");
        div.dispatchEvent(new Event("click"));
        assert_equals(typeof result1, "string");
        assert_equals(typeof result2, "function");
    }, name + "() should be unscopable");
}
