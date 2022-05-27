import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n</head><body><iframe/>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  let test = async_test('document.querySelector(":target") must work when called in the window.load event');
  let iframe = document.querySelector("iframe");
  window.addEventListener("message", test.step_func_done(event => {
    assert_equals(event.data, "PASS");
  }));
  iframe.src = "./query-target-in-load-event.part.html#target";
