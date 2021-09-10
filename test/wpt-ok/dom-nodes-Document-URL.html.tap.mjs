import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.URL with redirect</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

async_test(function() {
  var iframe = document.createElement("iframe");
  iframe.src = "/common/redirect.py?location=/common/blank.html";
  document.body.appendChild(iframe);
  this.add_cleanup(function() { document.body.removeChild(iframe); });
  iframe.onload = this.step_func_done(function() {
    assert_equals(iframe.contentDocument.URL,
                  location.origin + "/common/blank.html");
  });
})
