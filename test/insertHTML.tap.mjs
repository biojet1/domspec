import tap from 'tap';
import { DOMParser } from '../dist/dom-parse.js';
const parser = new DOMParser();
tap.test('transform', function (t) {
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
    const R1 = document.getElementById('R1');
    const R2 = document.getElementById('R2');
    const R3 = document.getElementById('R3');
    const R4 = document.getElementById('R4');
    const G1 = document.getElementById('G1');
    const G2 = document.getElementById('G2');
    const G3 = document.getElementById('G3');
    const G4 = document.getElementById('G4');
    R4.insertAdjacentHTML('afterbegin' ,'<g xmlns="http://www.w3.org/2000/svg">svg</g>');
        // t.same(o.describe(), Matrix.translate(100).describe());
    console.log(R4.namespaceURI)
    t.same(R4.firstChild.constructor.name, 'SVGGElement')
    t.end();
});

// tap.test('use transform', async function (t) {
//     const document = await parser.parseFile(new URL('res/symbol.svg', import.meta.url));
//     const {U2, U1} = document.all;

//     t.match(U2.boundingBox(), {x: 20, y: 5, width: 10, height: 10})
//     console.log(U2._shapeBox());
//     U2.setAttribute("transform", "scale(2)translate(10,5)");
//     t.end();
// });