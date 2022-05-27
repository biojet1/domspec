import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><body><iframe id=\"i\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var doc = i.contentDocument;
i.remove();
doc.cloneNode();
