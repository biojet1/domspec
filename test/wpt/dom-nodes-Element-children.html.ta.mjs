import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "./wpthelp.mjs"
const html = "<html><head><title>HTMLCollection edge cases</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"log\"/>\n<div id=\"test\"><img/><img id=\"foo\"/><img id=\"foo\"/><img name=\"bar\"/></div>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

setup(function() {
  // Add some non-HTML elements in there to test what happens with those.
  var container = document.getElementById("test");
  var child = document.createElementNS("", "img");
  child.setAttribute("id", "baz");
  container.appendChild(child);

  child = document.createElementNS("", "img");
  child.setAttribute("name", "qux");
  container.appendChild(child);
});

test(function() {
  var container = document.getElementById("test");
  var result = container.children.item("foo");
  assert_true(result instanceof Element, "Expected an Element.");
  // console.log(result.outerHTML);
  // console.log(document.innerHTML);
  // assert_false(result.hasAttribute("id"), "Expected the IDless Element.")
})

test(function() {
  var container = document.getElementById("test");
  var list = container.children;
  var result = [];
  for (var p in list) {
    if (list.hasOwnProperty(p)) {
      result.push(p+'');
    }
  }
  assert_array_equals(result, ['0', '1', '2', '3', '4', '5']);
  result = Object.getOwnPropertyNames(list);
  assert_array_equals(result, ['0', '1', '2', '3', '4', '5', 'foo', 'bar', 'baz']);

  // Mapping of exposed names to their indices in the list.
  var exposedNames = { 'foo': 1, 'bar': 3, 'baz': 4 };
  for (var exposedName in exposedNames) {
    assert_true(exposedName in list);
    // assert_true(list.hasOwnProperty(exposedName));
    // assert_equals(list[exposedName], list.namedItem(exposedName));
    // assert_equals(list[exposedName], list.item(exposedNames[exposedName]));
    // assert_true(list[exposedName] instanceof Element);
  }

  var unexposedNames = ['qux'];
  for (var unexposedName of unexposedNames) {
    assert_false(unexposedName in list);
    // assert_false(list.hasOwnProperty(unexposedName));
    // assert_equals(list[unexposedName], undefined);
    // assert_equals(list.namedItem(unexposedName), null);
  }
});
