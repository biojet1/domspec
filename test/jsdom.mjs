"uses strict";
// import test from "tap";
import {JSDOM} from "jsdom";
import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import { enumFlatDOM } from "../dist/element.js";

const dom = new JSDOM(
    "<?xml version='1.0' encoding='utf-8'?><html xmlns='http://www.w3.org/1999/xhtml'><head><title>T</title></head><body><CUSTOMTAG />a</body></html>",
    {
        url: "https://example.org/",
        referrer: "https://example.com/",
        contentType: "text/xml",
    }
);
const document = dom.window.document;
console.log(document.body.innerHTML);
