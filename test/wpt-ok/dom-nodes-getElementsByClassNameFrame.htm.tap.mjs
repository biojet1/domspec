import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html class=\"foo\">\n<head class=\"foo\">\n<meta charset=\"utf-8\"/>\n<title>getElementsByClassName</title>\n</head><body class=\"foo\">\n</body></html>"
const document = loadDOM(html, `text/html`)
