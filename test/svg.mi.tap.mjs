import fs from 'fs';
import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Box, MatrixInterpolate, Matrix } from 'svggeom';
import { createWriteStream, writeFileSync, WriteStream } from 'fs';
const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
    t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
    t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

tap.test('Mi', function (t) {
    const document = parser.parseFromString(
        fs.readFileSync('test/res/mi.svg', {
            encoding: 'utf-8',
        })
    );
    const svg = document.documentElement;
    const A = document.getElementById('A');
    const B = document.getElementById('B');
    const C = document.getElementById('C');
    const eq1 = document.getElementById('eq1');
    for (const v of [A, B, C]) {
        v.style.display = '';
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.defs().appendChild(g);
    g.innerHTML = `<circle cx="0" cy="0" r="4" stlye="fill:#0d6efd;stroke:none"/>
<rect style="opacity:0.5;fill:#f1caff;stroke:none;" width="192" height="108" x="520" y="480"/>
    `;
    let c;
    let cens = [A, B, C];
    for (const v of [A, B, C]) {
        svg.appendChild((c = g.firstChild.cloneNode()));
        let { x, y } = v.boundingBox().center;
        c.cx.baseVal.value = x;
        c.cy.baseVal.value = y;
    }
    for (const v of eq1.children) {
        svg.appendChild((c = g.children[1].cloneNode()));
        let { x, y, width, height } = v.boundingBox();
        c.x.baseVal.value = x;
        c.y.baseVal.value = y;
        c.width.baseVal.value = width;
        c.height.baseVal.value = height;
    }
    {
        const [c, c2, equals, a, a2, plus, b, b2] = eq1.children;

        [
            [c, c2, C],
            [a, a2, A],
            [b, b2, B],
        ].forEach(([u, w, S], i, a) => {
            let b = u._boundingBox().merge(w._boundingBox());

            // let { x, y, width, height, center } = v.boundingBox();
            // let t = MatrixInterpolate.parse({ translate: [200, 200] });
            // let t = MatrixInterpolate.parse({ translate: A.boundingBox().center.sub(center) });
             
            console.log(S.id, S._boundingBox().center.sub(b.center), b);

            let t = MatrixInterpolate.parse([
                { translate: S._boundingBox().center.sub(b.center), weight: 2 },
                {
                    scale: 10,
                    anchor: b.center,
                },
            ]);
            for (const v of [u, w]) {
                let M = t.at(1, Matrix.identity());
                let [p, m] = v.splitTM();
                // console.log(p, m, M);
                v.ownTM = p.inverse().multiply(M).multiply(p);
            }
        });
    }

    // Array.from(eq1.children).forEach((v, i, a) => {
    //     let { x, y, width, height, center } = v.boundingBox();

    //     // let t = MatrixInterpolate.parse({ translate: [200, 200] });
    //     // let t = MatrixInterpolate.parse({ translate: A.boundingBox().center.sub(center) });
    //     let t = MatrixInterpolate.parse([
    //         { translate: A.boundingBox().center.sub(center), weight: 2 },
    //         {
    //             scale: 4,
    //             anchor: center,
    //         },
    //     ]);
    //     // let t = MatrixInterpolate.parse({
    //     //     par: [{ translate: [200, 200] }, { anchor: cens[i%3].boundingBox().center, scale: 2 }],
    //     // });

    //     let M = t.at(1, Matrix.identity());
    //     let [p, m] = v.splitTM();
    //     // console.log(p, m, M);
    //     v.ownTM = p.inverse().multiply(M).multiply(p);
    // });

    writeFileSync(`/tmp/mi.svg`, document.documentElement.outerHTML);

    t.end();
});
if (0) {
    Array.from(document.documentElement.querySelectorAll(`*[id]`)).map((v) => {
        const r = v.getBoundingClientRect();
        v.setAttribute('bcr', `${r.x},${r.y} ${r.width}x${r.height}`);
        return [v.id, r.x, r.y, r.width, r.height];
    });
    Array.from(document.documentElement.querySelectorAll(`circle[id]`)).map((v) => {
        const r = v.getBoundingClientRect();
        const a = [v.r.baseVal.value, v.cx.baseVal.value, v.cy.baseVal.value];
        v.setAttribute('geom', `${a[0]} ${a[1]},${a[2]}`);
        return [v.id, ...a];
    });
    Array.from(document.documentElement.querySelectorAll(`rect[id], svg[id]`)).map((v) => {
        const r = v.getBoundingClientRect();
        const a = [v.x.baseVal.value, v.y.baseVal.value, v.width.baseVal.value, v.height.baseVal.value];
        v.setAttribute('geom', `${a[0]},${a[1]} ${a[2]}x${a[3]}`);
        return [v.id, ...a];
    });
}
