import fs from "fs";
import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Box } from "svggeom";
const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
  t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
  t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

function test_circle_geom(t, document) {
  return ([id, r, cx, cy]) => {
    const v = document.getElementById(id);
    closeEnough(t, v.r.baseVal.value, r, 1e-4, `${id} r`);
    closeEnough(t, v.cx.baseVal.value, cx, 1e-6, `${id} cy`);
    closeEnough(t, v.cy.baseVal.value, cy, 1e-6, `${id} cy`);
  };
}

tap.test("Geoms 1", function (t) {
  const document = parser.parseFromString(
    fs.readFileSync("test/res/viewport.svg", {
      encoding: "utf-8",
    })
  );
  const svg = document.documentElement;
  const { V1, V3, C1, C2, C3, C4, R1, R2, R3 } = document.all;
  t.same(V1.x.baseVal.value, 200, `V1.x`);
  t.same(V1.y.baseVal.value, 0, `V1.y`);
  t.same(V1.width.baseVal.value, 100, `V1.width`);
  t.same(V1.height.baseVal.value, 400, `V1.height`);
  closeEnough(
    t,
    C1.r.baseVal.value,
    Math.sqrt((300 * 300 + 400 * 400) / 2) * 0.1,
    1e-2
  );
  t.same(C4.r.baseVal.value, 0);
  t.same(C2.r.baseVal.value, 40);
  t.same(V1._shapeBox().toArray(), [200, 0, 100, 400]);
  t.same(R3.x.baseVal.value, 5);
  t.same(R3.y.baseVal.value, 0);
  t.same(R3.width.baseVal.value, 5);
  t.same(R3.height.baseVal.value, 4);
  t.same(R1.x.baseVal.value, 0);
  t.same(R1.y.baseVal.value, 0);
  t.same(R1.width.baseVal.value, 5);
  t.same(R1.height.baseVal.value, 4);
  // // t.same(R1._shapeBox().toArray(), [200, 175, 50, 40]);
  // // t.same(R3._shapeBox().toArray(), [250, 175, 50, 40]);
  [
    ["C4", 0, 150, 192],
    ["C1", 35.355342864990234, 150, 70],
    ["C2", 40, 55, 70],
    ["C3", 4.527692794799805, 5, 4],
    ["C5", 5, 5, 5],
    ["C6", 1, 5, 5],
  ].forEach(test_circle_geom(t, document));
  [
    ["V1", 200, 0, 100, 400],
    ["R1", 0, 0, 5, 4],
    ["R3", 5, 0, 5, 4],
    ["R4", 0, 4, 5, 4],
    ["V2", 0, 200, 300, 100],
    ["V3", 0, 0, 10, 10],
    ["R5", 200, 160, 50, 40],
    ["R6", 200, 160, 50, 40],
    ["V0", 0, 0, 300, 400],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    closeEnough(t, v.x.baseVal.value, x, 1e-4, `${id} x`);
    closeEnough(t, v.y.baseVal.value, y, 1e-6, `${id} y`);
    closeEnough(t, v.width.baseVal.value, w, 1e-6, `${id} width`);
    closeEnough(t, v.height.baseVal.value, h, 1e-6, `${id} height`);
  });
  [
    ["C4", 0, 0, 0, 0],
    ["C1", 114.61666870117188, 34.633331298828125, 70.76666259765625, 70.75],
    ["C2", 15, 30, 80, 80],
    ["V1", 200, 0, 100, 400],
    [
      "C3",
      204.6666717529297,
      154.6666717529297,
      90.66665649414062,
      90.66665649414062,
    ],
    ["R1", 200, 160, 50, 40],
    ["R3", 250, 160, 50, 40],
    ["R4", 200, 200, 50, 40],
    ["V2", 0, 200, 300, 100],
    ["C5", 100, 200, 100, 100],
    ["V3", 100, 200, 100, 100],
    ["L1", 100, 225, 50, 50],
    ["R5", 200, 160, 50, 40],
    ["R6", 250, 200, 50, 40],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const b = Box.new(x, y, w, h);
    const r = v._shapeBox();
    eqBox(t, b, r.isValid() ? r : Box.empty(), x - ~~x === 0 ? 1e-9 : 1, id);
  });
  const R5 = document.getElementById("R5");
  const [p, m] = V1.pairTM();

  // console.log(R5._shapeBox().transform(V1.rootTM.cat(V1.innerTM).inverse()));
  // console.log(R5._shapeBox().transform(p.cat(V1.innerTM).inverse()));
  // console.log(p.cat(V1.innerTM).inverse());
  // console.log(V1.rootTM.cat(V1.innerTM).inverse());
  V1.viewBox.contain2(R5._shapeBox());
  // console.log(V1.viewBox.baseVal);
  [["L1", 0, 2.5, 5, 7.5]].forEach(([id, x1, y1, x2, y2]) => {
    const v = document.getElementById(id);
    // console.log(v.outerHTML);
    t.same(
      [
        v.x1.baseVal.value,
        v.y1.baseVal.value,
        v.x2.baseVal.value,
        v.y2.baseVal.value,
      ],
      [x1, y1, x2, y2]
    );
  });
  t.same(V3.viewBox.baseVal, null);

  t.end();
});
tap.test("Geoms 2", function (t) {
  const document = parser.parseFromString(
    fs.readFileSync("test/res/viewport2.svg", {
      encoding: "utf-8",
    })
  );
  const svg = document.documentElement;
  [
    ["R0", 0, 0, 0, 0],
    ["V4", 0, 0, 300, 400],
    ["V1", 0, 0, 80, 400],
    ["V2", 99, 0, 80, 400],
    ["V3", 0, 132, 80, 400],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    closeEnough(t, v.x.baseVal.value, x, 1e-4, `${id} x`);
    closeEnough(t, v.y.baseVal.value, y, 1e-6, `${id} y`);
    closeEnough(t, v.width.baseVal.value, w, 1e-6, `${id} width`);
    closeEnough(t, v.height.baseVal.value, h, 1e-6, `${id} height`);
  });
  [["C0", 0, 0, 0]].forEach(([id, r, cx, cy]) => {
    const v = document.getElementById(id);
    closeEnough(t, v.r.baseVal.value, r, 1e-4, `${id} r`);
    closeEnough(t, v.cx.baseVal.value, cx, 1e-6, `${id} cy`);
    closeEnough(t, v.cy.baseVal.value, cy, 1e-6, `${id} cy`);
  });
  [
    ["R0", 0, 0, 0, 0],
    ["C0", 0, 0, 0, 0],
    ["V4", 0, 0, 300, 400],
    ["V1", 0, 0, 80, 400],
    ["V2", 99, 0, 80, 400],
    ["V3", 0, 132, 80, 400],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const b = Box.new(x, y, w, h);
    if (x == 0 && y == 0 && w == 0 && h == 0) {
      const k = v._shapeBox();
      const emp = Box.forRect(0, 0, 0, 0).equals(k);
      const val = k.isValid();
      t.ok(emp || !val, `${id} ${k} ${emp} ${val}`);
      return;
    }
    eqBox(t, b, v._shapeBox(), x - ~~x === 0 ? 1e-9 : 1, id);
  });
  [
    ["V0", 0, 0, 300, 400],
    ["V4", 0, 0, 300, 400],
    ["V1", 0, 0, 80, 400],
    ["V2", 99, 0, 80, 400],
    ["V3", 0, 132, 80, 400],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const b = Box.new(x, y, w, h);
    eqBox(t, b, v.viewBox.calcBox(), 1e-9, id);
  });

  t.end();
});
if (0) {
  Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
    const r = v.getBoundingClientRect();
    v.setAttribute("bcr", `${r.x},${r.y} ${r.width}x${r.height}`);
    return [v.id, r.x, r.y, r.width, r.height];
  });
  Array.from(document.documentElement.querySelectorAll(`circle[id]`)).map(
    (v) => {
      const r = v.getBoundingClientRect();
      const a = [v.r.baseVal.value, v.cx.baseVal.value, v.cy.baseVal.value];
      v.setAttribute("geom", `${a[0]} ${a[1]},${a[2]}`);
      return [v.id, ...a];
    }
  );
  Array.from(
    document.documentElement.querySelectorAll(`rect[id], svg[id]`)
  ).map((v) => {
    const r = v.getBoundingClientRect();
    const a = [
      v.x.baseVal.value,
      v.y.baseVal.value,
      v.width.baseVal.value,
      v.height.baseVal.value,
    ];
    v.setAttribute("geom", `${a[0]},${a[1]} ${a[2]}x${a[3]}`);
    return [v.id, ...a];
  });
  ((a) => {
    window.geom_lines = a;
  })(
    Array.from(document.documentElement.querySelectorAll(`line[id]`)).map(
      (v) => {
        const [x1, y1, x2, y2] = [
          v.x1.baseVal.value,
          v.y1.baseVal.value,
          v.x2.baseVal.value,
          v.y2.baseVal.value,
        ];
        v.setAttribute("pts", `${x1},${y1} ${x2},${y2}`);
        return [v.id, x1, y1, x2, y2];
      }
    )
  );
}
