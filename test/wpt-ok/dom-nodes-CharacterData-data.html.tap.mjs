import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.data</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function testNode(create, type) {
  test(function() {
    var node = create()
    assert_equals(node.data, "test")
    assert_equals(node.length, 4)
  }, type + ".data initial value")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = null;
    assert_equals(node.data, "")
    assert_equals(node.length, 0)
  }, type + ".data = null")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = undefined;
    assert_equals(node.data, "undefined")
    assert_equals(node.length, 9)
  }, type + ".data = undefined")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = 0;
    assert_equals(node.data, "0")
    assert_equals(node.length, 1)
  }, type + ".data = 0")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "";
    assert_equals(node.data, "")
    assert_equals(node.length, 0)
  }, type + ".data = ''")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "--";
    assert_equals(node.data, "--")
    assert_equals(node.length, 2)
  }, type + ".data = '--'")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "資料";
    assert_equals(node.data, "資料")
    assert_equals(node.length, 2)
  }, type + ".data = '資料'")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST";
    assert_equals(node.data, "🌠 test 🌠 TEST")
    assert_equals(node.length, 15)  // Counting UTF-16 code units
  }, type + ".data = '🌠 test 🌠 TEST'")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
