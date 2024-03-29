import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<style>\n#element {\n  display: none;\n}\n</style>\n\n</head><body><div id=\"element\"/>\n<div id=\"log\"/>\n\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

var possiblePositions = {
    'beforebegin': 'previousSibling'
  , 'afterbegin': 'firstChild'
  , 'beforeend': 'lastChild'
  , 'afterend': 'nextSibling'
}
var texts = {
   'beforebegin': 'raclette'
  , 'afterbegin': 'tartiflette'
  , 'beforeend': 'lasagne'
  , 'afterend': 'gateau aux pommes'
}

var el = document.querySelector('#element');

Object.keys(possiblePositions).forEach(function(position) {
  var div = document.createElement('h3');
  test(function() {
    div.id = texts[position];
    el.insertAdjacentElement(position, div);
    assert_equals(el[possiblePositions[position]].id, texts[position]);
  }, 'insertAdjacentElement(' + position + ', ' + div + ' )');

  test(function() {
    el.insertAdjacentText(position, texts[position]);
    assert_equals(el[possiblePositions[position]].textContent, texts[position]);
  }, 'insertAdjacentText(' + position + ', ' + texts[position] + ' )');
});

test(function() {
  assert_throws_js(TypeError, function() {
    el.insertAdjacentElement('afterbegin',
    document.implementation.createDocumentType("html"))
  })
}, 'invalid object argument insertAdjacentElement')
test(function() {
  var el = document.implementation.createHTMLDocument().documentElement;
  assert_throws_dom("HIERARCHY_REQUEST_ERR", function() {
    el.insertAdjacentElement('beforebegin', document.createElement('banane'))
  })
}, 'invalid caller object insertAdjacentElement')
test(function() {
  var el = document.implementation.createHTMLDocument().documentElement;
  assert_throws_dom("HIERARCHY_REQUEST_ERR", function() {
    el.insertAdjacentText('beforebegin', 'tomate farcie')
  })
}, 'invalid caller object insertAdjacentText')
test(function() {
  var div = document.createElement('h3');
  assert_throws_dom("SYNTAX_ERR", function() {
    el.insertAdjacentElement('heeeee', div)
  })
}, "invalid syntax for insertAdjacentElement")
test(function() {
  assert_throws_dom("SYNTAX_ERR", function() {
    el.insertAdjacentText('hoooo', 'magret de canard')
  })
}, "invalid syntax for insertAdjacentText")
test(function() {
  var div = document.createElement('div');
  assert_equals(div.insertAdjacentElement("beforebegin", el), null);
}, 'insertAdjacentText should return null');

