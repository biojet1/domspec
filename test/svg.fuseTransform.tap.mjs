import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { PathLS, Box } from 'svggeom';

const parser = new DOMParser();

tap.test('fuseTranform', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
	<g id="GA">
	 <path id="P3" d="M 10,10 H 40 V 30 H 10 Z" stroke="#bdcdd4" stroke-width="2" transform="matrix(3 1 -1 3 30 40)"/>
	 <g id="GB" transform="translate(0, 100)">
			<g id="GC" transform="translate(100, 0)">
				<path id="P1" d="M30 40h-30v-40z" stroke="#bdcdd4" stroke-width="2"/>
				<path id="P2" d="M 10,10 H 40 V 30 H 10 Z" stroke="#bdcdd4" stroke-width="2" transform="matrix(3 1 -1 3 30 40)"/>
				<line id="L1" x1="0" y1="80" x2="100" y2="20" stroke="black"/>
			</g>
			<polyline id="PL1" points="0,100 50,25 50,75 100,0"/>
			<circle id="C1" cx="50" cy="50" r="50"/>
			<ellipse id="E1" cx="10.0" cy="10.0" rx="15.0" ry="10.0"/>
			<rect id="R1" x="50" y="20" width="150" height="150" />
			<rect id="R2" x="50" y="20" width="150" height="150" transform="translate(-100, 0)" />
			<line id="L2" x1="0" y1="80" x2="100" y2="20" stroke="black" transform="translate(-100, 0)" />

		</g>
		<polyline id="PL2" transform="scale(2, -1)" points="100,100 150,25 150,75 200,0" fill="none" stroke="black"/>
	</g>
</svg>
		`);
	function eqBox(a, b, epsilon = 0, tag) {
		const v = a._boundingBox()
		t.ok(v.equals(b, epsilon), `${tag || a.id} [${v}] vs [${b}]`);
	}

	const top = doc.documentElement;
	const R1 = doc.getElementById('R1');
	const R2 = doc.getElementById('R2');
	const P1 = doc.getElementById('P1');
	const P2 = doc.getElementById('P2');
	const P3 = doc.getElementById('P3');
	const C1 = doc.getElementById('C1');
	const E1 = doc.getElementById('E1');
	const L1 = doc.getElementById('L1');
	const PL1 = doc.getElementById('PL1');
	const PL2 = doc.getElementById('PL2');
	const GA = doc.getElementById('GA');
	const GB = doc.getElementById('GB');
	const GC = doc.getElementById('GC');

	t.same(L1.x1.baseVal.value, 0);
	t.same(L1.y1.baseVal.value, 80);
	t.same(L1.x2.baseVal.value, 100);
	t.same(L1.y2.baseVal.value, 20);
	t.same(L1._describe(), `M 0 80 L 100 20`);
	t.same(C1.cx.baseVal.value, 50);
	t.same(C1.cy.baseVal.value, 50);
	t.same(C1.r.baseVal.value, 50);
	t.same(E1.cx.baseVal.value, 10);
	t.same(E1.cy.baseVal.value, 10);
	t.same(E1.rx.baseVal.value, 15);
	t.same(E1.ry.baseVal.value, 10);


	eqBox(E1, Box.new('-5 100 30 20'));
	eqBox(PL1, Box.new('0 100 100 100'));
	eqBox(PL2, Box.new('200 -100 200 100'));
	eqBox(C1, Box.new('0 100 100 100'));
	eqBox(L1, Box.new('100 120 100 60'));
	top._fuseTransform();


	t.notOk(P1.hasAttribute('transform'));
	t.notOk(L1.hasAttribute('transform'));
	t.notOk(P2.hasAttribute('transform'));
	t.notOk(P3.hasAttribute('transform'));
	t.notOk(GA.hasAttribute('transform'));
	t.notOk(GB.hasAttribute('transform'));
	t.notOk(GC.hasAttribute('transform'));
	t.notOk(PL1.hasAttribute('transform'));
	t.notOk(PL2.hasAttribute('transform'));

	t.same(
		[R1.x.baseVal.value, R1.y.baseVal.value, R1.width.baseVal.value, R1.height.baseVal.value],
		[50, 120, 150, 150]
	);
	t.same([...R1._path.firstPoint], [50, 120, 0]);
	t.same(
		[R2.x.baseVal.value, R2.y.baseVal.value, R2.width.baseVal.value, R2.height.baseVal.value],
		[50 - 100, 20 + 100, 150, 150]
	);
	t.same([...R2._path.firstPoint], [50 - 100, 20 + 100, 0]);

	t.same(PL1.getAttribute('points'), '0,200 50,125 50,175 100,100');
	t.same(PL2.getAttribute('points'), '200,-100 300,-25 300,-75 400,0');
	let p = P1._path;
	let [x, y] = p.firstPoint;
	t.same([x, y], [130, 140]);

	t.same(
		[...P2._path].reverse().map((s) => s.to).map((p) => [p.x - 100, p.y - 100]),
		[
			[50, 80],
			[140, 110],
			[120, 170],
			[30, 140],
			[50, 80],
		]
	);
	
	t.same(
		[...P3._path].reverse().map((s) => s.to).map((p) => [p.x, p.y]),
		[

			[50, 80],
			[140, 110],
			[120, 170],
			[30, 140],
			[50, 80],
		]
	);

	t.end();
});

tap.test('polygon', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
	<polygon id="PG1" points="10,10 50,50 10,15 15,10"/>
</svg>
		`);
	const top = doc.documentElement;
	const PG1 = doc.getElementById('PG1');
	t.same(PathLS.parse(PG1._describe()).describe(), 'M10,10L50,50L10,15L15,10Z');
	t.end();
});

