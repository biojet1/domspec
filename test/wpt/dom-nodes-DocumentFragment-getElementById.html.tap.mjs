import "./wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>DocumentFragment.prototype.getElementById</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid\"/>\n<link rel=\"author\" title=\"Domenic Denicola\" href=\"mailto:d@domenic.me\"/>\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<template>\n  <div id=\"bar\">\n    <span id=\"foo\" data-yes=\"\"/>\n  </div>\n  <div id=\"foo\">\n    <span id=\"foo\"/>\n    <ul id=\"bar\">\n      <li id=\"foo\"/>\n    </ul>\n  </div>\n</template>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  assert_equals(typeof DocumentFragment.prototype.getElementById, "function", "It must exist on the prototype");
  assert_equals(typeof document.createDocumentFragment().getElementById, "function", "It must exist on an instance");
}, "The method must exist");

test(() => {
  assert_equals(document.createDocumentFragment().getElementById("foo"), null);
  assert_equals(document.createDocumentFragment().getElementById(""), null);
}, "It must return null when there are no matches");

test(() => {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createElement("div"));
  frag.appendChild(document.createElement("span"));
  frag.childNodes[0].id = "foo";
  frag.childNodes[1].id = "foo";

  assert_equals(frag.getElementById("foo"), frag.childNodes[0]);
}, "It must return the first element when there are matches");

test(() => {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createElement("div"));
  frag.childNodes[0].setAttribute("id", "");

  assert_equals(
    frag.getElementById(""),
    null,
    "Even if there is an element with an empty-string ID attribute, it must not be returned"
  );
}, "Empty string ID values");

test(() => {
  const frag = document.querySelector("template").content;

  assert_true(frag.getElementById("foo").hasAttribute("data-yes"));
}, "It must return the first element when there are matches, using a template");
