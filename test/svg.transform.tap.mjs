import tap from "tap";
import { Document, SVGDocument } from "../dist/document.js";
import { ParentNode } from "../dist/parent-node.js";
import { DOMParser } from "../dist/dom-parse.js";
import { SVGLength } from "../dist/svg/element.js";
import { Path, Matrix, MatrixInterpolate } from "svggeom";

const parser = new DOMParser();

tap.test("transform", function (t) {
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
	const R1 = doc.getElementById("R1");
	const R2 = doc.getElementById("R2");
	const R3 = doc.getElementById("R3");
	const R4 = doc.getElementById("R4");
	const G1 = doc.getElementById("G1");
	const G2 = doc.getElementById("G2");
	const G3 = doc.getElementById("G3");
	const G4 = doc.getElementById("G4");
	for (const g of [G1, G2, G3]) {
		t.same(g.getBBox().toArray(), [50, 60, 160, 260]);
	}

	t.same(G4.getBBox().toArray(), [50, 60, 110, 210]);
	t.same(R1.getBBox().toArray(), [10 + 50, 20 + 50, 100, 200]);
	t.same(R2.getBBox().toArray(), [10 + 50 - 10, 20 + 50 - 10, 100, 200]);
	t.same(R3.getBBox().toArray(), [10 + 100, 20 + 100, 100, 200]);
	t.same(R4.getBBox().toArray(), [10 + 100 - 10, 20 + 100 - 10, 100, 200]);
	// t.same(R1.ownerSVGElement.id, "VPE");
	// t.same(R1.nearestViewportElement.id, "VPE");
	// t.same(R1.farthestViewportElement.id, "VPA");
	// t.same(VPE.viewportElement.id, "VPD");
	// t.same(VPE.ownerSVGElement.id, "VPD");
	// t.same(VPE.nearestViewportElement.id, "VPD");
	// t.same(VPE.farthestViewportElement.id, "VPA");
	// t.same(VPA.farthestViewportElement, null);
	// t.same(VPA.nearestViewportElement, null);
	// t.same(VPA.ownerSVGElement, null);
	// t.same(VPA.viewportElement, null);
	// t.same(R1._isViewportElement, 0);
	t.same(R3.parentCTM().describe(), Matrix.translate(100, 100).describe());
	t.same(
		R3.myCTM().describe(),
		Matrix.translate(100, 100).describe()
	);
	t.same(R4.parentCTM().describe(), Matrix.translate(100, 100).describe());
	t.same(
		R4.myCTM().describe(),
		Matrix.translate(90, 90).describe()
	);
	// t.same(R4.myCTM().describe(), Matrix.translate(90, 90).describe());

	console.log(R3.myCTM());
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

	// console.log("m", m.multiply(R3.parentCTM().inverse()).describe());
	// console.log("m", R3.myCTM().inverse().multiply(m).describe());
	// // translate(-90 0)

	// console.log("translate(-90 0) translate(-110,-10)");
	// console.log("m", m.multiply(R4CTM.inverse()).describe());
	// console.log("m", m.multiply(R4CTM).describe());
	// console.log("m", m.multiply(R4CTM).inverse().describe());
	// console.log("m", m.inverse().multiply(R4CTM).describe());
	// console.log("m", m.multiply(R4PTM).describe());
	// console.log("m", m.multiply(R4PTM.inverse()).describe());
	// console.log("m", m.multiply(R4PTM).inverse().describe());
	// console.log("m", m.inverse().multiply(R4.parentCTM()).describe());

	// console.log("m", R4PTM.multiply(m).describe());
	// console.log("m", R4PTM.multiply(m).inverse().describe());
	// console.log("m", R4PTM.multiply(m.inverse()).describe());

	// const M = tr.at(f, T.inverse());
	// node.transformM = p.inverse().multiply(M.multiply(T))
	// node.transformM = M.multiply(T).multiply(p)
	// node.transformM = M.multiply(T).multiply(p.inverse())

	t.end();
});
