import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";

const parser = new DOMParser();

const doc = parser
	.parseString(
		`
<!DOCTYPE root [
<!-- I'm a test. -->
]>
<svg><?PI EXTRA?><![CDATA[DATA1]]>END
<text><![CDATA[DATA2]]>STR</text>;
</svg>
	`,
		"text/html"
	)
	.then((doc) => {
		console.log(doc.innerHTML);
	});

parser
	.parseString(
		`
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:html="http://www.w3.org/1999/xhtml">
  <title>SVGGeometryElement.prototype.getPointAtLength clamps its argument to [0, length]</title>
  <metadata>
    <html:link rel="help" href="https://svgwg.org/svg2-draft/types.html#__svg__SVGGeometryElement__getPointAtLength"/>
    <html:meta name="assert" content="SVGGeometryElement.prototype.getPointAtLength clamps its argument."/>
  </metadata>
  <g stroke="blue">
    <line id="line" x1="50" y1="60" x2="100" y2="60"/>
    <path id="path" d="M40,70L110,70"/>
  </g>
  <html:script src="/resources/testharness.js"/>
  <html:script src="/resources/testharnessreport.js"/>
  <script><![CDATA[
  Script
  ]]></script>
</svg>

	`,
		"text/xml"
	)
	.then((doc) => {
		console.log(doc.innerHTML);
	});