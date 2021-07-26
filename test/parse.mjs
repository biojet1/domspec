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

test.test(`should support tags`, function (t) {
    const xml = "<foo></foo>";
    const doc = new Document();

    parseDOM(xml, doc);
    t.equal(doc.documentElement.toString(), "<foo/>");
    t.end();
});

test.test(`should support tags with text`, function (t) {
    const xml = "<foo>hello world</foo>";
    const doc = new Document();
    parseDOM(xml, doc);
    t.equal(doc.documentElement.toString(), xml);
    t.end();
});

test.test('should support tags with attributes', function(t){
      const xml = '<foo bar="baz" some="stuff here" whatever="whoop"></foo>';
    const doc = new Document();
    parseDOM(xml, doc);
    t.equal(doc.documentElement.toString(), xml);
    t.end();

})

// test.test(`should support weird whitespace`, function (t) {
//     const xml = '<foo \n\n\nbar\n\n=   \n"baz">\n\nhello world</foo>';
//     const doc = new Document();
//     parseDOM(xml, doc);
//     t.equal(doc.documentElement.toString(), '<foo bar="baz">\n\nhello world</foo>');
//     t.end();
// });

