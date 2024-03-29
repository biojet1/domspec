import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

// Regression test for crbug.com/1138487.
//
// It was possible for a non-ASCII-lowercase string to be used when inserting
// into the attribute collection if a hashtable encountered it during probing
// while looking for the ASCII-lowercase equivalent.
//
// This caused such a string to be illegally used as an attribute name, thus
// causing inconsistent behavior in future attribute lookup.
test(() => {
  const el = document.createElement('div');
  el.setAttribute('labelXQL', 'abc');
  el.setAttribute('_valueXQL', 'def');
  assert_equals(el.getAttribute('labelXQL'), 'abc');
  assert_equals(el.getAttribute('labelxql'), 'abc');
  assert_equals(el.getAttribute('_valueXQL'), 'def');
  assert_equals(el.getAttribute('_valuexql'), 'def');
}, "Attributes first seen in mixed ASCII case should not be corrupted.");
