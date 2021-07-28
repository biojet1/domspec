"uses strict";
import test from "tap";
import { JSDOM } from "jsdom";
import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import { enumFlatDOM } from "../dist/element.js";

const xml = `
<cupidatat><!--ullamco--><dolor></dolor><labore commodo="proident,"><enim>sint<eiusmod><officia>aute<!--cillum-->anim</officia>elit,<voluptate Duis="irure"><!--veniam,--><quis eu="non"></quis><ipsum est="culpa" laboris="magna" sunt="mollit">adipiscing<nisi laborum="nulla"><nostrud></nostrud><!--qui--></nisi></ipsum></voluptate>Ut</eiusmod><amet><!--consequat.--><!--Lorem--><!--tempor--></amet><!--ad-->et<!--in--><fugiat></fugiat></enim></labore></cupidatat>

    `;

function similarNode(t, a, b) {
    t.ok(a && b);
    t.strictSame(a.nodeType, b.nodeType, "nodeType");
    t.strictSame(a.nodeName, b.nodeName, "nodeType");
    t.strictSame(a.nodeValue, b.nodeValue, "nodeValue");
    switch (a.nodeType) {
        case 1: {
            t.strictSame(a.tagName, b.tagName, "nodeValue");
        }
    }
}

function checkNode(t, a, b) {
    similarNode(t, a, b);
    const aN = `[${a.nodeType}:${a.nodeName}]`;
    const bN = `[${a.nodeType}:${a.nodeName}]`;

    switch (a.nodeType) {
        case 1: {
            // ELEMENT_NODE (1)
            const attrsB = b.attributes;
            let i = attrsB.length;
            while (i-- > 0) {
                const attrB = attrsB[i];

                t.strictSame(
                    a.getAttribute(attrB.name),
                    attrB.value,
                    `getAttribute ${attrB.name} ${aN}`
                );

                const attrA = a.getAttributeNode(attrB.name);
                t.notOk(a.getAttributeNode(`${attrB.name}-not`));
                t.ok(a.getAttributeNode(attrB.name));
                t.ok(a.getAttributeNodeNS("", attrB.name));
                t.ok(a.getAttributeNodeNS(null, attrB.name));
                t.strictSame(a.hasAttribute(attrB.name), true);
                t.strictSame(a.hasAttributeNS("", attrB.name), true);
                t.strictSame(a.hasAttributeNS(null, attrB.name), true);
                t.strictSame(a.hasAttribute(`${attrB.name}-not`), false);

                if (attrA.namespaceURI || attrB.namespaceURI) {
                    t.strictSame(
                        attrA.namespaceURI,
                        attrB.namespaceURI,
                        `namespaceURI ${attrB.name} ${aN}`
                    );
                }
                if (attrA.prefix || attrB.prefix) {
                    t.strictSame(
                        attrA.prefix,
                        attrB.prefix,
                        `prefix ${attrB.name} '${attrA.name}' '${attrB.name}' ${aN}`
                    );
                }

                t.strictSame(
                    attrA.value,
                    attrB.value,
                    `value ${attrB.name} '${attrA.value}' '${attrB.value}' ${aN}`
                );
                t.strictSame(
                    attrA.localName,
                    attrB.localName,
                    `localName ${attrB.name} '${attrA.name}' '${attrB.name}' ${aN}`
                );
                t.strictSame(
                    attrA.specified,
                    attrB.specified,
                    `specified ${attrB.name} ${aN}`
                );
                similarNode(t, attrA.ownerElement, attrB.ownerElement);

                if (i % 2 == 0) {
                    a.removeAttribute(attrB.name);
                } else {
                    a.removeAttributeNS("", attrB.name);
                }

                t.notOk(a.getAttributeNode(attrB.name));
                t.notOk(a.getAttributeNodeNS("", attrB.name));
                t.notOk(a.getAttributeNodeNS(null, attrB.name));
                t.strictSame(a.hasAttribute(attrB.name), false);
                t.strictSame(a.hasAttributeNS("", attrB.name), false);
                t.strictSame(a.hasAttributeNS(null, attrB.name), false);
            }
            // getAttributeNode()
        }
        case 9: // DOCUMENT_NODE (9)
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

    const doc1 = new JSDOM(xml, {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/xml",
    }).window.document;
    const doc2 = parser.parseFromString(xml);
    checkNode(t, doc2, doc1);
    t.end();
});
