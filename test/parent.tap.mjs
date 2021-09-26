"uses strict";
import test from "tap";
import { Document } from "../dist/document.js";
import { DOMParser } from "../dist/dom-parse.js";

const CI = false;
const parser = new DOMParser();

test.test(`ParentNode`, { bail: !CI }, function (t) {
    const doc = parser.parseFromString("<div><br/></div>");
    const top = doc.documentElement;
    t.strictSame(top.localName, `div`);
    t.strictSame(top.firstChild.localName, `br`);
    t.strictSame(top.lastChild.localName, `br`);
    t.strictSame(top.firstChild, top.lastChild);
    t.strictSame(doc.firstChild, doc.lastChild);
    t.strictSame(top.firstElementChild, top.lastChild);
    t.strictSame(top.lastElementChild, top.firstChild);
    t.strictSame(top.firstElementChild, top.lastElementChild);
    t.strictSame(top.parentNode, doc);
    t.strictSame(top.firstElementChild.parentNode, top);
    t.strictSame(top.lastElementChild.parentNode, top);
    t.strictSame(top.firstChild.parentNode, top);
    t.strictSame(top.lastChild.parentNode, top);
    t.notOk(doc.nextSibling);
    t.notOk(doc.previousSibling);
    t.notOk(doc.parentNode);
    t.notOk(doc.parentElement);
    t.strictSame(top.lastChild.parentElement, top.firstChild.parentElement);
    t.strictSame(top.lastChild.parentNode, top.firstChild.parentNode);

    t.strictSame(doc.firstChild, top);
    t.strictSame(doc.lastChild, top);
    t.strictSame(doc.firstElementChild, top);
    t.strictSame(doc.lastElementChild, top);

    t.end();
});
