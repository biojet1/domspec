"uses strict";
import test from "tap";
// import { ChildNode } from "../dist/interface/child-node.js";
// console.log("ChildNode", ChildNode);
//  import { DocumentType } from "../dist/interface/document-type.js";
// console.log("DocumentType", DocumentType);

// import { Node } from "../dist/interface/node.js";
// console.log("Node", Node);

import { Document } from "../dist/interface/document.js";
// console.log("Document");

// const doc = new Document();

import { parseDOM } from "../dist/interface/dom-parse.js";
import { enumFlatDOM } from "../dist/interface/element.js";
// test.test(`should support tags`, function (t) {
//     // const xml = "<foo></foo>";

//     t.end();
// });

// test.test(`should support tags with text`, function (t) {
//     const xml = "<foo>hello world</foo>";
//     const doc = new Document();
//     parseDOM(xml, doc);
//     t.equal(doc.documentElement.toString(), xml);
//     t.end();
// });

// test.test('should support tags with attributes', function(t){
//       const xml = '<foo bar="baz" some="stuff here" whatever="whoop"></foo>';
//     const doc = new Document();
//     parseDOM(xml, doc);
//     t.equal(doc.documentElement.toString(), xml);
//     t.end();
// })

const data = [
    ["<foo></foo>", "<foo/>"],
    ["<foo/>", null],
    ["<foo>hello world</foo>", null],
    ["<foo><!-- hora! --></foo>", null],
    ["<foo><br/></foo>", null],
    ['<foo bar="baz"></foo>', '<foo bar="baz"/>'],
    ["<a><b><c>hello</c></b></a>", null],
    ["<a><b>hello<c><!--comment --></c></b>END</a>", null],
    ['<foo \n\n\nbar\n\n=   \n"baz">\n\nhello world</foo>', '<foo bar="baz">\n\nhello world</foo>'],
];
for (let [xml, exp, msg] of data) {
    const doc = new Document();
    parseDOM(xml, doc);
    const top = doc.documentElement;
    test.equal(top && top.toString(), exp || xml, top && Array.from(enumFlatDOM(top)));
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
