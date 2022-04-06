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
	const VPA = doc.getElementById("VPA");
	VPA.innerHTML = "<g><use/></g>";
	t.match(VPA.constructor.name, "SVGSVGElement");
	t.match(VPA.firstChild.constructor.name, "SVGGElement");
	t.match(VPA.firstChild.firstChild.constructor.name, "SVGUseElement");

	t.end();
});
