import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Matrix, Box } from "svggeom";
const parser = new DOMParser();
tap.test("transform", function (t) {
  const document = parser.parseFromString(`
<svg xmlns="http://www.w3.org/2000/svg" id="VPA" viewBox="0 0 200 100">
  <g id="G1" transform="translate(100,0)">
    <g id="G2" transform="translate(0,100)">
      <g id="G3">
        <g id="G4" transform="translate(-50,-50)">
          <rect id="R1" x="10px" y="20px" width="100px" height="200px"/>
          <rect id="R2" x="10px" y="20px" width="100px" height="200px" transform="translate(-10,-10)"/>
        </g>
        <rect id="R3" x="10px" y="20px" width="100px" height="200px"/>
        <rect id="R4" x="10px" y="20px" width="100px" height="200px" transform="translate(-10,-10)"/>
      </g>
    </g>
  </g>
</svg>
        `);
  const top = document.documentElement;
  const R1 = document.getElementById("R1");
  const R2 = document.getElementById("R2");
  const R3 = document.getElementById("R3");
  const R4 = document.getElementById("R4");
  const G1 = document.getElementById("G1");
  const G2 = document.getElementById("G2");
  const G3 = document.getElementById("G3");
  const G4 = document.getElementById("G4");
  [
    // ['defs13', 0, 0, 0, 0],
    // ['R3X', 0, 0, 110, 210],
    ["G1", -50, 60, 160, 260],
    ["G2", -50, -40, 160, 260],
    ["G3", -50, -40, 160, 260],
    ["G4", 0, 10, 110, 210],
    ["R1", 10, 20, 100, 200],
    ["R2", 10, 20, 100, 200],
    ["R3", 10, 20, 100, 200],
    // ['R4', 10, 20, 100, 200],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const r = v.objectBBox();
    t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
  });
  let [p, o] = R3.pairTM();
  t.same(p.describe(), Matrix.translate(100, 100).describe());
  t.same(R3.rootTM.describe(), Matrix.translate(100, 100).describe());
  t.same(R4.pairTM()[0].describe(), Matrix.translate(100, 100).describe());
  t.same(R4.rootTM.describe(), Matrix.translate(90, 90).describe());
  [p, o] = top.pairTM();
  t.same(p.describe(), Matrix.identity().describe());
  t.same(o.describe(), Matrix.identity().describe());
  [p, o] = G1.pairTM();
  t.same(p.describe(), Matrix.identity().describe());
  t.same(o.describe(), Matrix.translate(100).describe());
  t.end();
});
import fs from "fs";

