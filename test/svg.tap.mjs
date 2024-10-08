import fs from "fs";
import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGRect } from "../dist/all.js";

const parser = new DOMParser();

tap.test("viewBox", function (t) {
	const doc = parser.parseFromString(`<?xml version="1.0" standalone="no"?>
<svg width="300px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-10 20 200 300"></svg>`);
	const top = doc.documentElement;
	// console.log(top.constructor.name);
	// console.log(top.width.constructor.name);
	// console.log(top.viewBox.constructor.name);
	t.strictSame(top.viewBox.constructor.name, "SVGAnimatedRect");

	t.strictSame(top.viewBox.baseVal.x, -10);
	t.strictSame(top.viewBox.baseVal.width, 200);
	t.strictSame(top.height.baseVal.value, 100);

	top.viewBox.baseVal.x = 42;
	top.viewBox.baseVal.width = 456;
	top.height.baseVal.value = 444;
	t.strictSame(top.viewBox.baseVal.x, 42);
	t.strictSame(top.height.baseVal.value, 444);
	t.strictSame(top.getAttribute("viewBox"), "42 20 456 300");

	const text = top.outerHTML;

	t.match(text, /viewBox="42 20 456 300"/);
	t.match(text, /height="444(?:px)?"/);

	top.setAttribute("viewBox", "10 20 30 40");
	const vb = top.viewBox.baseVal;
	t.strictSame(vb.x, 10);
	t.strictSame(vb.y, 20);
	t.strictSame(vb.width, 30);
	t.strictSame(vb.height, 40);

	// console.log(top.outerHTML);

	t.end();
});

tap.test("createSVGTransformFromMatrix", function (t) {
	const document = parser.parseFromString(`<?xml version="1.0" standalone="no"?>
<svg width="300px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-10 20 200 300">
<g id='g' transform='scale(5)'/></svg>`);
	let svg = document.documentElement,
		g = document.getElementById("g"),
		m1 = svg.createSVGMatrix(),
		m2 = svg.createSVGMatrix(),
		m3 = svg.createSVGMatrix();

	let m;

	m1.a = 3;
	m1.b = 0;
	m1.c = 0;
	m1.d = 1;
	m1.e = 0;
	m1.f = 0;
	m2.a = 3;
	m2.b = 0;
	m2.c = 0;
	m2.d = 1;
	m2.e = 0;
	m2.f = 0;
	m3.a = 3;
	m3.b = 0;
	m3.c = 0;
	m3.d = 1;
	m3.e = 0;
	m3.f = 0;

	m = g.transform.baseVal.createSVGTransformFromMatrix(m1);
	m1.a = 2;
	t.strictNotSame(m.matrix, m1);
	t.strictSame(m.matrix.a, 3);

	m = svg.createSVGTransformFromMatrix(m2);
	m2.a = 2;
	t.strictNotSame(m.matrix, m2);
	t.strictSame(m.matrix.a, 3);

	m = g.transform.baseVal.getItem(0);

	m.setMatrix(m3);
	m3.a = 2;
	t.strictNotSame(m.matrix, m3);
	t.strictSame(m.matrix.a, 3);

	t.end();
});

tap.test("createSVGTransformFromMatrix", function (t) {
	const document = parser.parseFromString(`<?xml version="1.0" standalone="no"?>
<svg width="300px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-10 20 200 300">
  <g transform="translate(20 -10)">
    <g id="subteststatus" transform="translate(0,40)">
      <rect id="status" y="5" width="15" height="15" fill="red"/>
      <text id="scriptstatus" y="20" x="20" >Scripting disabled</text>
    </g>

    <polyline id="r" fill="none" stroke="green" display="none" transform="translate(10 10) rotate(90)" points="0 0 30 40 80 -20" stroke-width="10"/>
  </g>
</svg>

`);

	let eps = 0.005; // "close enough"
	let r = document.getElementById("r");

	let t1 = r.transform.baseVal.getItem(0);
	let t2 = r.transform.baseVal.getItem(1);

	// check that matrices are as specified in the markup
	t.strictSame(t1.matrix.dump_hexad(), [1, 0, 0, 1, 10, 10]);
	t.strictSame(t2.matrix.dump_hexad(), [0, 1, -1, 0, 0, 0]);

	// consolidate
	let tfm = r.transform.baseVal.consolidate();

	// check that the consolidation is ok
	t.strictSame(tfm.matrix.dump_hexad(), [0, 1, -1, 0, 10, 10]);

	// check that t1 and t2 were not affected by the consolidation
	t.strictSame(t1.matrix.dump_hexad(), [1, 0, 0, 1, 10, 10]);
	t.strictSame(t2.matrix.dump_hexad(), [0, 1, -1, 0, 0, 0]);

	// // check that modifying t1 has no effect on the consolidated transform
	t1.setTranslate(10, 200);
	t.strictSame(t1.matrix.dump_hexad(), [1, 0, 0, 1, 10, 200]);
	t.strictSame(tfm.matrix.dump_hexad(), [0, 1, -1, 0, 10, 10]);

	// check that modifying t2 has no effect on the consolidated transform
	t2.setRotate(-90, 0, 0);
	t.strictSame(t2.matrix.dump_hexad(), [0, -1, 1, 0, 0, 0]);
	t.strictSame(tfm.matrix.dump_hexad(), [0, 1, -1, 0, 10, 10]);

	// check that modifying the consolidated transform has no effect on the t1 and t2 transforms
	tfm.matrix.f = 400;
	t.strictSame(tfm.matrix.dump_hexad(), [0, 1, -1, 0, 10, 400]);
	t.strictSame(t1.matrix.dump_hexad(), [1, 0, 0, 1, 10, 200]);
	t.strictSame(t2.matrix.dump_hexad(), [0, -1, 1, 0, 0, 0]);

	// document.getElementById("status").setAttributeNS(null, "fill", passed ? "lime" : "red");
	// document.getElementById("scriptstatus").textContent = "Scripting enabled";

	t.end();
});

tap.test("width.baseVal", function (t) {
	const document = parser.parseFromString(
		fs.readFileSync("test/res/transform.svg", {
			encoding: "utf-8",
		})
	);
	const { RO } = document.all;
	const v = RO.width.baseVal;
	t.ok(v, v);
	t.strictSame(RO.width.baseVal, v);
	RO.width.baseVal.value = 7;
	t.strictSame(RO.width.baseVal, v);
	t.same(RO.width.baseVal.value, 7, v);

	t.end();
});
tap.test("width.baseVal", function (t) {
	const document = parser.parseFromString(
		fs.readFileSync("test/res/transform.svg", {
			encoding: "utf-8",
		})
	);
	var svgElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	svgElement.setAttribute("viewBox", "1 2 3 4");
	// Check initial viewBox value.
	t.match(svgElement.constructor.name, /SVGSVGElement/);
	t.match(svgElement.viewBox.constructor.name, /SVGAnimatedRect/);
	t.ok(svgElement.viewBox.baseVal instanceof SVGRect);
	t.ok(svgElement.viewBox.animVal instanceof SVGRect);
	// assert_equals(svgElement.viewBox.baseVal.x, 0);

	t.end();
});
