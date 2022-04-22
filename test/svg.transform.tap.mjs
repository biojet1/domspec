import tap from 'tap';
import {
    Document,
    SVGDocument
} from '../dist/document.js';
import {
    ParentNode
} from '../dist/parent-node.js';
import {
    DOMParser
} from '../dist/dom-parse.js';
import {
    SVGLength
} from '../dist/svg/element.js';
import {
    Path,
    Matrix,
    MatrixInterpolate
} from 'svggeom';
const parser = new DOMParser();
tap.test('transform', function(t) {
    const doc = parser.parseFromString(`
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
    const top = doc.documentElement;
    const R1 = doc.getElementById('R1');
    const R2 = doc.getElementById('R2');
    const R3 = doc.getElementById('R3');
    const R4 = doc.getElementById('R4');
    const G1 = doc.getElementById('G1');
    const G2 = doc.getElementById('G2');
    const G3 = doc.getElementById('G3');
    const G4 = doc.getElementById('G4');
    [
        // ['defs13', 0, 0, 0, 0],
        // ['R3X', 0, 0, 110, 210],
        ['G1', -50, 60, 160, 260],
        ['G2', -50, -40, 160, 260],
        ['G3', -50, -40, 160, 260],
        ['G4', 0, 10, 110, 210],
        ['R1', 10, 20, 100, 200],
        ['R2', 10, 20, 100, 200],
        ['R3', 10, 20, 100, 200],
        // ['R4', 10, 20, 100, 200],
    ].forEach(([id, x, y, w, h]) => {
        const v = doc.getElementById(id);
        const r = v.objectBBox();
        t.same(r.toArray(), [x, y, w, h], `getBBox ${id}`);
    });
    // for (const g of [G1, G2, G3]) {
    //     t.same(g.getBBox().toArray(), [50, 60, 160, 260], `${g.id} getBBox`);
    // }
    // t.same(G4.getBBox().toArray(), [50, 60, 110, 210]);
    // t.same(R1.getBBox().toArray(), [10 + 50, 20 + 50, 100, 200]);
    // t.same(R2.getBBox().toArray(), [10 + 50 - 10, 20 + 50 - 10, 100, 200]);
    // t.same(R3.getBBox().toArray(), [10 + 100, 20 + 100, 100, 200]);
    // t.same(R4.getBBox().toArray(), [10 + 100 - 10, 20 + 100 - 10, 100, 200]);
    t.same(R3.parentCTM().describe(), Matrix.translate(100, 100).describe());
    t.same(R3.myCTM().describe(), Matrix.translate(100, 100).describe());
    t.same(R4.parentCTM().describe(), Matrix.translate(100, 100).describe());
    t.same(R4.myCTM().describe(), Matrix.translate(90, 90).describe());
    // t.same(R4.myCTM().describe(), Matrix.translate(90, 90).describe());
    // console.log(R3.myCTM());
    // console.log("R3p", R3.parentCTM().describe());
    // console.log("R3t", R3.myCTM().describe());
    // console.log("R4t", R3.myCTM().describe());
    // console.log("R3i", R3.myCTM().inverse().describe());
    // const { translate, seq } = MatrixInterpolate;
    // const tr = seq(translate(-100, 0));
    // let m, n;
    // const R4CTM = R4.myCTM();
    // const R4STM = R4.transforM;
    // const R4PTM = R4.parentCTM();
    // m = tr.at(1);
    // n = tr.at(1, R4PTM.inverse());
    // console.log("m", m.describe());
    // console.log("N", tr.at(1, R4PTM.inverse()).describe());
    // console.log("N", tr.at(1, R4CTM.inverse()).describe());
    // console.log("N", tr.at(1, R4CTM.inverse()).multiply(R4PTM).describe());
    // console.log("N", tr.at(1, R4CTM.inverse()).postMultiply(R4PTM).describe());
    // console.log("X", tr.at(1, R4PTM.inverse()).multiply(R4CTM).describe());
    // console.log("N", tr.at(1, R4PTM.inverse()).postMultiply(R4CTM).describe());
    t.end();
});
import fs from 'fs';

function closeEnough(a, b, threshold = 1e-6) {
    return Math.abs(b - a) <= threshold;
}
tap.test('viewportTM', function(t) {
    const doc = parser.parseFromString(fs.readFileSync('test/res/preserveAspectRatio.svg', {
        encoding: 'utf-8',
    }));
    const top = doc.documentElement;
    const U1 = doc.getElementById('U1');
    const VR1 = doc.getElementById('VR1');
    const RECT = doc.getElementById('RECT');
    // console.log(U1.parentNode.viewportTM());
    // console.log("U1.getBBox()", U1.getBBox());
    // console.log(U1.parentNode.getBBox());
    t.same(top.viewportTM().toString(), Matrix.identity().toString());
    [
        ['V_A', 'xMinYMin meet', 1, 0, 0, 1, 100, 60],
        ['V_B', 'xMidYMid meet', 1, 0, 0, 1, 170, 60],
        ['V_C', 'xMaxYMax meet', 1, 0, 0, 1, 100, 130],
        ['V_D', 'xMinYMin meet', 1, 0, 0, 1, 250, 60],
        ['V_E', 'xMidYMid meet', 1, 0, 0, 1, 300, 60],
        ['V_F', 'xMaxYMax meet', 1, 0, 0, 1, 350, 60],
        ['V_G', 'xMinYMin slice', 1, 0, 0, 1, 100, 220],
        ['V_H', 'xMidYMid slice', 1, 0, 0, 1, 150, 220],
        ['V_I', 'xMaxYMax slice', 1, 0, 0, 1, 200, 220],
        ['V_J', 'xMinYMin slice', 1, 0, 0, 1, 250, 220],
        ['V_K', 'xMidYMid slice', 1, 0, 0, 1, 320, 220],
        ['V_L', 'xMaxYMax slice', 1, 0, 0, 1, 390, 220],
    ].forEach(([id, par, a, b, c, d, e, f]) => {
        const m = Matrix.new(a, b, c, d, e, f);
        const v = doc.getElementById(id);
        const u = v.myCTM();
        t.same(u.toString(), m.toString(), par);
        // console.log();
    });
    [
        ['V_A', 0.75, 0, 0, 0.75, 100, 60],
        ['V_B', 0.75, 0, 0, 0.75, 183.75, 60],
        ['V_C', 0.75, 0, 0, 0.75, 127.5, 130],
        ['V_D', 1, 0, 0, 1, 250, 60],
        ['V_E', 1, 0, 0, 1, 300, 70],
        ['V_F', 1, 0, 0, 1, 350, 80],
        ['V_G', 1.5, 0, 0, 1.5, 100, 220],
        ['V_H', 1.5, 0, 0, 1.5, 142.5, 220],
        ['V_I', 1.5, 0, 0, 1.5, 185, 220],
        ['V_J', 1.6666666269302368, 0, 0, 1.6666666269302368, 250, 220],
        ['V_K', 1.6666666269302368, 0, 0, 1.6666666269302368, 320, 201.6666717529297],
        ['V_L', 1.6666666269302368, 0, 0, 1.6666666269302368, 390, 183.33334350585938],
    ].forEach(([id, a, b, c, d, e, f]) => {
        const m = Matrix.new(a, b, c, d, e, f);
        const v = doc.getElementById(id);
        const u = v.querySelector('use');
        const w = u.myCTM();
        t.ok(v.nearestViewportElement === top);
        t.ok(v.farthestViewportElement === top);
        t.ok(u.farthestViewportElement === top);
        t.ok(u.nearestViewportElement === v);
        t.ok(w.equals(m, 1e-4), `${id} ${w} ${m}`);
        // console.log();
    });
    [
        ['V_A', 100.375, 60.375, 21.75, 29.25],
        ['V_B', 184.125, 60.375, 21.75, 29.25],
        ['V_C', 127.875, 130.375, 21.75, 29.25],
        ['V_D', 250.5, 60.5, 29, 39],
        ['V_E', 300.5, 70.5, 29, 39],
        ['V_F', 350.5, 80.5, 29, 39],
        ['V_G', 100.75, 220.75, 43.5, 58.5],
        ['V_H', 143.25, 220.75, 43.5, 58.5],
        ['V_I', 185.75, 220.75, 43.5, 58.5],
        ['V_J', 250.83333331346512, 220.83333331346512, 48.33333218097687, 64.99999845027924],
        ['V_K', 320.8333333134651, 202.5000050663948, 48.33333218097687, 64.99999845027924],
        ['V_L', 390.8333333134651, 184.1666768193245, 48.33333218097687, 64.99999845027924],
    ].forEach(([id, x, y, w, h]) => {
        const v = doc.getElementById(id);
        const u = v.querySelector('use');
        const r = u.shapeBox(true);
        t.ok(closeEnough(r.x, x), `${id} x ${x} ${r.x}`);
        t.ok(closeEnough(r.y, y, 1e-4), `${id} y ${y} ${r.y}`);
        t.ok(closeEnough(r.width, w, 1e-5), `${id} width ${w} ${r.width}`);
        t.ok(closeEnough(r.height, h, 1e-5), `${id} height ${h} ${r.height}`);
        // console.log();
    });
    [
        // ["G_B", 20.5, 40.5, 29, 39],
        // ["G_C", 10.5, 120.5, 49, 29],
        // ["G_D", 20.5, 190.5, 29, 59],
        // ["G_F", 100.375, 60.375, 49.125, 29.25],
        // ["G_G", 170.5, 60.375, 49, 29.25],
        // ["G_H", 100.5, 130.375, 49.125, 29.25],
        // ["G_J", 250.5, 60.5, 29, 59],
        // ["G_K", 300.5, 60.5, 29, 59],
        // ["G_L", 350.5, 60.5, 29, 59],
        // ["G_N", 100.5, 220.5, 43.75, 59],
        // ["G_O", 143.25, 220.5, 43.5, 59],
        // ["G_P", 185.75, 220.5, 43.75, 59],
        // ["G_11", 250.5, 220.5, 49, 65.33332824707031],
        // ["G_12", 320.5, 202.50000190734863, 49, 64.99999237060547],
        // ["G_13", 390.5, 184.16666793823242, 49, 65.33332824707031],
    ].forEach(([id, x, y, w, h]) => {
        const v = doc.getElementById(id);
        const r = v.shapeBox(true);
        t.ok(closeEnough(r.x, x), `${id} x ${x} ${r.x}`);
        t.ok(closeEnough(r.y, y, 1e-4), `${id} y ${y} ${r.y}`);
        t.ok(closeEnough(r.width, w, 1e-5), `${id} width ${w} ${r.width}`);
        t.ok(closeEnough(r.height, h, 1e-5), `${id} height ${h} ${r.height}`);
        // console.log();
    });
    const a = Array.from(doc.documentElement.querySelectorAll(`svg[preserveAspectRatio]`));
    a.forEach((v) => {
        const u = v.querySelector(`use`);
        const b = u.getBBox();
        const r = RECT.cloneNode();
        r.id = `R${v.getAttribute('preserveAspectRatio')}`;
        r.x.baseVal.value = b.x;
        r.y.baseVal.value = b.y;
        r.width.baseVal.value = b.width;
        r.height.baseVal.value = b.height;
        top.appendChild(r);
    });
    // console.log(a);
    writeFileSync(`/tmp/aspect.svg`, doc.documentElement.outerHTML);
    t.end();
});
import {
    createWriteStream,
    writeFileSync,
    WriteStream
} from 'fs';
if (0) {
    Array.from(document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)).map((v, i) => {
        v.id = `V_${(i + 10).toString(26).toUpperCase()}`;
        return (i + 10).toString(26);
    });
    Array.from(document.documentElement.querySelectorAll(`g`)).map((v, i) => {
        if (!v.id) {
            v.id = `G_${(i + 10).toString(26).toUpperCase()}`;
        }
    });
    Array.from(document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)).map((v) => {
        const p = v.getAttribute('preserveAspectRatio');
        const b = v.getBoundingClientRect();
        const m = v.getCTM();
        return [v.id, p, m.a, m.b, m.c, m.d, m.e, m.f];
    });
    Array.from(document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)).map((v) => {
        const b = v.querySelector('use').getBBox();
        return [v.id, [b.x, b.y, b.width, b.height]];
    });
    Array.from(document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)).map((v) => {
        const u = v.querySelector('use');
        const m = u.getScreenCTM();
        return [v.id, m.a, m.b, m.c, m.d, m.e, m.f];
    });
    Array.from(document.documentElement.querySelectorAll(`svg[preserveAspectRatio]`)).map((v) => {
        const u = v.querySelector('use');
        const m = u.getScreenCTM();
        const r = u.getBBox();
        const a = DOMPoint.fromPoint({
            x: r.x,
            y: r.y
        }).matrixTransform(m);
        const b = DOMPoint.fromPoint({
            x: r.x + r.width,
            y: r.y + r.height,
        }).matrixTransform(m);
        return [v.id, a.x, a.y, b.x - a.x, b.y - a.y];
    });
    document.querySelectorAll(`text`).forEach((x) => x.remove());
    Array.from(document.documentElement.querySelectorAll(`g[id]`)).filter((v) => v.id.startsWith('G_')).map((v) => {
        const m = v.getScreenCTM();
        const r = v.getBBox();
        const a = DOMPoint.fromPoint({
            x: r.x,
            y: r.y
        }).matrixTransform(m);
        const b = DOMPoint.fromPoint({
            x: r.x + r.width,
            y: r.y + r.height,
        }).matrixTransform(m);
        return [v.id, a.x, a.y, b.x - a.x, b.y - a.y];
    });
}
