import { Document } from "../dist/document.js";
import { parseDOM, DOMParser } from "../dist/dom-parse.js";
import tap from "tap";

// console.info(document.outerHTML);

let current_t = null;
function test(fn, msg) {
  tap.test(msg, function (t) {
    current_t = t;
    fn();
    t.end();
  });
}
function assert_throws_dom(what, fn) {
  (current_t || tap).throws(fn, { message: what }, what);
}
function assert_equals(a, b, msg) {
  (current_t || tap).strictSame(a, b, msg);
}
function assert_array_equals(a, b, msg) {
  (current_t || tap).match(a, b, msg);
}

function setup(x) {
}
function done() {
}




"use strict";

setup({ single_test: true });

const button = document.createElement("button");

assert_equals(button.querySelector("*"), null, "querySelector, '*', before modification");
assert_equals(button.querySelector("button"), null, "querySelector, 'button', before modification");
assert_equals(button.querySelector("button, span"), null, "querySelector, 'button, span', before modification");
assert_array_equals(button.querySelectorAll("*"), [], "querySelectorAll, '*', before modification");
assert_array_equals(button.querySelectorAll("button"), [], "querySelectorAll, 'button', before modification");
assert_array_equals(
  button.querySelectorAll("button, span"), [],
  "querySelectorAll, 'button, span', before modification"
);


button.innerHTML = "text";

assert_equals(button.querySelector("*"), null, "querySelector, '*', after modification");
assert_equals(button.querySelector("button"), null, "querySelector, 'button', after modification");
assert_equals(button.querySelector("button, span"), null, "querySelector, 'button, span', after modification");
assert_array_equals(button.querySelectorAll("*"), [], "querySelectorAll, '*', after modification");
assert_array_equals(button.querySelectorAll("button"), [], "querySelectorAll, 'button', after modification");
assert_array_equals(
  button.querySelectorAll("button, span"), [],
  "querySelectorAll, 'button, span', after modification"
);

done();