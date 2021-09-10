import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>MutationObserver: callback arguments</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#notify-mutation-observers\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"mo-target\"/>\n<div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

"use strict";

async_test(t => {
  const moTarget = document.querySelector("#mo-target");
  const mo = new MutationObserver(function(records, observer) {
    t.step(() => {
      assert_equals(this, mo);
      assert_equals(arguments.length, 2);
      assert_true(Array.isArray(records));
      assert_equals(records.length, 1);
      assert_true(records[0] instanceof MutationRecord);
      assert_equals(observer, mo);

      mo.disconnect();
      t.done();
    });
  });

  mo.observe(moTarget, {attributes: true});
  moTarget.className = "trigger-mutation";
}, "Callback is invoked with |this| value of MutationObserver and two arguments");
