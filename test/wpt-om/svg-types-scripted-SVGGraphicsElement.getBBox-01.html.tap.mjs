import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>SVGGraphicsElement.prototype.getBBox</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body><div id=\"testcontainer\">\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\" visibility=\"hidden\">\n<g id=\"g1\">\n  <polygon id=\"p1\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r1\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g2\">\n  <rect id=\"r2\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n  <rect id=\"r3\" x=\"20\" y=\"20\" width=\"20\" height=\"0\" fill=\"red\"/>\n  <rect id=\"r4\" x=\"120\" y=\"20\" width=\"20\" height=\"20\" fill=\"blue\" style=\"display:none\"/>\n  <ellipse id=\"c1\" cx=\"20\" cy=\"120\" rx=\"0\" ry=\"20\" fill=\"black\"/>\n  <g>\n    <rect id=\"r5\" x=\"120\" y=\"120\" width=\"-1\" height=\"100\" fill=\"cyan\"/>\n  </g>\n</g>\n<g id=\"g3\">\n  <path id=\"p2\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r6\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n  <!-- The following path should be included in the bbox. -->\n  <path d=\"\"/>\n</g>\n<g id=\"g4\">\n  <polyline id=\"p3\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r7\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g5\">\n  <path id=\"p4\" d=\"M3\"/>\n  <rect id=\"r8\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g6\">\n  <polygon id=\"p5\" points=\"47\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r9\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g7\">\n  <polyline id=\"p6\" points=\"47\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r10\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g8\">\n  <path id=\"p7\" d=\"M40 20h0\" fill=\"none\" stroke=\"red\"/>\n  <rect id=\"r11\" x=\"50\" y=\"50\" width=\"50\" height=\"50\" fill=\"green\"/>\n</g>\n<g id=\"g9\">\n  <rect width=\"1\" height=\"1\"/>\n  <path d=\"M 0.5 0.5 0.5 0 A 0.5 0.5 0 0 1 0.9296658068966942 0.7557093943988227 z\"/>\n</g>\n<g id=\"g10\">\n  <rect id=\"r12\" x=\"5\" y=\"5\" width=\"10\" height=\"10\"/>\n  <foreignobject/>\n</g>\n<g id=\"g11\">\n  <rect id=\"r13\" x=\"5\" y=\"5\" width=\"10\" height=\"10\"/>\n  <image/>\n</g>\n</svg>\n</div>\n<div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)



const EPSILON = Math.pow(2, -24); // float epsilon

function assert_rect_approx_equals(rect, expected, epsilon) {
  assert_approx_equals(rect.x, expected.x, epsilon, "x");
  assert_approx_equals(rect.y, expected.y, epsilon, "y");
  assert_approx_equals(rect.width, expected.width, epsilon, "width");
  assert_approx_equals(rect.height, expected.height, epsilon, "height");
}

test(function() {
  assert_rect_approx_equals(document.createElementNS("http://www.w3.org/2000/svg", "rect").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on detached element");
test(function() {
  assert_rect_approx_equals(document.getElementById("p1").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on polygon with no points attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("p3").getBBox(), {"x":0, "y":0, "width":0, "height":0}, EPSILON);
}, "getBBox on polyline with no points attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("p2").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on path with no d attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("p4").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on path with no valid path segments in d attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("p5").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on polygon with no valid point in the points attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("p6").getBBox(), {"x":0, "y":0, "width":0, "height":0 }, EPSILON);
}, "getBBox on polyline with no valid point in the points attribute");
test(function() {
  assert_rect_approx_equals(document.getElementById("g1").getBBox(), document.getElementById("r1").getBBox(), EPSILON);
}, "polygon doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g1").getBBox(), document.getElementById("r2").getBBox(), EPSILON);
}, "group with hidden child");
test(function() {
  assert_rect_approx_equals(document.getElementById("g3").getBBox(), document.getElementById("r6").getBBox(), EPSILON);
}, "path doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g5").getBBox(), document.getElementById("r8").getBBox(), EPSILON);
}, "path with only invalid segments doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g4").getBBox(), document.getElementById("r7").getBBox(), EPSILON);
}, "polyline doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g6").getBBox(), document.getElementById("r9").getBBox(), EPSILON);
}, "polygon with no valid points doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g7").getBBox(), document.getElementById("r10").getBBox(), EPSILON);
}, "polyline with no valid points doesn't contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("p7").getBBox(), {"x":40, "y":20, "width":0, "height":0 }, EPSILON);
}, "getBBox on path with no height");
test(function() {
  assert_rect_approx_equals(document.getElementById("g8").getBBox(), {"x":40, "y":20, "width":60, "height":80 }, EPSILON);
}, "path with no height should contribute to parent bbox");
test(function() {
  assert_rect_approx_equals(document.getElementById("g9").getBBox(), {"x":0, "y":0, "width":1, "height":1 }, EPSILON);
}, "arc bbox should be tight");
test(function() {
  let g10 = document.getElementById("g10");
  let r12 = document.getElementById("r12");
  assert_rect_approx_equals(g10.getBBox(), r12.getBBox(), EPSILON);
}, "empty foreignObject does not contribute to parent bbox");
test(function() {
  let g11 = document.getElementById("g11");
  let r13 = document.getElementById("r13");
  assert_rect_approx_equals(g11.getBBox(), r13.getBBox(), EPSILON);
}, "empty image does not contribute to parent bbox");
