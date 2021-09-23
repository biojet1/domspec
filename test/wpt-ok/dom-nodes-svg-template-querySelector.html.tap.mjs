import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>querySelector on template fragments with SVG elements</title>\n\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n\n<template id=\"template1\"><div/></template>\n<template id=\"template2\"><svg/></template>\n<template id=\"template3\"><div><svg/></div></template>\n\n<script/>\n</head></html>"
const document = loadDOM(html, `text/html`)

"use strict";

test(() => {
  const fragment = document.querySelector("#template1").content;
  assert_not_equals(fragment.querySelector("div"), null);
}, "querySelector works on template contents fragments with HTML elements (sanity check)");

test(() => {
  const fragment = document.querySelector("#template2").content;
  assert_not_equals(fragment.querySelector("svg"), null);
}, "querySelector works on template contents fragments with SVG elements");

test(() => {
  const fragment = document.querySelector("#template3").content;
  assert_not_equals(fragment.firstChild.querySelector("svg"), null);
}, "querySelector works on template contents fragments with nested SVG elements");
