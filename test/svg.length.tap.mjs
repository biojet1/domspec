import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Path } from "svggeom";

const parser = new DOMParser();
tap.test("SVGLength", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
    <rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById("R1");
	var cssPixelsPerInch = 96;
	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_IN);
		var referenceValue = 48 / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue + "in");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_IN);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM);
		var referenceValue = (48 * 2.54) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(2) + "cm");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_CM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_MM);
		var referenceValue = (48 * 25.4) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(1) + "mm");
		t.same(length.valueInSpecifiedUnits, referenceValue.toFixed(1));
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_MM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "4px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT);
		var referenceValue = (4 / cssPixelsPerInch) * 72;
		t.same(length.valueAsString, referenceValue + "pt");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 4);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PT);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "16px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PC);
		var referenceValue = (16 / cssPixelsPerInch) * 6;
		t.same(length.valueAsString, referenceValue + "pc");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 16);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PC);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "2px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
		t.same(length.valueAsString, "2");
		t.same(length.valueInSpecifiedUnits, 2);
		t.same(length.value, 2);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_NUMBER);
	})();

	const xAttr = R1.getAttributeNode("x");
	const xVal = R1.x.baseVal;
	t.same(xAttr.value, "10px");
	t.same(xVal.value, 10);
	xAttr.value = "2in";
	t.same(xAttr.value, "2in");
	t.same(xVal.value, 96 * 2);
	xVal.value = 960;
	t.same(xAttr.value, "10in");
	t.same(xVal.value, 960);
	xVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT, 72);
	t.same(xAttr.value, "72pt");
	t.same(xVal.value, 96);
	t.same(`${xVal.valueAsString}`, "72pt");
	xAttr.value = "2pc";
	t.same(xAttr.value, "2pc");
	t.same(xVal.value, 32);
	xAttr.value = "63.5cm";
	t.same(xAttr.value, "63.5cm");
	t.same(xVal.value, 2400);
	xVal.valueInSpecifiedUnits = 31.75;
	t.same(xAttr.value, "31.75cm");
	t.same(xVal.value, 1200);
	t.same(xVal.toString(), "31.75cm");
	t.match(R1.outerHTML, /x="31\.75cm"/);
	// t.throws(
	// 	() => {
	// 		xVal.convertToSpecifiedUnits(2); //%
	// 	},
	// 	{ name: /NotSupportedError/ }
	// );
	// console.log(VPA.outerHTML)
	// xVal.convertToSpecifiedUnits(2);
	// xAttr.value = "";
	// t.same(xAttr.value, ""); // todo
	// t.same(R1.x.baseVal.value, 0);
	// t.same(R1.x.baseVal.valueInSpecifiedUnits, 0);
	// t.same(R1.x.baseVal.unitType, 1);
	const VPA = doc.getElementById("VPA");
	VPA.width.baseVal;
	t.match(VPA.outerHTML, /x="31\.75cm"/);
	t.end();
});

tap.test("SVGLength", function (t) {
	const doc = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
    <rect id="R1" x="10px" y="20px" width="100px" height="200px" rx="15px" ry="30px"/>
</svg>
		`);
	const top = doc.documentElement;
	const R1 = doc.getElementById("R1");
	const VPA = doc.getElementById("VPA");


	// t.match(VPA.outerHTML, /x="31\.75cm"/);


	var cssPixelsPerInch = 96;
	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_IN);
		var referenceValue = 48 / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue + "in");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_IN);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_CM);
		var referenceValue = (48 * 2.54) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(2) + "cm");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_CM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "48px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_MM);
		var referenceValue = (48 * 25.4) / cssPixelsPerInch;
		t.same(length.valueAsString, referenceValue.toFixed(1) + "mm");
		t.same(length.valueInSpecifiedUnits, referenceValue.toFixed(1));
		t.same(length.value, 48);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_MM);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "4px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT);
		var referenceValue = (4 / cssPixelsPerInch) * 72;
		t.same(length.valueAsString, referenceValue + "pt");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 4);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PT);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "16px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PC);
		var referenceValue = (16 / cssPixelsPerInch) * 6;
		t.same(length.valueAsString, referenceValue + "pc");
		t.same(length.valueInSpecifiedUnits, referenceValue);
		t.same(length.value, 16);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_PC);
	})();

	(() => {
		var length = R1.createSVGLength();
		length.valueAsString = "2px";
		length.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
		t.same(length.valueAsString, "2");
		t.same(length.valueInSpecifiedUnits, 2);
		t.same(length.value, 2);
		t.same(length.unitType, SVGLength.SVG_LENGTHTYPE_NUMBER);
	})();

	const xAttr = R1.getAttributeNode("x");
	const xVal = R1.x.baseVal;
	t.same(xAttr.value, "10px");
	t.same(xVal.value, 10);
	xAttr.value = "2in";
	t.same(xAttr.value, "2in");
	t.same(xVal.value, 96 * 2);
	xVal.value = 960;
	t.same(xAttr.value, "10in");
	t.same(xVal.value, 960);
	xVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PT, 72);
	t.same(xAttr.value, "72pt");
	t.same(xVal.value, 96);
	t.same(`${xVal.valueAsString}`, "72pt");
	xAttr.value = "2pc";
	t.same(xAttr.value, "2pc");
	t.same(xVal.value, 32);
	xAttr.value = "63.5cm";
	t.same(xAttr.value, "63.5cm");
	t.same(xVal.value, 2400);
	xVal.valueInSpecifiedUnits = 31.75;
	t.same(xAttr.value, "31.75cm");
	t.same(xVal.value, 1200);
	t.same(xVal.toString(), "31.75cm");
	t.match(R1.outerHTML, /x="31\.75cm"/);
	// t.throws(
	// 	() => {
	// 		xVal.convertToSpecifiedUnits(2); //%
	// 	},
	// 	{ name: /NotSupportedError/ }
	// );
	// xVal.convertToSpecifiedUnits(2);
	// xAttr.value = "";
	// t.same(xAttr.value, ""); // todo
	// t.same(R1.x.baseVal.value, 0);
	// t.same(R1.x.baseVal.valueInSpecifiedUnits, 0);
	// t.same(R1.x.baseVal.unitType, 1);
	t.match(VPA.outerHTML, /x="31\.75cm"/);
	R1.setAttribute("y", "invalidpx");

// console.log(VPA.outerHTML);
// console.log(R1.y.baseVal.valueAsString);

	t.end();
});
