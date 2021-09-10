import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>DOM Test Reference</title>\n</head><body><p>You should see the word PASS below.</p>\n<div>PASS</div>\n</body></html>"
const document = loadDOM(html, `text/html`)
