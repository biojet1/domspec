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
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>&lt;?xml?> is not a ProcessingInstruction</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
</head>
<body>
<div id="log"/>
<script>
test(function() {
  assert_equals(document.firstChild, document.documentElement)
})
</script>
</body>
</html>

	`,
		"text/xml"
	)
	.then((doc) => {
		console.log(doc.innerHTML);
		function getEnumerableOwnProps1(obj) {
			var arr = [];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					arr.push(prop);
				}
			}
			return arr;
		}
		var el = doc.createElement("div");
		el.setAttribute("a", "");
		el.setAttribute("b", "");
		console.error(Object.getOwnPropertyNames(el.attributes));
		console.error(getEnumerableOwnProps1(el.attributes), ["0", "1"]);
		// console.error(getEnumerableOwnProps2(el.attributes), ["0", "1"]);
	});
