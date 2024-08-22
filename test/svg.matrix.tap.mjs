import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Matrix, BoundingBox } from "svggeom";
const parser = new DOMParser();
tap.test("transform", function (t) {
  // https://github.com/michielbdejong/gecko-dev/blob/4ca96f2eee849a7c3a7f9ad1838c95fe9b5cba2b/dom/svg/test/test_SVGMatrix.xhtml
  const document = parser.parseFromString(`
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1" id="svg">
    <g id="g" transform="translate(10, 20)"/>
  </svg> `);
  const svg = document.documentElement;

  const m = svg.createSVGMatrix();

  {
    const { a, b, c, d, e, f } = m;
    t.same(
      [a, b, c, d, e, f],
      [1, 0, 0, 1, 0, 0],
      "Should be initialised to identity"
    );
  }
  t.notStrictEqual(
    m,
    svg.createSVGMatrix(),
    "Got identical objects when creating new matrix"
  );
  function createMatrix(...nums) {
    return Matrix.fromArray(nums);
  }
  // function testMultiply()
  {
    // This is the example from SVG 1.1 section 7.5
    var m1 = createMatrix(1, 0, 0, 1, 50, 90);
    var m2 = createMatrix(0.707, -0.707, 0.707, 0.707, 0, 0);
    var m3 = createMatrix(1, 0, 0, 1, 130, 160);
    var result = m1.multiply(m2).multiply(m3);
    t.ok(
      result.equals(
        Matrix.new("matrix(0.707, -0.707, 0.707, 0.707, 255.03, 111.21)"),
        1e-5
      ),
      "Unexpected result after multiplying matrices"
    );
    t.ok(
      m1.equals(Matrix.new("matrix(1, 0, 0, 1, 50, 90)"), 1e-5),
      "Matrix changed after multiplication"
    );
    t.ok(
      m2.equals(Matrix.new("matrix(0.707, -0.707, 0.707, 0.707, 0, 0)"), 1e-5),
      "Matrix changed after multiplication"
    );
    t.ok(
      m3.equals(Matrix.new("matrix(1, 0, 0, 1, 130, 160)"), 1e-5),
      "Matrix changed after multiplication"
    );
  }

  // function testInverse()
  {
    // Test inversion
    let m = createMatrix(2, 0, 0, 4, 110, -50);
    t.ok(
      m
        .inverse()
        .equals(Matrix.new("matrix(0.5, 0, 0, 0.25, -55, 12.5)"), 1e-5),
      "Unexpected result after inverting matrix"
    );

    // Test non-invertable
    m = createMatrix(0, 0, 1, 0, 0, 0);
    t.throws(
      function () {
        m.inverse();
      },
      { message: /invert/i }
    );
  }

  t.end();
});