tap.test('line', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
	<line id="L1" x1="2.0" y1="3.0" x2="4.0" y2="5.0"/>
</svg>
		`);
	const top = doc.documentElement;
	const L1 = doc.getElementById('L1');
	t.same(L1._describe(), 'M 2 3 L 4 5');

	t.end();
});

tap.test('rect', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
	<rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById('R1');

	t.same(R1.x.baseVal.value, 10);
	t.same(R1.y.baseVal.value, 20);
	t.same(R1.width.baseVal.value, 100);
	t.same(R1.height.baseVal.value, 200);

	// t.same(PathLS.parse(PG1._describe()).describe(), 'M 2 3 L 4 5 Z');
	t.end();
});

tap.test('viewportElement', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
	<svg id="VPB" viewBox="0 0 200 100">
		<svg id="VPC" viewBox="0 0 200 100">
			<svg id="VPD" viewBox="0 0 200 100">
				<svg id="VPE" viewBox="0 0 200 100">
					<rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
				</svg>
			</svg>
		</svg>
	</svg>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById('R1');
	const VPA = doc.getElementById('VPA');
	const VPB = doc.getElementById('VPB');
	const VPC = doc.getElementById('VPC');
	const VPD = doc.getElementById('VPD');
	const VPE = doc.getElementById('VPE');

	t.same(R1.viewportElement.id, 'VPE');
	t.same(R1.ownerSVGElement.id, 'VPE');
	t.same(R1.nearestViewportElement.id, 'VPE');
	t.same(R1.farthestViewportElement.id, 'VPA');
	t.same(VPE.viewportElement.id, 'VPD');
	t.same(VPE.ownerSVGElement.id, 'VPD');
	t.same(VPE.nearestViewportElement.id, 'VPD');
	t.same(VPE.farthestViewportElement.id, 'VPA');
	t.same(VPA.farthestViewportElement, null);
	t.same(VPA.nearestViewportElement, null);
	t.same(VPA.ownerSVGElement, null);
	t.same(VPA.viewportElement, null);
	t.same(R1._isViewportElement, 0);
	t.end();
});

tap.test('createSVGLength', function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
		<rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById('R1');
	var cssPixelsPerInch = 96;
	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '48px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_IN);
		var referenceValue = 48 / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue + 'in');
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_IN);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '48px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM);
		var referenceValue = (48 * 2.54) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(2) + 'cm');
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_CM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '48px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_MM);
		var referenceValue = (48 * 25.4) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(1) + 'mm');
		t.same(length.valueInSpecifiedUnits, referenceValue.toFixed(1));
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_MM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '4px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT);
		var referenceValue = (4 / cssPixelsPerInch) * 72;
		t.same(length.valueAsString, referenceValue + 'pt');
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 4);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PT);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '16px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PC);
		var referenceValue = (16 / cssPixelsPerInch) * 6;
		t.same(length.valueAsString, referenceValue + 'pc');
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 16);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PC);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = '2px';
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
		t.same(length.valueAsString, '2');
		t.same(length.valueInSpecifiedUnits, 2);
		t.same(length.value, 2);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_NUMBER);
	})();

	const xAttr = R1.getAttributeNode('x');
	const xVal = R1.x.baseVal;
	t.same(xAttr.value, '10px');
	t.same(xVal.value, 10);
	xAttr.value = '2in';
	t.same(xAttr.value, '2in');
	t.same(xVal.value, 96 * 2);
	xVal.value = 960;
	t.same(xAttr.value, '10in');
	t.same(xVal.value, 960);
	xVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT, 72);
	t.same(xAttr.value, '72pt');
	t.same(xVal.value, 96);
	t.same(`${xVal.valueAsString}`, '72pt');
	xAttr.value = '2pc';
	t.same(xAttr.value, '2pc');
	t.same(xVal.value, 32);
	xAttr.value = '63.5cm';
	t.same(xAttr.value, '63.5cm');
	t.same(xVal.value, 2400);
	xVal.valueInSpecifiedUnits = 31.75;
	t.same(xAttr.value, '31.75cm');
	t.same(xVal.value, 1200);
	t.same(xVal.toString(), '31.75cm');
	xAttr.value = '';
	// t.same(xAttr.value, ""); // todo
	// t.same(R1.x.baseVal.value, 0);
	// t.same(R1.x.baseVal.valueInSpecifiedUnits, 0);
	// t.same(R1.x.baseVal.unitType, 1);

	t.end();
});
