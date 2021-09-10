import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><script/>\n\n</head><body><div id=\"target\"/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  window.onload = function() {
    let target = document.querySelector(":target");
    let expected = document.querySelector("#target");
    window.parent.postMessage(target == expected ? "PASS" : "FAIL", "*");
  };
