import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><body><a name=\"c\">c</a></body></html>"
const document = loadDOM(html, `text/html`)
