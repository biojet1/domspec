import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html class=\"reftest-wait\">\n  <head>\n    <title>Adopting a shadow host child into an iframe</title>\n    <link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-node-adopt\"/>\n    <link rel=\"match\" href=\"remove-from-shadow-host-and-adopt-into-iframe-ref.html\"/>\n    <style>\n      iframe { border: 0; }\n    </style>\n    <script src=\"/common/reftest-wait.js\"/>\n    <script/>\n  </head>\n  <body>\n    <p>You should see the word PASS below.</p>\n    <iframe id=\"iframe\"/>\n    <div id=\"host\"><span id=\"adopted\">PASS</span></div>\n  </body>\n</html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/common/reftest-wait.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

      onload = () => {
        const root = host.attachShadow({mode:"open"});
        root.innerHTML = "<slot>";
        // force a layout
        host.offsetTop;
        iframe.contentWindow.document.body.style.margin = 0;
        iframe.contentWindow.document.body.appendChild(adopted);
        host.remove();
        takeScreenshot();
      }
    