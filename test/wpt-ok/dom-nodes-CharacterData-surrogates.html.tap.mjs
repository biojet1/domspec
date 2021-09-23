import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Splitting and joining surrogate pairs in CharacterData methods</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-substringdata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-replacedata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-insertdata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-deletedata\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-characterdata-data\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

function testNode(create, type) {
  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    assert_equals(node.substringData(1, 8), "\uDF20 test \uD83C")
  }, type + ".substringData() splitting surrogate pairs")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.replaceData(1, 4, "--");
    assert_equals(node.data, "\uD83C--st 🌠 TEST");

    node.replaceData(1, 2, "\uDF1F ");
    assert_equals(node.data, "🌟 st 🌠 TEST");

    node.replaceData(5, 2, "---");
    assert_equals(node.data, "🌟 st---\uDF20 TEST");

    node.replaceData(6, 2, " \uD83D");
    assert_equals(node.data, "🌟 st- 🜠 TEST");
  }, type + ".replaceData() splitting and creating surrogate pairs")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.deleteData(1, 4);
    assert_equals(node.data, "\uD83Cst 🌠 TEST");

    node.deleteData(1, 4);
    assert_equals(node.data, "🌠 TEST");
  }, type + ".deleteData() splitting and creating surrogate pairs")

  test(function() {
    var node = create()
    assert_equals(node.data, "test")

    node.data = "🌠 test 🌠 TEST"

    node.insertData(1, "--");
    assert_equals(node.data, "\uD83C--\uDF20 test 🌠 TEST");

    node.insertData(1, "\uDF1F ");
    assert_equals(node.data, "🌟 --\uDF20 test 🌠 TEST");

    node.insertData(5, " \uD83D");
    assert_equals(node.data, "🌟 -- 🜠 test 🌠 TEST");
  }, type + ".insertData() splitting and creating surrogate pairs")
}

testNode(function() { return document.createTextNode("test") }, "Text")
testNode(function() { return document.createComment("test") }, "Comment")
