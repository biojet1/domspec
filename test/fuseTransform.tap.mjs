import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";

const parser = new DOMParser();

tap.test("fuseTranform", function (t) {
	const doc = parser.parseFromString(`
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
<g id="GA">
<g id="GB" transform="translate(0, 100)">
<g id="GC" transform="translate(100, 0)">
   <path id="P1" d="M30 40h-30v-40z" stroke="#bdcdd4" stroke-width="2"/>
</g>

  <!-- Example of a polyline with the default fill -->
  <polyline id="PL1" points="0,100 50,25 50,75 100,0" />


</g>
  <!-- Example of the same polyline shape with stroke and no fill -->
  <polyline id="PL2" points="100,100 150,25 150,75 200,0"
            fill="none" stroke="black" />
          </g>
</svg>

		`);
	const top = doc.documentElement;
	top.fuseTransform();

	const P1 = doc.getElementById("P1");
	const PL1 = doc.getElementById("PL1");
	const PL2 = doc.getElementById("PL2");
	const GA = doc.getElementById("GA");
	const GB = doc.getElementById("GB");
	const GC = doc.getElementById("GC");

	t.notOk(P1.hasAttribute("P1"));
	t.notOk(GA.hasAttribute("transform"));
	t.notOk(GB.hasAttribute("transform"));
	t.notOk(GC.hasAttribute("transform"));
	t.notOk(PL1.hasAttribute("transform"));
	t.notOk(PL2.hasAttribute("transform"));

	console.error(top.outerHTML);
	t.same(PL1.getAttribute("points"), "0,200 50,125 50,175 100,100");
	t.same(PL2.getAttribute("points"), "100,100 150,25 150,75 200,0");

	t.end();
});
