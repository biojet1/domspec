"uses strict";
import test from "tap";
import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import { enumFlatDOM } from "../dist/element.js";

const data = [
    ["<foo></foo>", "<foo/>"],
    ["<foo/>", null],
    ["<foo>hello world</foo>", null],
    ["<foo><!-- hora! --></foo>", null],
    ["<foo><br/></foo>", null],
    ["<foo><br></br></foo>", "<foo><br/></foo>"],
    ['<foo bar="baz"></foo>', '<foo bar="baz"/>'],
    ["<a><b><c>hello</c></b></a>", null],
    ["<a><b>hello<c><!--comment --></c></b>END</a>", null],
    [
        '<foo \n\n\nbar\n\n=   \n"baz">\nhello\tworld</foo>',
        '<foo bar="baz">\nhello\tworld</foo>',
    ],
    ['<foo name="朝">朝飯前</foo>', null],
    ['<foo name="飯">朝飯前<!-- Asa-meshi-mae --></foo>', null],
    ['<foo name="前"><!-- Asa-meshi-mae -->朝飯前</foo>', null],
    ['<foo name="飯"><!-- Asa -->朝飯前<!-- meshi-mae --></foo>', null],
    ['<foo name="前"><!-- Asa --><p/>朝飯前<br/><!-- meshi-mae --></foo>', null],
];

const parser = new DOMParser();
for (let [xml, exp, msg] of data) {
    const doc = parser.parseFromString(xml);
    const top = doc.documentElement;
    test.equal(
        top && top.toString(),
        exp || xml,
        top && Array.from(enumFlatDOM(top))
    );
}
// it("should support nested tags", function () {
//     var node = parse("<a><b><c>hello</c></b></a>");
//     node.root.should.eql({
//         name: "a",
//         attributes: {},
//         children: [
//             {
//                 name: "b",
//                 attributes: {},
//                 children: [
//                     {
//                         name: "c",
//                         attributes: {},
//                         children: [],
//                         content: "hello",
//                     },
//                 ],
//                 content: "",
//             },
//         ],
//         content: "",
//     });
// });

// test.test(`should support weird whitespace`, function (t) {
//     const xml = '<foo \n\n\nbar\n\n=   \n"baz">\n\nhello world</foo>';
//     const doc = new Document();
//     parseDOM(xml, doc);
//     t.equal(doc.documentElement.toString(), '<foo bar="baz">\n\nhello world</foo>');
//     t.end();
// });
