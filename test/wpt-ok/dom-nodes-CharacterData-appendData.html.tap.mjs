import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>CharacterData.appendData</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-appenddata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function testNode(create, type) {
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.appendData("bar")
    assert_equals(node.data, "testbar")
  }, type + ".appendData('bar')")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.appendData("")
    assert_equals(node.data, "test")
  }, type + ".appendData('')")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")
    node.appendData(", append more 資料，測試資料");
    assert_equals(node.data, "test, append more 資料，測試資料");
    assert_equals(node.length, 25);
  }, type + ".appendData(non-ASCII)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.appendData(null)
    assert_equals(node.data, "testnull")
  }, type + ".appendData(null)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.appendData(undefined)
    assert_equals(node.data, "testundefined")
  }, type + ".appendData(undefined)")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.appendData("", "bar")
    assert_equals(node.data, "test")
  }, type + ".appendData('', 'bar')")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    assert_throws_js(TypeError, function() { node.appendData() });
    assert_equals(node.data, "test")
  }, type + ".appendData()")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
