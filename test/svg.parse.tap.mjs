import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Matrix, Vec } from 'svggeom';

const parser = new DOMParser();

tap.test('SVG innerHTML/defs', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
    <rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const VPA = doc.getElementById('VPA');
	const R1 = doc.getElementById('R1');
	VPA.innerHTML = '<g><use/></g>';
	t.match(VPA.constructor.name, 'SVGSVGElement');
	t.match(VPA.firstChild.constructor.name, 'SVGGElement');
	const use = VPA.firstChild.firstChild;
	t.match(use.constructor.name, 'SVGUseElement');
	t.notOk(doc.querySelector('defs'));
	VPA.defs().appendChild(R1);
	t.ok(doc.querySelector('defs'));
	t.same(R1.parentNode, VPA.defs());
	t.same(use.hrefElement, null);
	use.hrefElement = R1;
	t.same(use?.hrefElement?.id, 'R1');

	t.end();
});

tap.test('SVG clip-path', function (t) {
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
	const R1 = doc.getElementById('R1');
	t.same(R1.clipElement?.id, 'myClip');
	R1.clipElement = null;
	t.notOk(R1.clipElement);
	t.notOk(R1.hasAttribute('clip-path'));
	R1.clipElement = svg;
	t.ok(R1.clipElement);
	t.ok(R1.hasAttribute('clip-path'));
	t.ok(svg.id);
	// console.log(svg.outerHTML);

	t.ok(R1.ownTM.isIdentity);
	R1.ownTM = Matrix.parse('matrix(1 2 3 4 5 6)');
	t.ok(R1.ownTM.equals(Matrix.new([1, 2, 3, 4, 5, 6])));

	t.end();
});

tap.test('SVG getPointAtLength getTotalLength', function (t) {
	const doc = parser.parseFromString(`
<svg viewBox="-100 100 500 500" xmlns="http://www.w3.org/2000/svg">
  <line id="L1" x1="0" y1="0" x2="300" y2="400" style="stroke:red" class="line" transform="translate(100)"/>
    <polyline id="PL1" points="400,300 400,400" transform="rotate(90)"/>
    <polygon id="PG1" points="400,300 400,400" transform="rotate(90,400,300)"/>
</svg>
		`);
	const svg = doc.documentElement;
	const L1 = doc.getElementById('L1');
	t.same(L1.getTotalLength(), 500);
	t.same(L1.getPointAtLength(500).toString(), Vec.pos(300, 400).toString());
	t.same(L1.getPointAtLength(0).toString(), Vec.pos(0, 0).toString());
	const p = L1.toPathElement();
	t.match(p.getAttribute('d'), /^M\s*0[\s,]+0\s*L\s*300[\s,]+400$/);
	const PL1 = doc.getElementById('PL1');
	const PG1 = doc.getElementById('PG1');
	PL1.fuseTransform();
	svg.fuseTransform();
	console.log(svg.outerHTML);
	t.same(PL1.getAttribute('points'), '-300,400 -400,400');
	t.same(Path.parse(PL1.toPathElement().getAttribute('d')).toString(), Path.parse('M-300,400L-400,400').toString());
	t.same(Path.parse(PG1.toPathElement().getAttribute('d')).toString(), Path.parse('M400,300L300,300Z').toString());

	// const q = ;
	// t.same(q.end, );

	t.end();
});
