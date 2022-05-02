import fs from 'fs';
import tap from 'tap';
import { Document, SVGDocument } from '../dist/document.js';
import { ParentNode } from '../dist/parent-node.js';
import { DOMParser } from '../dist/dom-parse.js';
import { SVGLength } from '../dist/svg/element.js';
import { Path, Box, Matrix } from 'svggeom';
import { SVGLayout } from '../dist/svg/layout.js';

function apply(m, node) {
	const [P, M] = node.splitTM();
	const L = P.inverse().multiply(m).multiply(P);
	const R = P.multiply(M);

	const I = L.inverse();

	// const T = M.multiply(R.inverse().multiply(m)).inverse();
	// const T = P.inverse().multiply(m).inverse().multiply(M).inverse();
	let S, T;
	T = S = R.inverse().multiply(m).multiply(P);
	if(M.isIdentity == false){
		T = M.multiply(T).inverse() // R1,R2 OK
		// T = T.multiply(M).inverse() // R1,R2 OK
		// T = T.inverse()
	}
	// T = R.inverse().multiply(m).multiply(P)
	T = L.multiply(M) // R1,R2,R3,R4 OK
	node.ownTM = T;

	console.log('trans', node.id, `[${T.describe()}]\n\tL[${L.describe()}]\n\tS[${S.describe()}]\n\t-> ${T.describe()}`);
}

const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
	t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

tap.test('translate', function (t) {
	const document = parser.parseFromString(
		fs.readFileSync('test/res/transform.svg', {
			encoding: 'utf-8',
		})
	);
	const svg = document.documentElement;
	const R4 = document.getElementById('R4');
	const V3 = document.getElementById('V3');
	const C1 = document.getElementById('C1');
	const C2 = document.getElementById('C2');
	const C3 = document.getElementById('C3');
	const C4 = document.getElementById('C4');
	const R1 = document.getElementById('R1');
	const R2 = document.getElementById('R2');
	const R3 = document.getElementById('R3');
	const R5 = document.getElementById('R5');
	const R6 = document.getElementById('R6');

	// console.log(svg.querySelector('svg>g>g>g>g>g>rect:nth-of-type(1)').outerHTML);
	const m = Matrix.translate(-20, 30);
	apply(m, R1);
	t.same(R1.ownTM.describe(), Matrix.translate(15, 10).describe(), "R1")
	apply(m, R2); 
	t.same(R2.ownTM.describe(), Matrix.translate(-15, -10).describe(), "R2")
	apply(m, R3);
	t.same(R3.ownTM.describe(), Matrix.parse('translate(15 10)rotate(45)').describe(), "R3")
	apply(m, R4); // scale(2)translate(7.5 5)
	t.same(R4.ownTM.describe(), Matrix.parse('translate(15 10)scale(2 2)').describe(), "R4")
	t.end();
});

tap.test('scale', function (t) {
	const document = parser.parseFromString(
		fs.readFileSync('test/res/transform.svg', {
			encoding: 'utf-8',
		})
	);
	const svg = document.documentElement;
	const R4 = document.getElementById('R4');
	const V3 = document.getElementById('V3');
	const C1 = document.getElementById('C1');
	const C2 = document.getElementById('C2');
	const C3 = document.getElementById('C3');
	const C4 = document.getElementById('C4');
	const R1 = document.getElementById('R1');
	const R2 = document.getElementById('R2');
	const R3 = document.getElementById('R3');
	const R5 = document.getElementById('R5');
	const R6 = document.getElementById('R6');

	// console.log(svg.querySelector('svg>g>g>g>g>g>rect:nth-of-type(1)').outerHTML);
	const m = Matrix.translate(80, 40).scale(2).translate(-80, -40);
	console.log("TRANSFORM", m.describe());
	apply(m, R1);
	t.same(R1.ownTM.describe(), Matrix.parse('translate(0 -40)scale(2 2)').describe(), "R1")
	apply(m, R2); 
	t.same(R2.ownTM.describe(), Matrix.parse('translate(-60 -80)scale(2 2)').describe(), "R2")
	apply(m, R3); 
	t.same(R3.ownTM.describe(), Matrix.parse('translate(0 -40)rotate(45)scale(2 2)').describe(), "R3")
	apply(m, R4); 
	t.same(R4.ownTM.describe(), Matrix.parse('translate(0 -40)scale(4 4)').describe(), "R4")


	// apply(m, R3);
	// t.same(R3.ownTM.describe(), Matrix.parse('translate(15 10)rotate(45)').describe(), "R3")
	// apply(m, R4); // scale(2)translate(7.5 5)
	// t.same(R4.ownTM.describe(), Matrix.parse('translate(15 10)scale(2 2)').describe(), "R4")


	t.end();
});
