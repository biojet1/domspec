import test from "tap";
import { Document } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
const parser = new DOMParser();
const document = parser.parseFromString("<html/>");

function assert(a, b, msg){
    test.strictSame(a, b, {}, msg);

}


let node = document.createElement("div");
assert(node.style.cssText, "", "empty style");
node.style.cssText = "background-color: blue";
assert(node.style.backgroundColor, "blue", "style getter");
assert(node.style.toString(), "background-color:blue", "cssText setter");
assert([...node.style].join(","), "background-color", "iterable");
assert(node.style.length, 1, "style.length");
assert(node.style[0], "background-color", "style[0]");
node.getAttributeNode("style").value = "color: red";
assert(node.style.toString(), "color:red", "cssText indirect setter");
let style = document.createAttribute("style");
node.setAttributeNode(style);
assert(node.toString(), "<div></div>", "cssText cleanup");
node.style.backgroundColor = "green";
// console.dir(style, {depth:0});
// console.dir(node.style, {depth:0});
assert(
	node.toString(),
	'<div style="background-color:green"></div>',
	"cssText indirect property"
);
node.removeAttributeNode(style);
node.style.color = "green";
// console.dir(node.style, {depth:1});

assert(
	node.toString(),
	'<div style="color:green"></div>',
	"cssText indirect setter again"
);

node.style.color = null;
assert(node.toString(), "<div></div>", "setter as null");
// node.id = "";
// node.className = "";
// assert(node.toString(), "<div></div>", "setter as null");

assert(node.className, '', 'no class name');
assert(node.classList.contains('test'), false, 'no test class');
node.classList.add('a', 'test', 'b');
// console.dir(node.classList, {depth:1});
assert(node.classList.value, 'a test b', 'correct .value');
assert(node.classList.length, 3, 'correct .length');
assert(node.classList.contains('test'), true, 'test class');
node.classList.toggle('test');
assert(node.classList.contains('test'), false, 'no test class again');
node.classList.toggle('test', false);
assert(node.classList.contains('test'), false, 'no test class again 2');
node.classList.toggle('test');
assert(node.classList.contains('test'), true, 'test class in');
node.classList.toggle('test', true);
assert(node.classList.contains('test'), true, 'test class still in');
node.classList.toggle('test', false);
node.classList.toggle('test', true);
node.classList.remove('test');
assert(node.classList.contains('test'), false, 'no test class one more time');
assert(node.classList.replace('b', 'c'), true, 'replace happened');
assert(node.classList.value, 'a c', 'correct .value again');
assert(node.classList.replace('b', 'c'), false, 'replace did not happen');
assert(node.classList.supports('whatever'), true, 'whatever');
node.setAttribute('class', 'a b c');
assert(node.getAttribute('class'), 'a b c');
node.removeAttribute('class');
assert(node.classList.length, 0);
assert(node.getAttribute('class'), '');

assert(Object.keys(node.dataset).length, 0, 'empty dataset');
assert(node.dataset.testValue, void 0, 'no testValue');
node.dataset.testValue = 123;
assert('testValue' in node.dataset, true, 'dataset in trap');
assert(node.getAttribute('data-test-value'), '123', 'dataset.testValue');
// console.log(Object.keys(node.dataset), Object.getOwnPropertyNames(node.dataset))
assert(Object.keys(node.dataset).length, 1, 'not empty dataset');
delete node.dataset.testValue;
assert(Object.keys(node.dataset).length, 0, 'empty dataset again');