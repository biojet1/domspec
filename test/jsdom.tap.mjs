"uses strict";
import test from "tap";
import fs from "fs";
import { JSDOM } from "jsdom";
import { Document } from "../dist/document.js";
import { DOMParser } from "../dist/dom-parse.js";
import { checkNode } from "./domCheck.mjs";

const xml = fs.readFileSync("test/test.xml", "utf8");
const CI = !!process.env.CI;

function similarNode(t, a, b) {
    t.ok(a && b);
    const aN = `[${a.nodeType}:${a.nodeName}]`;
    const bN = `[${a.nodeType}:${a.nodeName}]`;
    t.strictSame(a.nodeType, b.nodeType, "nodeType");
    t.strictSame(a.nodeName, b.nodeName, "nodeName");
    t.strictSame(a.nodeValue, b.nodeValue, "nodeValue");
    t.strictSame(
        a.textContent,
        b.textContent,
        `textContent ${aN} ${a.outerHTML} ${b.outerHTML}`
    );

    switch (a.nodeType) {
        case 1:
            {
                t.ok(a.ownerDocument, `${a.nodeName}`);
                t.strictSame(a.tagName, b.tagName, "nodeValue");
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
            break;
        case 7: // PROCESSING_INSTRUCTION_NODE (7);
            t.strictSame(a.textContent, b.textContent, `textContent  ${aN}`);
            break;
    }
}

function compareNode(t, a, b) {
    similarNode(t, a, b);
    const aN = `[${a.nodeType}:${a.nodeName}]`;
    const bN = `[${a.nodeType}:${a.nodeName}]`;
    const nt = a.nodeType;
    switch (nt) {
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
                compareNode(t, attrA, attrB);

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
                a.getAttributeNode(attrB.name).textContent = "朝飯前";
                t.strictSame(a.getAttribute(attrB.name), "朝飯前");
                a.getAttributeNode(attrB.name).textContent = attrB.textContent;
            }

            // t.strictSame(a.outerHTML, b.outerHTML);
            // t.strictSame(a.innerHTML, b.innerHTML);

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
                t.strictSame(a.attributes.length, attrsB.length);
                t.strictNotSame(a.getAttributeNode(attrB.name), attrA);
                t.strictSame(a.getAttribute(attrB.name), "");
                a.getAttributeNode(attrB.name).textContent = "朝飯前";
                t.strictSame(a.attributes.length, attrsB.length);
                t.strictSame(a.getAttribute(attrB.name), "朝飯前");
                a.setAttribute(attrB.name, attrB.value);
                t.strictSame(a.attributes.length, attrsB.length);
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
        case 11: // DOCUMENT_FRAGMENT_NODE (11).
            {
                const outerHTMLA = a.outerHTML;
                const outerHTMLB = b.outerHTML;
                const A = Array.from(a.childNodes);
                const B = Array.from(b.childNodes);
                const nA = a.childNodes.length;
                const nB = b.childNodes.length;
                let i, fA, fB;
                t.strictSame(A.length, B.length, `childNodes.length ${aN}`);
                t.strictSame(a.childElementCount, b.childElementCount);
                // t.strictSame(outerHTMLA, outerHTMLB);
                // t.ok(a.isEqualNode(b));

                for (i = B.length; i-- > 0; ) {
                    compareNode(t, A[i], B[i]);
                }

                if (nt !== 9 && nt != 11) {
                    fA = a.ownerDocument.createDocumentFragment();
                    fB = b.ownerDocument.createDocumentFragment();

                    fB.prepend(...B);
                    fA.prepend(...A);
                    t.strictSame(a.hasChildNodes(), false);
                    t.strictSame(fA.childNodes.length, fB.childNodes.length);
                    t.strictSame(fA.hasChildNodes(), fB.childNodes.length > 0);
                    checkNode(t, fA);
                    CI && checkNode(t, fB);

                    a.appendChild(fA);
                    b.appendChild(fB);
                    t.strictSame(a.hasChildNodes(), B.length > 0, a.outerHTML);
                    // t.strictSame(a.outerHTML, outerHTMLB);
                     // t.ok(a.isEqualNode(b));

                    t.strictSame(fA.hasChildNodes(), false);
                }
                if (nt === 1 || nt == 11) {
                    const n = a.childNodes.length;
                    for (i = n; i-- > 0; ) {
                        a.lastChild.after(a.firstChild);
                        b.lastChild.after(b.firstChild);
                        // t.strictSame(a.outerHTML, b.outerHTML, `${i}/${n} `, [
                        //     outerHTMLB,
                        // ]);
                        // if (i === 0) {
                        //     t.strictSame(outerHTMLB, b.outerHTML);
                        //     t.strictSame(outerHTMLA, a.outerHTML);
                        // } else {
                        //     t.strictNotSame(outerHTMLB, b.outerHTML);
                        //     t.strictNotSame(outerHTMLA, a.outerHTML);
                        // }
                    }
                    // t.strictSame(b.outerHTML, outerHTMLB);
                    // t.strictSame(a.outerHTML, outerHTMLB);
                }
                if (nt === 1 || nt == 11) {
                    const n = a.childNodes.length;
                    for (i = n; i-- > 0; ) {
                        const extra = [outerHTMLB];
                        a.firstChild.before(a.lastChild);
                        b.firstChild.before(b.lastChild);
                        // t.strictSame(
                        //     a.outerHTML,
                        //     b.outerHTML,
                        //     `${i}/${n}`,
                        //     extra
                        // );
                        // if (i === 0) {
                        //     t.strictSame(
                        //         outerHTMLB,
                        //         b.outerHTML,
                        //         `${i}/${n}`,
                        //         extra
                        //     );
                        //     t.strictSame(
                        //         outerHTMLA,
                        //         a.outerHTML,
                        //         `${i}/${n}`,
                        //         extra
                        //     );
                        // } else {
                        //     t.strictNotSame(
                        //         outerHTMLB,
                        //         b.outerHTML,
                        //         `${i}/${n}`,
                        //         extra
                        //     );
                        //     t.strictNotSame(
                        //         outerHTMLA,
                        //         a.outerHTML,
                        //         `${i}/${n}`,
                        //         extra
                        //     );
                        // }
                    }
                    // t.strictSame(b.outerHTML, outerHTMLB);
                    // t.strictSame(a.outerHTML, outerHTMLB);
                    // a.firstChild.replaceWith()
                    fA = a.ownerDocument.createDocumentFragment();
                    t.strictSame(a.childNodes.length, nA);
                    t.strictSame(fA.childNodes.length, 0);
                    fA.append(...a.childNodes);
                    t.strictSame(a.childNodes.length, 0, `${a.nodeName} ${a.hasChildNodes()}`);
                    t.strictSame(fA.childNodes.length, nA);
                    // console.error("a.outerHTML", a.outerHTML);
                    // console.error("fA.innerHTML", fA.innerHTML);
                    a.replaceChildren(fA);
                    // t.strictSame(a.outerHTML, outerHTMLB);

                    // a.replaceWith(.createComment("COMMENT"));
                }

                if (a.parentNode) {
                    i = A.length;
                    const rep = a.ownerDocument.createComment("COMMENT");
                    while (i-- > 0) {
                        const no = A[i];

                        t.notOk(rep.parentNode);
                        t.ok(no.parentNode);
                        t.strictSame(no.parentNode, a);
                        no.parentNode === a || t.fail("");
                        // console.error(`NPA${i}`, [
                        //     no.parentNode === a,
                        //     no.parentNode,
                        //     a,
                        // ]);
                        t.strictNotSame(no.parentNode, null);
                        t.strictNotSame(no.parentNode, "null");
                        // console.error('A', no.parentNode && no.parentNode.nodeName)
                        // console.error(`NP${i}`, no.parentNode);
                        no.replaceWith(rep);
                        // console.error("PN", rep.parentNode);

                        // console.error('B', rep.parentNode && rep.parentNode.nodeName)
                        t.match(a.outerHTML || "err", /COMMENT/g);
                        t.strictNotSame(a.outerHTML, outerHTMLB);
                        t.strictSame(rep.parentNode, a);
                        t.strictNotSame(rep.parentNode, null);
                        t.notOk(no.parentNode);
                        t.ok(rep.parentNode);
                        // console.error("rep", rep.nodeName, rep.parentNode);
                        a.replaceChild(no, rep);
                        // t.strictSame(a.outerHTML, outerHTMLB);
                        t.strictSame(no.parentNode, a);
                        t.notOk(rep.parentNode);
                    }
                }
                ///////
                if (a.parentNode) {
                    fA = a.ownerDocument.createDocumentFragment();
                    fB = b.ownerDocument.createDocumentFragment();
                    t.strictSame(a.childNodes.length, nB);
                    fA.append(...a.childNodes);
                    fB.append(...b.childNodes);
                    t.strictSame(a.childNodes.length, 0);
                    t.strictSame(b.childNodes.length, 0);
                    t.strictSame(fA.childNodes.length, nA);
                    t.strictSame(fB.childNodes.length, nB);
                    a.replaceChildren(
                        "APLHA",
                        a.ownerDocument.createComment("BETA")
                    );
                    b.replaceChildren(
                        "APLHA",
                        b.ownerDocument.createComment("BETA")
                    );
                    // t.strictSame(a.outerHTML, b.outerHTML);
                    // t.strictSame(a.innerHTML, b.innerHTML);
                    // t.strictNotSame(outerHTMLB, b.outerHTML);
                    // t.strictNotSame(outerHTMLA, a.outerHTML);
                    a.replaceChildren();
                    b.replaceChildren();
                    a.prepend(fA);
                    b.prepend(fB);
                    // while (fB.firstChild) b.appendChild(fB.firstChild);
                    t.strictSame(a.childNodes.length, nA);
                    t.strictSame(b.childNodes.length, nB);
                    // t.strictSame(b.outerHTML, outerHTMLB);
                    // t.strictSame(a.outerHTML, outerHTMLB);
                }

                //
                if (nt === 9) {
                    fA = a.createDocumentFragment();
                    fB = b.createDocumentFragment();
                } else {
                    fA = a.ownerDocument.createDocumentFragment();
                    fB = b.ownerDocument.createDocumentFragment();
                }
                for (i = A.length; i-- > 0; ) {
                    const childA = a.removeChild(A[i]);
                    const childB = b.removeChild(B[i]);

                    t.strictSame(childA, A[i], `removeChild ${aN}`);
                    t.notOk(A[i].parentNode, `removeChild parentNode ${aN}`);
                    t.notOk(A[i].nextSibling, `removeChild nextSibling ${aN}`);
                    t.notOk(
                        A[i].previousSibling,
                        `removeChild previousSibling ${aN}`
                    );
                    fA.prepend(childA);
                    fB.prepend(childB);
                }
                a.prepend(fA);
                b.prepend(fB);

                // t.strictSame(b.outerHTML, outerHTMLB);
                // t.strictSame(a.outerHTML, outerHTMLA);
            }
            break;
        case 3: // TEXT_NODE (3);
        case 4: // CDATA_SECTION_NODE (4);
        case 8: // COMMENT_NODE (8);
            break;

        case 2: // ATTRIBUTE_NODE (2);
            break;
        case 7: // PROCESSING_INSTRUCTION_NODE (7);
            break;

        default:
            throw new Error(`Unexpected nodeType=${b.nodeType} ${aN}`);
    }
}

// function outerXML(s){
//     new JSDOM(xml, {
//         url: "https://example.org/",
//         referrer: "https://example.com/",
//         contentType: "text/xml",
//     }).window.document;
// }
// var c14n = require("xml-c14n")();

test.test(`compareNode`, { bail: !CI }, function (t) {
    const parser = new DOMParser();

    const doc1 = new JSDOM(xml, {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/xml",
    }).window.document;
    const doc2 = parser.parseFromString(xml);

    checkNode(t, doc2);
    CI && checkNode(t, doc1);

    compareNode(t, doc2, doc1);

    console.error("XML:", xml)

    t.end();
});
