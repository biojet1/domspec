import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { Path } from "svggeom";

const parser = new DOMParser();

tap.test("fuseTranform", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <g id="GA">
    <g id="GB" transform="translate(0, 100)">
      <g id="GC" transform="translate(100, 0)">
        <path id="P1" d="M30 40h-30v-40z" stroke="#bdcdd4" stroke-width="2"/>
        <line id="L1" x1="0" y1="80" x2="100" y2="20" stroke="black"/>
      </g>
      <polyline id="PL1" points="0,100 50,25 50,75 100,0"/>
      <circle id="C1" cx="50" cy="50" r="50"/>
      <ellipse id="E1" cx="10.0" cy="10.0" rx="15.0" ry="10.0"/>
    </g>
    <polyline id="PL2" transform="scale(2, -1)" points="100,100 150,25 150,75 200,0" fill="none" stroke="black"/>
  </g>
</svg>
		`);
	const top = doc.documentElement;
	const P1 = doc.getElementById("P1");
	const C1 = doc.getElementById("C1");
	const E1 = doc.getElementById("E1");
	const L1 = doc.getElementById("L1");
	const PL1 = doc.getElementById("PL1");
	const PL2 = doc.getElementById("PL2");
	const GA = doc.getElementById("GA");
	const GB = doc.getElementById("GB");
	const GC = doc.getElementById("GC");

	t.same(L1.x1.baseVal.value, 0);
	t.same(L1.y1.baseVal.value, 80);
	t.same(L1.x2.baseVal.value, 100);
	t.same(L1.y2.baseVal.value, 20);
	t.same(L1.describe(), `M 0 80 L 100 20`);
	t.same(C1.cx.baseVal.value, 50);
	t.same(C1.cy.baseVal.value, 50);
	t.same(C1.r.baseVal.value, 50);
	t.same(E1.cx.baseVal.value, 10);
	t.same(E1.cy.baseVal.value, 10);
	t.same(E1.rx.baseVal.value, 15);
	t.same(E1.ry.baseVal.value, 10);

	top.fuseTransform();

	t.notOk(P1.hasAttribute("P1"));
	t.notOk(GA.hasAttribute("transform"));
	t.notOk(GB.hasAttribute("transform"));
	t.notOk(GC.hasAttribute("transform"));
	t.notOk(PL1.hasAttribute("transform"));
	t.notOk(PL2.hasAttribute("transform"));

	console.error(top.outerHTML);
	t.same(PL1.getAttribute("points"), "0,200 50,125 50,175 100,100");
	t.same(PL2.getAttribute("points"), "200,-100 300,-25 300,-75 400,0");
	const p = P1.path;
	let [x, y] = p.firstPoint;
	t.same([x, y], [130, 140]);

	t.end();
});

tap.test("polygon", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
  <polygon id="PG1" points="10,10 50,50 10,15 15,10"/>
</svg>
		`);
	const top = doc.documentElement;
	const PG1 = doc.getElementById("PG1");
	t.same(
		Path.parse(PG1.describe()).describe(),
		"M 10 10 L 50 50 L 10 15 L 15 10 Z"
	);
	t.end();
});

tap.test("line", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
  <line id="L1"  x1="2.0" y1="3.0" x2="4.0" y2="5.0"/>
</svg>
		`);
	const top = doc.documentElement;
	const L1 = doc.getElementById("L1");
	t.same(L1.describe(), "M 2 3 L 4 5");
	t.end();
});

tap.test("rect", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
  <rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById("R1");

	t.same(R1.x.baseVal.value, 10);
	t.same(R1.y.baseVal.value, 20);
	t.same(R1.width.baseVal.value, 100);
	t.same(R1.height.baseVal.value, 200);

	// t.same(Path.parse(PG1.describe()).describe(), 'M 2 3 L 4 5 Z');
	t.end();
});

// rect = Rectangle(attrib={
//     "x": "10px", "y": "20px",
//     "width": "100px", "height": "200px",
//     "rx": "15px", "ry": "30px" })
// self.assertEqual(rect.left, 10)
// self.assertEqual(rect.top, 20)
// self.assertEqual(rect.right, 10+100)
// self.assertEqual(rect.bottom, 20+200)
// self.assertEqual(rect.width, 100)
// self.assertEqual(rect.height, 200)
// self.assertEqual(rect.rx, 15)
// self.assertEqual(rect.ry, 30)
