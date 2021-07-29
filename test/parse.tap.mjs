"uses strict";
import test from "tap";
import { Document } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { XMLSerializer, enumFlatDOM } from "../dist/dom-serialize.js";

const xml = `
<cupidatat><!--ullamco--><dolor></dolor><labore commodo="proident,"><enim>sint<eiusmod><officia>aute<!--cillum-->anim</officia>elit,<voluptate Duis="irure"><!--veniam,--><quis eu="non"></quis><ipsum est="culpa" laboris="magna" sunt="mollit">adipiscing<nisi laborum="nulla"><nostrud></nostrud><!--qui--></nisi></ipsum></voluptate>Ut</eiusmod><amet><!--consequat.--><!--Lorem--><!--tempor--></amet><!--ad-->et<!--in--><fugiat></fugiat></enim></labore></cupidatat>
`.trim();

const data = [
    ["<foo></foo>", null],
    ["<foo/>", null],
    ["<foo>hello world</foo>", null],
    ["<foo><!-- hora! --></foo>", null],
    ["<foo><br/></foo>", null],
    ["<foo><br></br></foo>", null],
    ['<foo bar="baz"></foo>', null],
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
    [
        '<foo name="前"><!-- Asa --><p/>朝飯前<br/><!-- meshi-mae --></foo>',
        null,
    ],

    [xml, null, null],
];

const parser = new DOMParser();
const serializer = new XMLSerializer();

for (let [i, [xml, expected, msg]] of data.entries()) {
    const doc = parser.parseFromString(xml);
    const top = doc.documentElement;
    const extra = [i, top && Array.from(enumFlatDOM(top))];

    expected = expected || xml;
    test.strictSame(top.toString(), expected, extra);
    test.strictSame(serializer.serializeToString(doc), expected, extra);

    test.test(`checkNode`, function (t) {
        checkNode(t, doc);
        t.end();
    });
}

function checkNode(t, node) {
    const first = node.firstChild;
    const last = node.lastChild;

    function* collectF(t, node) {
        for (
            let cur = first;
            cur;
            cur = cur === last ? null : cur.nextSibling
        ) {
            if (!cur) {
                console.dir([first, last, cur]);
            }
            yield cur;
        }
    }

    function* collectL(t, node) {
        for (
            let cur = last;
            cur;
            cur = cur === first ? null : cur.previousSibling
        ) {
            if (!cur) {
                console.dir([first, last, cur]);
            }
            yield cur;
        }
    }
    const F = Array.from(collectF());
    const L = Array.from(collectL()).reverse();
    t.strictSame(F, L);
    switch (node.nodeType) {
        case 1: // ELEMENT_NODE (1)
        case 9: // DOCUMENT_NODE (9);
        case 11: // DOCUMENT_FRAGMENT_NODE (11).
            t.strictSame(F, Array.from(node.childNodes));
    }

    // console.dir(F);
    // console.dir(first);

    for (let cur = first; cur; cur = cur === last ? null : cur.nextSibling) {
        t.strictSame(cur.parentNode, node);
        t.ok(cur.parentNode.isSameNode(node));
        t.notOk(cur.isSameNode(node));
        checkNode(t, cur);
    }
}
