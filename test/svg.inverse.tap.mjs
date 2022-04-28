import fs from 'fs';
import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Box, Matrix } from 'svggeom';
const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
	t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}
tap.test('Geoms 1', function (t) {
	const document = parser.parseFromString(
		fs.readFileSync('test/res/invers.svg', {
			encoding: 'utf-8',
		})
	);
	const svg = document.documentElement;
	const R1 = document.getElementById('R1');
	const R2 = document.getElementById('R2');
	const R3 = document.getElementById('R3');
	// const m = Matrix.translate(160, 230);
	const m = Matrix.translate(160, 170);
	const n = Matrix.translate(60, 10);
	const R = R1.rootTM
	const [P, M] = R1.splitTM();
// translate(-60,-10)
// translate(-160,-170)
// translate(-160 -110)scale(2 2)
	// t.same(R.toString(), Matrix.translate(40, 60).toString())
	// t.same(R2.rootTM.toString(), Matrix.translate(40, 60).toString())
	t.same(R3.rootTM.toString(), Matrix.identity().toString())
	// t.same(R2.parentNode.rootTM.toString(), Matrix.translate(40, 0).toString())
	 console.log(R);
	 console.log(P);
	// console.log(R.inverse().describe());
	console.log(P.inverse().describe());
	console.log(P.inverse().multiply(m).describe());
	// console.log(R.inverse().multiply(m).describe());

	console.log(m.inverse().describe());
	console.log(m.inverse().multiply(P).describe());
	console.log(m.inverse().postMultiply(P).describe());
	console.log(R.inverse().postMultiply(P));
	console.log(P.inverse().postMultiply(R));
	console.log(P.multiply(R.inverse()));
	console.log(P.multiply(R.inverse().multiply(m)));
	console.log(P.multiply(R.inverse().multiply(m)).inverse().describe());
	console.log(P.inverse().multiply(R.inverse().multiply(m)));
	console.log(P.multiply(R.inverse().multiply(m).inverse()).describe());
	console.log(P.postMultiply(R.inverse().multiply(m).inverse()).describe());
	console.log(P.inverse().postMultiply(R.inverse().postMultiply(m).inverse()));
	console.log(P.inverse().postMultiply(m));
	console.log(R.inverse().postMultiply(m).postMultiply(P.inverse()).describe());
	console.log(P.inverse().multiply(R.inverse().multiply(m.inverse())));
	console.log(P.inverse().multiply(m).inverse().multiply(R.inverse()).describe());
	console.log(P.inverse().multiply(R.inverse().multiply(m)).describe());
	console.log(R.multiply(m.inverse()).describe());
	console.log(P.multiply(m.inverse()).describe());
	console.log(P.inverse().multiply(m).describe());
	console.log(R.inverse().multiply(m).describe());
	console.log(M.postMultiply(R.multiply(m.inverse())).describe());

	console.log(P.multiply(n.inverse()).describe());
	console.log(P.inverse().multiply(n).describe());
	
	console.log(P.inverse().multiply(n.inverse()).multiply(P).describe());
	console.log(P.inverse().multiply(m.inverse()).multiply(R).describe());

	console.log(P.inverse().multiply(m.inverse()).multiply(R).describe());
	console.log(P.inverse().multiply(m).multiply(R).describe());


	// console.log(n.multiply(P.inverse()).describe());
	// console.log(n.inverse().multiply(P).describe());
	// console.log(n.inverse().multiply(P.inverse()).describe());


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
		const r = v.getBoundingClientRect();	t.same(R2.rootTM.toString(), Matrix.translate(40, 60).toString())

		const a = [v.x.baseVal.value, v.y.baseVal.value, v.width.baseVal.value, v.height.baseVal.value];
		v.setAttribute('geom', `${a[0]},${a[1]} ${a[2]}x${a[3]}`);
		return [v.id, ...a];
	});
}
