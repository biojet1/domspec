import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { PathLS, Matrix, Vector, Box } from "svggeom";

const parser = new DOMParser();

tap.test("SVG innerHTML/defs", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
    <rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const VPA = doc.getElementById("VPA");
	const R1 = doc.getElementById("R1");
	VPA.innerHTML = "<g><use/></g>";
	t.match(VPA.constructor.name, "SVGSVGElement");
	t.match(VPA.firstChild.constructor.name, "SVGGElement");
	const use = VPA.firstChild.firstChild;
	t.match(use.constructor.name, "SVGUseElement");
	t.notOk(doc.querySelector("defs"));
	VPA._defs().appendChild(R1);
	t.ok(doc.querySelector("defs"));
	t.same(R1.parentNode, VPA._defs());
	t.same(use._hrefElement, null);
	use._hrefElement = R1;
	t.same(use?._hrefElement?.id, "R1");

	t.end();
});

tap.test("SVG clip-path", function (t) {
	const doc = parser.parseFromString(`
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <clipPath id="myClip" clipPathUnits="objectBoundingBox">
    <circle cx=".5" cy=".5" r=".5" />
  </clipPath>
  <!-- Top-left: Apply a custom defined clipping path -->
  <rect id="R1" x="1" y="1" width="8" height="8" stroke="green" clip-path="url(#myClip)" />
</svg>
		`);
	const svg = doc.documentElement;
	const R1 = doc.getElementById("R1");
	t.same(R1._clipElement?.id, "myClip");
	R1._clipElement = null;
	t.notOk(R1._clipElement);
	t.notOk(R1.hasAttribute("clip-path"));
	R1._clipElement = svg;
	t.ok(R1._clipElement);
	t.ok(R1.hasAttribute("clip-path"));
	t.ok(svg.id);
	// console.log(svg.outerHTML);

	t.ok(R1._ownTM.isIdentity);
	R1._ownTM = Matrix.parse("matrix(1 2 3 4 5 6)");
	t.ok(R1._ownTM.equals(Matrix.new([1, 2, 3, 4, 5, 6])));

	t.end();
});

tap.test("SVG getPointAtLength getTotalLength", function (t) {
	const doc = parser.parseFromString(`
<svg viewBox="-100 100 810 410" xmlns="http://www.w3.org/2000/svg">
  <line id="L1" x1="0" y1="0" x2="300" y2="400" style="stroke:red;stroke-width:6" class="line" transform="translate(100)"/>
  <polyline id="PL1" points="400,300 400,400" style="stroke:blue;stroke-width:6" transform="rotate(90)"/>
  <polygon id="PG1" points="400,300 400,400" style="stroke:green;stroke-width:6" transform="rotate(90,400,300)"/>
  <circle cx="400" cy="300" r="4" style="fill:magenta"/>
  <circle cx="300" cy="300" r="4" style="fill:cyan"/>
  <circle cx="400" cy="400" r="4" style="fill:orange"/>
  <path id="L0" d="M -300,400 300,300" style="stroke:yellow;stroke-width:6"/>
</svg>`);
	const svg = doc.documentElement;
	const L1 = doc.getElementById("L1");
	t.same(L1.getTotalLength(), 500);
	t.same(L1.getPointAtLength(500).toString(), Vector.new(300, 400).toString());
	t.same(L1.getPointAtLength(0).toString(), Vector.new(0, 0).toString());
	const p = L1._toPathElement();
	t.match(p.getAttribute("d"), /^M\s*0[\s,]+0\s*L\s*300[\s,]+400$/);

	const PL1 = doc.getElementById("PL1");
	const PG1 = doc.getElementById("PG1");

	{
		const m1 = PG1.transform.baseVal.consolidate().matrix;
		const m2 = Matrix.parse("matrix(0 1 -1 0 700 -100)");
		t.ok(m1.equals(m2), [m1, m2]);
	}

	PL1._fuseTransform();
	svg._fuseTransform();
	// console.log(PL1.getAttribute('points'));
	t.same(PL1.getAttribute("points"), "-300,400 -400,400");
	// t.same(PL1.getAttribute('points'), '-400,400 -300,400');
	t.same(
		PathLS.parse(PL1._toPathElement().getAttribute("d")).toString(),
		PathLS.parse("M-300,400L-400,400").toString()
	);
	t.same(
		PathLS.parse(PG1._toPathElement().getAttribute("d")).toString(),
		PathLS.parse("M 400,300 H 300Z").toString()
	);
	{
		// viewBox not serializing bug
		t.same(svg.viewBox.valueOf(), "-100 100 810 410");
		svg.setAttribute("viewBox", "N S E W");
		t.same(svg.viewBox.valueOf(), "N S E W");
		svg.viewBox.baseVal.x = 1;
		svg.viewBox.baseVal.y = 2;
		svg.viewBox.baseVal.width = 3;
		svg.viewBox.baseVal.height = 4;
		t.same(svg.viewBox.valueOf(), "1 2 3 4");
		svg.viewBox.baseVal.height = NaN;
		t.same(svg.viewBox.valueOf(), null);
		svg.viewBox.baseVal.height = 5;
		t.same(svg.viewBox.valueOf(), "1 2 3 5");
	}
	t.end();
});
tap.test("SVG width", function (t) {
	const { wrapper, mySVG } = parser.parseFromString(
		`
<html>
<head>
  <style>
    #wrapper {
        width: 500px;
    }
  </style>
</head>
<body>
  <div id="wrapper">
    <svg id="mySVG"></svg>
  </div>
</body>
</html>
`,
		"text/html"
	).all;
	{
		const csm = wrapper.computedStyleMap();
		const q = csm.get("width");
		let r = new SVGLength();
		t.ok(q);
		t.ok(r.parse(q.toString()), q);
		t.strictSame(r.value, 500, q);
		t.strictSame(mySVG.parentElement, wrapper);
		t.match(mySVG.constructor.name, /SVGSVGElement/);
		t.ok(mySVG.viewBox);
		t.match(mySVG.viewBox.constructor.name, /SVGAnimatedRect/);
		t.same(mySVG.viewBox.valueOf(), null);

		const x = mySVG.createSVGLength();
		x.valueAsString = "100%";

		console.dir(x.value);
		// console.dir(mySVG.viewBox.constructor.name);
		// console.dir(mySVG.viewBox.baseVal.width);
		// console.dir(mySVG.viewBox._calcWidth());
		// const b = mySVG.getBoundingClientRect();
		// console.dir(b);
		// console.dir(b.width);
		// console.dir(Box.rect(0, 0, NaN, NaN));
	}

	t.end();
});
