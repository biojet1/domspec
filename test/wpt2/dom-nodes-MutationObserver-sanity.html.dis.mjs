import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

  test(() => {
      var m = new MutationObserver(() => {});
      assert_throws_js(TypeError, () => {
          m.observe(document, {});
      });
  }, "Should throw if none of childList, attributes, characterData are true");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { childList: true });
      m.disconnect();
  }, "Should not throw if childList is true");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { attributes: true });
      m.disconnect();
  }, "Should not throw if attributes is true");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { characterData: true });
      m.disconnect();
  }, "Should not throw if characterData is true");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { attributeOldValue: true });
      m.disconnect();
  }, "Should not throw if attributeOldValue is true and attributes is omitted");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { characterDataOldValue: true });
      m.disconnect();
  }, "Should not throw if characterDataOldValue is true and characterData is omitted");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { attributes: ["abc"] });
      m.disconnect();
  }, "Should not throw if attributeFilter is present and attributes is omitted");

  test(() => {
      var m = new MutationObserver(() => {});
      assert_throws_js(TypeError, () => {
          m.observe(document, { childList: true, attributeOldValue: true,
                                attributes: false });
      });
  }, "Should throw if attributeOldValue is true and attributes is false");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { childList: true, attributeOldValue: true,
                            attributes: true });
      m.disconnect();
  }, "Should not throw if attributeOldValue and attributes are both true");

  test(() => {
      var m = new MutationObserver(() => {});
      assert_throws_js(TypeError, () => {
          m.observe(document, { childList: true, attributeFilter: ["abc"],
                                attributes: false });
      });
  }, "Should throw if attributeFilter is present and attributes is false");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { childList: true, attributeFilter: ["abc"],
                            attributes: true });
      m.disconnect();
  }, "Should not throw if attributeFilter is present and attributes is true");

  test(() => {
      var m = new MutationObserver(() => {});
      assert_throws_js(TypeError, () => {
          m.observe(document, { childList: true, characterDataOldValue: true,
                                characterData: false });
      });
  }, "Should throw if characterDataOldValue is true and characterData is false");

  test(() => {
      var m = new MutationObserver(() => {});
      m.observe(document, { childList: true, characterDataOldValue: true,
                            characterData: true });
      m.disconnect();
  }, "Should not throw if characterDataOldValue is true and characterData is true");

