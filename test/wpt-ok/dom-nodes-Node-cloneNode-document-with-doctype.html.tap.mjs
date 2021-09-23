import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Cloning of a document with a doctype</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-node-clonenode\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#concept-node-clone\"/>\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const doctype = document.implementation.createDocumentType("name", "publicId", "systemId");
  const doc = document.implementation.createDocument("namespace", "", doctype);

  const clone = doc.cloneNode(true);

  assert_equals(clone.childNodes.length, 1, "Only one child node");
  assert_equals(clone.childNodes[0].nodeType, Node.DOCUMENT_TYPE_NODE, "Is a document fragment");
  assert_equals(clone.childNodes[0].name, "name");
  assert_equals(clone.childNodes[0].publicId, "publicId");
  assert_equals(clone.childNodes[0].systemId, "systemId");
}, "Created with the createDocument/createDocumentType");

test(() => {
  const doc = document.implementation.createHTMLDocument();

  const clone = doc.cloneNode(true);

  assert_equals(clone.childNodes.length, 2, "Two child nodes");
  assert_equals(clone.childNodes[0].nodeType, Node.DOCUMENT_TYPE_NODE, "Is a document fragment");
  assert_equals(clone.childNodes[0].name, "html");
  assert_equals(clone.childNodes[0].publicId, "");
  assert_equals(clone.childNodes[0].systemId, "");
}, "Created with the createHTMLDocument");

test(() => {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString("<!DOCTYPE html><html></html>", "text/html");

  const clone = doc.cloneNode(true);

  assert_equals(clone.childNodes.length, 2, "Two child nodes");
  assert_equals(clone.childNodes[0].nodeType, Node.DOCUMENT_TYPE_NODE, "Is a document fragment");
  assert_equals(clone.childNodes[0].name, "html");
  assert_equals(clone.childNodes[0].publicId, "");
  assert_equals(clone.childNodes[0].systemId, "");
}, "Created with DOMParser");

