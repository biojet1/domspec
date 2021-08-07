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
console.dir(node.style, {depth:1});

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