function closeEnough(a, b, threshold = 1e-6) {
  return Math.abs(b - a) <= threshold;
}
tap.test("viewportTM", function (t) {
  function eqBox(a, b, epsilon = 0, tag) {
    t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
  }
  const document = parser.parseFromString(
    fs.readFileSync("test/res/preserveAspectRatio.svg", {
      encoding: "utf-8",
    })
  );
  const top = document.documentElement;
  const U1 = document.getElementById("U1");
  const VR1 = document.getElementById("VR1");
  const RECT = document.getElementById("RECT");
  const G_F = document.getElementById("G_F");
  document.querySelectorAll(`text`).forEach((x) => x.remove());

  t.same(top.viewportTM().toString(), Matrix.identity().toString());
  [
    ["V_A", "xMinYMin meet", 1, 0, 0, 1, 100, 60],
    ["V_B", "xMidYMid meet", 1, 0, 0, 1, 170, 60],
    ["V_C", "xMaxYMax meet", 1, 0, 0, 1, 100, 130],
    ["V_D", "xMinYMin meet", 1, 0, 0, 1, 250, 60],
    ["V_E", "xMidYMid meet", 1, 0, 0, 1, 300, 60],
    ["V_F", "xMaxYMax meet", 1, 0, 0, 1, 350, 60],
    ["V_G", "xMinYMin slice", 1, 0, 0, 1, 100, 220],
    ["V_H", "xMidYMid slice", 1, 0, 0, 1, 150, 220],
    ["V_I", "xMaxYMax slice", 1, 0, 0, 1, 200, 220],
    ["V_J", "xMinYMin slice", 1, 0, 0, 1, 250, 220],
    ["V_K", "xMidYMid slice", 1, 0, 0, 1, 320, 220],
    ["V_L", "xMaxYMax slice", 1, 0, 0, 1, 390, 220],
  ].forEach(([id, par, a, b, c, d, e, f]) => {
    const m = Matrix.new(a, b, c, d, e, f);
    const v = document.getElementById(id);
    const r = v.rootTM;
    t.same(r.toString(), m.toString(), par);
    // console.log();
  });
  [
    ["V_A", 0.75, 0, 0, 0.75, 100, 60],
    ["V_B", 0.75, 0, 0, 0.75, 183.75, 60],
    ["V_C", 0.75, 0, 0, 0.75, 127.5, 130],
    ["V_D", 1, 0, 0, 1, 250, 60],
    ["V_E", 1, 0, 0, 1, 300, 70],
    ["V_F", 1, 0, 0, 1, 350, 80],
    ["V_G", 1.5, 0, 0, 1.5, 100, 220],
    ["V_H", 1.5, 0, 0, 1.5, 142.5, 220],
    ["V_I", 1.5, 0, 0, 1.5, 185, 220],
    ["V_J", 1.6666666269302368, 0, 0, 1.6666666269302368, 250, 220],
    [
      "V_K",
      1.6666666269302368,
      0,
      0,
      1.6666666269302368,
      320,
      201.6666717529297,
    ],
    [
      "V_L",
      1.6666666269302368,
      0,
      0,
      1.6666666269302368,
      390,
      183.33334350585938,
    ],
  ].forEach(([id, a, b, c, d, e, f]) => {
    const m = Matrix.new(a, b, c, d, e, f);
    const v = document.getElementById(id);
    const u = v.querySelector("use");
    const r = v.rootTM;
    t.ok(v.nearestViewportElement === top);
    t.ok(v.farthestViewportElement === top);
    t.ok(u.farthestViewportElement === top);
    t.ok(u.nearestViewportElement === v);
    const x = r.cat(v.viewportTM());
    t.ok(x.equals(m, 1e-4), `${id} ${r} ${m}`);
    // console.log();
  });
  [
    ["V_A", 100.375, 60.375, 21.75, 29.25],
    ["V_B", 184.125, 60.375, 21.75, 29.25],
    ["V_C", 127.875, 130.375, 21.75, 29.25],
    ["V_D", 250.5, 60.5, 29, 39],
    ["V_E", 300.5, 70.5, 29, 39],
    ["V_F", 350.5, 80.5, 29, 39],
    ["V_G", 100.75, 220.75, 43.5, 58.5],
    ["V_H", 143.25, 220.75, 43.5, 58.5],
    ["V_I", 185.75, 220.75, 43.5, 58.5],
    [
      "V_J",
      250.83333331346512,
      220.83333331346512,
      48.33333218097687,
      64.99999845027924,
    ],
    [
      "V_K",
      320.8333333134651,
      202.5000050663948,
      48.33333218097687,
      64.99999845027924,
    ],
    [
      "V_L",
      390.8333333134651,
      184.1666768193245,
      48.33333218097687,
      64.99999845027924,
    ],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const u = v.querySelector("use");
    // const r = u.shapeBox(true);
    const b = Box.new(x, y, w, h);
    // eqBox(b, r, 2e-5, id);
    eqBox(b, u._shapeBox(), 2e-5, id);
  });

  [
    ["V_A", [100, 60, 50, 30]],
    ["V_B", [170, 60, 50, 30]],
    ["V_C", [100, 130, 50, 30]],
    ["V_D", [250, 60, 30, 60]],
    ["V_E", [300, 60, 30, 60]],
    ["V_F", [350, 60, 30, 60]],
    ["V_G", [100, 220, 30, 60]],
    ["V_H", [150, 220, 30, 60]],
    ["V_I", [200, 220, 30, 60]],
    ["V_J", [250, 220, 50, 30]],
    ["V_K", [320, 220, 50, 30]],
    ["V_L", [390, 220, 50, 30]],
  ].forEach(([id, [x, y, w, h]]) => {
    const v = document.getElementById(id);
    const b = Box.new(x, y, w, h);
    // eqBox(b, v.shapeBox(true), 2e-5, `v:shapeBox ${id}`);
    eqBox(b, v._shapeBox(), 2e-5, `v:_shapeBox ${id}`);
  });

  [
    ["G_B", 20.5, 40.5, 29, 39],
    ["G_C", 10.5, 120.5, 49, 29],
    ["G_D", 20.5, 190.5, 29, 59],
    ["G_F", 100, 60, 49.5, 29.5],
    ["G_G", 170.5, 60, 50.75, 29.5],
    // ['G_H', 100.5, 130, 64.5, 29.5],
    // ['G_J', 250, 60, 30, 60],
    // ['G_K', 300, 60.5, 30, 69.5],
    // ['G_L', 350, 60.5, 30, 79.5],
    // ['G_N', 100, 220, 45, 90],
    // ['G_O', 142.5, 220, 45, 90],
    // ['G_P', 185, 220, 45, 90],
    // ['G_11', 250, 220, 83.33332824707031, 50],
    // ['G_12', 320, 201.6666717529297, 83.33332824707031, 50.01666259765625],
    // ['G_13', 390, 183.3333282470703, 83.33332824707031, 66.16667175292969],
  ].forEach(([id, x, y, w, h]) => {
    const v = document.getElementById(id);
    const b = Box.new(x, y, w, h);
    eqBox(b, v._shapeBox(), 1, `_shapeBox ${id}`);
  });

  const a = Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  );
  a.forEach((v) => {
    // const u = v.querySelector(`use`);
    const u = v.parentNode;
    // const b = u.getBBox();
    const b = u._shapeBox();
    const r = RECT.cloneNode();
    r.setAttribute("stroke-width", "3");
    r.setAttribute("stroke", "khaki");
    r.style.opacity = "";
    r.id = `R${v.getAttribute("preserveAspectRatio")}`;
    r.x.baseVal.value = b.x;
    r.y.baseVal.value = b.y;
    r.rx.baseVal.value = Math.min(b.width, b.height) / 4;
    r.width.baseVal.value = b.width;
    r.height.baseVal.value = b.height;
    top.appendChild(r);
  });
  Array.from(document.documentElement.querySelectorAll(`g[id]`))
    .filter((v) => v?.id.startsWith("meet") || v?.id.startsWith("slice"))
    .forEach((v) => {
      // const b = u.getBBox();
      const b = v._shapeBox();
      const r = RECT.cloneNode();
      r.setAttribute("stroke-width", "3");
      r.style.opacity = "";
      r.style.stroke = "yellow";
      r.id = `R${v.id}`;
      r.x.baseVal.value = b.x;
      r.y.baseVal.value = b.y;
      r.rx.baseVal.value = Math.min(b.width, b.height) / 4;
      r.width.baseVal.value = b.width;
      r.height.baseVal.value = b.height;
      top.appendChild(r);
    }); // console.log(a);

  [
    ["smile", 1, 0, 0, 1, 0, 0],
    ["G_B", 1, 0, 0, 1, 20, 40],
    ["G_C", 1, 0, 0, 1, 10, 120],
    ["G_D", 1, 0, 0, 1, 20, 190],
    ["meet-group-1", 1, 0, 0, 1, 100, 60],
    ["G_F", 1, 0, 0, 1, 100, 60],
    ["V_A", 1, 0, 0, 1, 100, 60],
    ["G_G", 1, 0, 0, 1, 170, 60],
    ["V_B", 1, 0, 0, 1, 170, 60],
    ["G_H", 1, 0, 0, 1, 100, 130],
    ["V_C", 1, 0, 0, 1, 100, 130],
    ["meet-group-2", 1, 0, 0, 1, 250, 60],
    ["G_J", 1, 0, 0, 1, 250, 60],
    ["V_D", 1, 0, 0, 1, 250, 60],
    ["G_K", 1, 0, 0, 1, 300, 60],
    ["V_E", 1, 0, 0, 1, 300, 60],
    ["G_L", 1, 0, 0, 1, 350, 60],
    ["V_F", 1, 0, 0, 1, 350, 60],
    ["slice-group-1", 1, 0, 0, 1, 100, 220],
    ["G_N", 1, 0, 0, 1, 100, 220],
    ["V_G", 1, 0, 0, 1, 100, 220],
    ["G_O", 1, 0, 0, 1, 150, 220],
    ["V_H", 1, 0, 0, 1, 150, 220],
    ["G_P", 1, 0, 0, 1, 200, 220],
    ["V_I", 1, 0, 0, 1, 200, 220],
    ["slice-group-2", 1, 0, 0, 1, 250, 220],
    ["G_11", 1, 0, 0, 1, 250, 220],
    ["V_J", 1, 0, 0, 1, 250, 220],
    ["G_12", 1, 0, 0, 1, 320, 220],
    ["V_K", 1, 0, 0, 1, 320, 220],
    ["G_13", 1, 0, 0, 1, 390, 220],
    ["R1", 1, 0, 0, 1, 390, 220],
    ["V_L", 1, 0, 0, 1, 390, 220],
    [
      "U1",
      1.6666666269302368,
      0,
      0,
      1.6666666269302368,
      390,
      183.33334350585938,
    ],
    ["RECT", 1, 0, 0, 1, 0, 0],
  ].forEach(([id, a, b, c, d, e, f]) => {
    const v = document.getElementById(id);
    const m = Matrix.new(a, b, c, d, e, f);
    const r = v.rootTM;
    t.ok(m.equals(r, 1e-4), `${id} ${r} ${m}`);
  });

  writeFileSync(`/tmp/aspect.svg`, document.documentElement.outerHTML);
  t.end();
});
import { createWriteStream, writeFileSync, WriteStream } from "fs";
if (0) {
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v, i) => {
    v.id = `V_${(i + 10).toString(26).toUpperCase()}`;
    return (i + 10).toString(26);
  });
  Array.from(document.documentElement.querySelectorAll(`g`)).map((v, i) => {
    if (!v.id) {
      v.id = `G_${(i + 10).toString(26).toUpperCase()}`;
    }
  });
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v) => {
    const p = v.getAttribute("preserveAspectRatio");
    const b = v.getBoundingClientRect();
    const m = v.getCTM();
    return [v.id, p, m.a, m.b, m.c, m.d, m.e, m.f];
  });
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v) => {
    const b = v.querySelector("use").getBBox();
    return [v.id, [b.x, b.y, b.width, b.height]];
  });
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v) => {
    const u = v.querySelector("use");
    const m = u.getScreenCTM();
    return [v.id, m.a, m.b, m.c, m.d, m.e, m.f];
  });
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v) => {
    const b = v.getBoundingClientRect();
    return [v.id, [b.x, b.y, b.width, b.height]];
  });
  Array.from(
    document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)
  ).map((v) => {
    const u = v.querySelector("use");
    const m = u.getScreenCTM();
    const r = u.getBBox();
    const a = DOMPoint.fromPoint({
      x: r.x,
      y: r.y,
    }).matrixTransform(m);
    const b = DOMPoint.fromPoint({
      x: r.x + r.width,
      y: r.y + r.height,
    }).matrixTransform(m);
    return [v.id, a.x, a.y, b.x - a.x, b.y - a.y];
  });
  Array.from(document.documentElement.querySelectorAll(`g[id]`))
    .filter((v) => v.id.startsWith("G_"))
    .map((v) => {
      const m = v.getScreenCTM();
      const r = v.getBBox();
      const a = DOMPoint.fromPoint({
        x: r.x,
        y: r.y,
      }).matrixTransform(m);
      const b = DOMPoint.fromPoint({
        x: r.x + r.width,
        y: r.y + r.height,
      }).matrixTransform(m);
      v.setAttribute("bbox", `${r.x},${r.y} ${r.width}x${r.height}`);
      return [v.id, a.x, a.y, b.x - a.x, b.y - a.y];
    });
  Array.from(document.documentElement.querySelectorAll(`g[id]`))
    .filter((v) => v.id.startsWith("G_"))
    .map((v) => {
      const r = v.getBoundingClientRect();
      return [v.id, r.x, r.y, r.width, r.height];
    });
  Array.from(document.documentElement.querySelectorAll(`*`)).map((v) => {
    const r = v.getBoundingClientRect();
    v.setAttribute("bcr", `${r.x},${r.y} ${r.width}x${r.height}`);
    return [v.id, r.x, r.y, r.width, r.height];
  });
  Array.from(document.documentElement.querySelectorAll(`svg`)).map((v) => {
    const r = v.getBBox();
    v.setAttribute("bbox", `${r.x},${r.y} ${r.width}x${r.height}`);
  });
  for (const tag of ["svg", "rect", "g", "use"]) {
    document.documentElement.querySelectorAll(tag).forEach((v) => {
      const r = v.getBBox();
      const m = v.getCTM();
      v.setAttribute("bbox", `${r.x},${r.y} ${r.width}x${r.height}`);
      v.setAttribute("ctm", `${[m.a, m.b, m.c, m.d, m.e, m.f]}`);
    });
  }
  document.querySelectorAll(`text`).forEach((x) => x.remove());
  ["path", "rect", "circle"].forEach((tag) => {
    document.documentElement.querySelectorAll(tag).forEach((v) => {
      v.style.stroke = "none";
      v.removeAttribute("stroke-width");
      v.removeAttribute("stroke");
    });
  });
}
