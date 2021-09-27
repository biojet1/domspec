import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
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

tap.test("endNode", function (t) {
	const top = doc.documentElement;
	const end = top.endNode;
	t.notOk(end.isEqualNode(top));
	t.ok(end.isEqualNode(end));
	t.end();
});

tap.test("contains/querySelector no args", function (t) {
	const top = doc.documentElement;
	t.throws(() => top.contains(), TypeError);
	t.throws(() => top.contains(1), TypeError);
	t.throws(() => top.querySelector(), TypeError);
	t.throws(() => top.querySelectorAll(), TypeError);
	t.end();
});


tap.test("createDocumentType", function (t) {
	const e1 = doc.implementation.createDocumentType(
		"html",
		"STAFF",
		"staffNS.dtd"
	);
	const e2 = doc.implementation.createDocumentType(
		"html",
		"STAFF",
		"staffNS.dtd"
	);
	t.strictSame(e1.toString(), '<!DOCTYPE html PUBLIC "STAFF" "staffNS.dtd">');
	t.ok(e1.isEqualNode(e2));
	t.ok(e2.isEqualNode(e1));

	e1.name = "TEXT";
	t.notOk(e1.isEqualNode(e2));
	t.notOk(e2.isEqualNode(e1));
	e2.name = "";
	t.notOk(e1.isEqualNode(e2));
	t.notOk(e2.isEqualNode(e1));
	e1.name = "";
	t.ok(e1.isEqualNode(e2));
	t.ok(e2.isEqualNode(e1));
	t.strictSame(e2.toString(), '<!DOCTYPE  PUBLIC "STAFF" "staffNS.dtd">');

	e1.systemId = "";
	t.notOk(e1.isEqualNode(e2));
	t.notOk(e2.isEqualNode(e1));
	e2.systemId = "";
	t.ok(e1.isEqualNode(e2));
	t.ok(e2.isEqualNode(e1));
	t.strictSame(e2.toString(), '<!DOCTYPE  PUBLIC "STAFF">');

	e1.publicId = "";
	t.notOk(e1.isEqualNode(e2));
	t.notOk(e2.isEqualNode(e1));
	e2.publicId = "";
	t.ok(e1.isEqualNode(e2));
	t.ok(e2.isEqualNode(e1));
	t.strictSame(e2.toString(), "<!DOCTYPE >");

	t.ok(e1.isEqualNode(e1));
	t.notOk(e2.isEqualNode(null));

	t.end();
	//  assert_equals(doctype.name, "html")
	// assert_equals(doctype.publicId, 'STAFF')
	// assert_equals(doctype.systemId, 'staffNS.dtd')
});

tap.test("createHTMLDocument", function (t) {
	const html = doc.implementation.createHTMLDocument();
	t.ok(html.isHTML);
	t.notOk(html.isSVG);
	t.strictSame(html.title, "");
	t.throws(() => doc.adoptNode(html));
	t.throws(() => doc.adoptNode(html.endNode));
	const html2 = doc.implementation.createHTMLDocument("DOC");
	t.strictSame(html2.title, "DOC");
	for (const cur of html2.getElementsByTagName("body")) {
		cur.remove();
	}
	t.strictSame(html2.body, null);

	t.end();
});

tap.test("SVGDocument", function (t) {
	const svg = new SVGDocument();
	t.notOk(svg.isHTML);
	t.ok(svg.isSVG);
	t.end();
});

tap.test("isDefaultNamespace", function (t) {
	const doc2 = parser.parseFromString(
		`<root xmlns="fooNamespace" attr="value" xmlns:prefix="PrefixedNamespace"></root>`,
		"text/xml"
	);

	t.notOk(doc2.isDefaultNamespace("ooNamespace"));
	t.ok(doc2.isDefaultNamespace("fooNamespace"));
	const top = doc2.documentElement;
	const attr = top.getAttributeNode("attr");
	t.notOk(attr.isDefaultNamespace("ooNamespace"));
	t.ok(attr.isDefaultNamespace("fooNamespace"));

	t.strictSame(attr.ownerElement, top);
	t.strictSame(attr.lookupNamespaceURI("prefix"), "PrefixedNamespace");
	t.notOk(attr.lookupNamespaceURI("refixedNamespace"));
	t.strictSame(attr.lookupPrefix("PrefixedNamespace"), "prefix");
	t.notOk(attr.lookupPrefix("prefi"));
	t.ok(attr.isEqualNode(attr));
	t.notOk(attr.isEqualNode(top));
	t.notOk(attr.isEqualNode(null));
	t.notOk(attr.isEqualNode(top.getAttributeNode("attr2")));
	top.removeAttributeNode(attr);
	t.notOk(attr.isDefaultNamespace("fooNamespace"));
	t.notOk(attr.ownerElement);

	top.remove();
	t.notOk(doc2.isDefaultNamespace("fooNamespace"));
	t.notOk(doc2.cloneNode(true).documentElement);

	t.end();
});

// var fooElem = document.createElementNS('fooNamespace', 'prefix:elem');
// fooElem.setAttribute('bar', 'value');

// lookupNamespaceURI(fooElem, null, null, 'Element should have null namespace, prefix null');
// lookupNamespaceURI(fooElem, '', null, 'Element should have null namespace, prefix ""');
// lookupNamespaceURI(fooElem, 'fooNamespace', null, 'Element should not have namespace matching prefix with namespaceURI value');
// lookupNamespaceURI(fooElem, 'xmlns', null, 'Element should not have XMLNS namespace');
// lookupNamespaceURI(fooElem, 'prefix', 'fooNamespace', 'Element has namespace URI matching prefix');
// isDefaultNamespace(fooElem, null, true, 'Empty namespace is not default, prefix null');
// isDefaultNamespace(fooElem, '', true, 'Empty namespace is not default, prefix ""');
// isDefaultNamespace(fooElem, 'fooNamespace', false, 'fooNamespace is not default');
// isDefaultNamespace(fooElem, 'http://www.w3.org/2000/xmlns/', false, 'xmlns namespace is not default');

// fooElem.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:bar', 'barURI');
// fooElem.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'bazURI');
