import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createAttribute</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"attributes.js\"/>\n<script src=\"productions.js\"/>\n</head><body><div id=\"log\">\n<script/>\n</div></body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/attributes.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)
const src1 = `${process.env.WPT_ROOT}/dom/nodes/productions.js`;
vm.runInThisContext(fs.readFileSync(src1, "utf8"), src1)

var xml_document;
setup(function() {
  xml_document = document.implementation.createDocument(null, null, null);
});

invalid_names.forEach(function(name) {
  test(function() {
    assert_throws_dom("INVALID_CHARACTER_ERR", function() {
      document.createAttribute(name, "test");
    });
  }, "HTML document.createAttribute(" + format_value(name) + ") should throw");

  test(function() {
    assert_throws_dom("INVALID_CHARACTER_ERR", function() {
      xml_document.createAttribute(name, "test");
    });
  }, "XML document.createAttribute(" + format_value(name) + ") should throw");
});

valid_names.forEach(name => {
  test(() => {
    let attr = document.createAttribute(name);
    attr_is(attr, "", name.toLowerCase(), null, null, name.toLowerCase());
  }, `HTML document.createAttribute(${format_value(name)})`);

  test(() => {
    let attr = xml_document.createAttribute(name);
    attr_is(attr, "", name, null, null, name);
  }, `XML document.createAttribute(${format_value(name)})`);
});

var tests = ["title", "TITLE", null, undefined];
tests.forEach(function(name) {
  test(function() {
    var attribute = document.createAttribute(name);
    attr_is(attribute, "", String(name).toLowerCase(), null, null, String(name).toLowerCase());
    assert_equals(attribute.ownerElement, null);
  }, "HTML document.createAttribute(" + format_value(name) + ")");

  test(function() {
    var attribute = xml_document.createAttribute(name);
    attr_is(attribute, "", String(name), null, null, String(name));
    assert_equals(attribute.ownerElement, null);
  }, "XML document.createAttribute(" + format_value(name) + ")");
});
