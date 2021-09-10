import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<link rel=\"author\" href=\"mailto:masonf@chromium.org\"/>\n<link rel=\"help\" href=\"https://crbug.com/1210480\"/>\n<meta name=\"assert\" content=\"The renderer should not crash.\"/>\n\n</head><body><iframe id=\"iframe\"/>\n<select>Text Node\n  <option id=\"option\"/>\n</select>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  window.onload=function() {
    iframe.addEventListener('DOMNodeInsertedIntoDocument',function() {});
    option.remove();
    iframe.contentDocument.body.appendChild(document.body);
  }
