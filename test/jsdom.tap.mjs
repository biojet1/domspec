"uses strict";
import test from "tap";
import { JSDOM } from "jsdom";
import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import { enumFlatDOM } from "../dist/element.js";

const xml = `
<cupidatat><!--ullamco--><dolor></dolor><labore commodo="proident,"><enim>sint<eiusmod><officia>aute<!--cillum-->anim</officia>elit,<voluptate Duis="irure"><!--veniam,--><quis eu="non"></quis><ipsum est="culpa" laboris="magna" sunt="mollit">adipiscing<nisi laborum="nulla"><nostrud></nostrud><!--qui--></nisi></ipsum></voluptate>Ut</eiusmod><amet><!--consequat.--><!--Lorem--><!--tempor--></amet><!--ad-->et<!--in--><fugiat></fugiat></enim></labore></cupidatat>

    `;

function checkNode(t, a, b) {
    t.strictSame(a.nodeType, b.nodeType, "nodeType");
    t.strictSame(a.nodeName, b.nodeName, "nodeType");
    t.strictSame(a.nodeValue, b.nodeValue, "nodeValue");
    const aN = `[${a.nodeType}:${a.nodeName}]`;
    const bN = `[${a.nodeType}:${a.nodeName}]`;

    switch (a.nodeType) {
        case 1: // ELEMENT_NODE (1)
        case 9: // DOCUMENT_NODE (9);
        case 11: {
            // DOCUMENT_FRAGMENT_NODE (11).
            const A = Array.from(a.childNodes);
            const B = Array.from(b.childNodes);
            t.strictSame(A.length, B.length, `childNodes.length ${aN}`);
            let i = B.length;
            while (i-- > 0) {
                checkNode(t, A[i], B[i]);
            }
            const EA = Array.from(a.children);
            const EB = Array.from(b.children);
            t.strictSame(EA.length, EA.length, `children.length ${aN}`);

            for (i = EA.length; i-- > 0; ) {
                t.ok(A.indexOf(EA[i]) >= 0, `children[${i}] ${aN}`);
                t.strictSame(
                    EA[i].nodeType,
                    1,
                    `children[${i}] is element ${aN}`
                );
            }

            break;
        }
        case 3: // TEXT_NODE (3);
        case 4: // CDATA_SECTION_NODE (4);
        case 8: // COMMENT_NODE (8);
            t.strictSame(a.data, b.data, `data ${aN}`);
            t.strictSame(a.length, b.length, `length ${aN}`);
            t.strictSame(a.textContent, a.data, `textContent==data  ${aN}`);

        case 7: // PROCESSING_INSTRUCTION_NODE (7);
            t.strictSame(a.textContent, b.textContent, `textContent  ${aN}`);
            break;
        default:
            throw new Error(`Unexpected nodeType=${b.nodeType} ${aN}`);
    }
}
test.test(`checkNode`, function (t) {
    const parser = new DOMParser();

    const dom1 = new JSDOM(xml, {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/xml",
    });
    const doc2 = parser.parseFromString(xml);
    const doc1 = dom1.window.document;
    console.dir(doc1);
    checkNode(t, doc2, doc1);
    t.end();
});
