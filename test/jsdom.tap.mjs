"uses strict";
import test from "tap";
import fs from "fs";
import { JSDOM } from "jsdom";
import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";

const xml = fs.readFileSync("test/test.xml", "utf8");

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
            let i;

            // Attribute compare
            for (i = attrsB.length; i-- > 0; ) {
                const attrB = attrsB[i];

                t.strictSame(
                    a.getAttribute(attrB.name),
                    attrB.value,
                    `getAttribute ${attrB.name} ${aN}`
                );

                const attrA = a.getAttributeNode(attrB.name);

                // t.notOk(a.getAttributeNode(`${attrB.name}-not`));
                t.ok(a.getAttributeNode(attrB.name));
                t.ok(a.getAttributeNodeNS("", attrB.name));
                t.ok(a.getAttributeNodeNS(null, attrB.name));
                t.strictSame(a.hasAttribute(attrB.name), true);
                t.strictSame(a.hasAttributeNS("", attrB.name), true);
                t.strictSame(a.hasAttributeNS(null, attrB.name), true);
                t.strictSame(a.hasAttribute(`${attrB.name}-not`), false);

                similarNode(t, attrA.ownerElement, attrB.ownerElement);
                checkNode(t, attrA, attrB);

                t.strictSame(a.getAttributeNode(attrB.name), attrA);

                if (i % 2 == 0) {
                    a.removeAttribute(attrB.name);
                } else {
                    a.removeAttributeNS("", attrB.name);
                }

                t.notOk(a.getAttributeNode(attrB.name));
                t.notOk(a.getAttributeNodeNS("", attrB.name));
                t.notOk(a.getAttributeNodeNS(null, attrB.name));
                //
                t.strictSame(a.hasAttribute(attrB.name), false);
                t.strictSame(a.hasAttributeNS("", attrB.name), false);
                t.strictSame(a.hasAttributeNS(null, attrB.name), false);
                //
                a.toggleAttribute(attrB.name);
                t.strictNotSame(a.getAttributeNode(attrB.name), attrA);
                t.strictSame(a.getAttribute(attrB.name), "");
                const attrA2 = a.getAttributeNode(attrB.name);
                attrA2.textContent = "朝飯前";
                t.strictSame(a.getAttribute(attrB.name), "朝飯前");
                attrA2.textContent = attrB.textContent;
            }

            t.strictSame(a.outerHTML, b.outerHTML);
            t.strictSame(a.innerHTML, b.innerHTML);

            // Attribute modification

            for (i = attrsB.length; i-- > 0; ) {
                const attrB = attrsB[i];
                const attrA = a.getAttributeNode(attrB.name);

                if (i % 2 == 0) {
                    a.removeAttribute(attrB.name);
                } else {
                    a.removeAttributeNS("", attrB.name);
                }

                t.notOk(a.getAttributeNode(attrB.name));
                t.notOk(a.getAttributeNodeNS("", attrB.name));
                t.notOk(a.getAttributeNodeNS(null, attrB.name));
                //
                t.strictSame(a.hasAttribute(attrB.name), false);
                t.strictSame(a.hasAttributeNS("", attrB.name), false);
                t.strictSame(a.hasAttributeNS(null, attrB.name), false);
                //
                a.toggleAttribute(attrB.name);
                t.strictNotSame(a.getAttributeNode(attrB.name), attrA);
                t.strictSame(a.getAttribute(attrB.name), "");
                const attrA2 = a.getAttributeNode(attrB.name);
                attrA2.textContent = "朝飯前";
                t.strictSame(a.getAttribute(attrB.name), "朝飯前");
            }

            t.strictSame(a.id, b.id);
            t.strictSame(a.toggleAttribute("id"), b.toggleAttribute("id"));
            t.strictSame(
                a.toggleAttribute("id", true),
                b.toggleAttribute("id", true)
            );
            t.strictSame(
                a.toggleAttribute("id", false),
                b.toggleAttribute("id", false)
            );
        }
        case 9: // DOCUMENT_NODE (9)
        case 11:
            {
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
                ///////

                //
                let node = a.parentNode;
                while (node) {
                    t.strictSame(node.contains(a), true, `contains ${aN}`);
                    t.strictSame(a.contains(node), false, `not contains ${aN}`);
                    node = node.parentNode;
                }
                //
                for (i = A.length; i-- > 0; ) {
                    const child = a.removeChild(A[i]);
                    t.strictSame(child, A[i], `removeChild ${aN}`);
                    t.notOk(A[i].parentNode, `removeChild parentNode ${aN}`);
                    t.notOk(A[i].nextSibling, `removeChild nextSibling ${aN}`);
                    t.notOk(
                        A[i].previousSibling,
                        `removeChild previousSibling ${aN}`
                    );
                }
            }
            break;
        case 3: // TEXT_NODE (3);
        case 4: // CDATA_SECTION_NODE (4);
        case 8: // COMMENT_NODE (8);
            t.strictSame(a.data, b.data, `data ${aN}`);
            t.strictSame(a.length, b.length, `length ${aN}`);
            t.strictSame(
                a.textContent,
                b.nodeValue,
                `textContent==data  ${aN}`
            );
            t.strictSame(
                b.nodeValue,
                a.textContent,
                `textContent==data  ${aN}`
            );
            break;
        case 2: // ATTRIBUTE_NODE (2);
            if (a.namespaceURI || b.namespaceURI) {
                t.strictSame(
                    a.namespaceURI,
                    b.namespaceURI,
                    `namespaceURI ${b.name} ${aN}`
                );
            }
            if (a.prefix || b.prefix) {
                t.strictSame(
                    a.prefix,
                    b.prefix,
                    `prefix ${b.name} '${a.name}' '${b.name}' ${aN}`
                );
            }
            t.strictSame(
                a.value,
                b.value,
                `value ${b.name} '${a.value}' '${b.value}' ${aN}`
            );
            t.strictSame(
                a.localName,
                b.localName,
                `localName ${b.name} '${a.name}' '${b.name}' ${aN}`
            );
            t.strictSame(a.textContent, b.nodeValue, `textContent==data ${aN}`);
            t.strictSame(b.nodeValue, a.textContent, `textContent==data ${aN}`);
            t.strictSame(a.specified, b.specified, `specified ${b.name} ${aN}`);

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
