import tap from "tap";
import { Document } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";

const parser = new DOMParser();

const doc = parser.parseFromString(
	`

<!DOCTYPE root [
<!-- I'm a test. -->
]>
<svg><?PI EXTRA?>
<text><![CDATA[<![CDATA\xA0<&>]]></text>;
</svg>
	`,
	"text/xml"
);

tap.notOk(doc.isHTML);
tap.notOk(doc.isSVG);
const c1 = doc.documentElement.firstElementChild.lastChild;
tap.strictSame(c1.data, "<![CDATA\xA0<&>");
tap.strictSame(c1.toString(), `<![CDATA[${c1.data}]]>`);
doc.documentElement.append(
	doc.documentElement.firstElementChild.lastChild.data
);
// console.log(doc.innerHTML);
tap.strictSame(
	doc.documentElement.lastChild.toString(),
	"&lt;![CDATA&nbsp;&lt;&amp;&gt;"
);

tap.test("createProcessingInstruction", function (t) {
	t.throws(() => doc.createProcessingInstruction(`TARGET`, "Nani?>"));
	t.throws(() => doc.createProcessingInstruction(`_&NAME`, "DATA"));
	t.strictSame(
		doc.createProcessingInstruction("TARGET", "DATA").toString(),
		"<? TARGET DATA ?>"
	);
	t.end();
});

tap.test("parse error", function (t) {
	t.throws(() => parser.parseFromString(`<root]]>`, "text/xml"));
	t.end();
});

tap.test("createTextNode", function (t) {
	const e1 = doc.createTextNode("");
	const e2 = doc.createTextNode("");
	t.ok(e1.isEqualNode(e2));
	t.ok(e2.isEqualNode(e1));
	e1.data = "TEXT";
	t.notOk(e1.isEqualNode(e2));
	t.notOk(e2.isEqualNode(e1));

	t.ok(e1.isEqualNode(e1));
	t.notOk(e2.isEqualNode(null));

	t.end();
});
