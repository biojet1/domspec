import fs from 'fs';
import tap from 'tap';
import glob from 'glob';

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
	if (M.isIdentity == false) {
		T = M.multiply(T).inverse(); // R1,R2 OK
		// T = T.multiply(M).inverse() // R1,R2 OK
		// T = T.inverse()
	}
	// T = R.inverse().multiply(m).multiply(P)
	T = L.multiply(M); // R1,R2,R3,R4 OK
	node.ownTM = T;

	console.log('trans', node.id, `[${T.describe()}]\n\tL[${L.describe()}]\n\tS[${S.describe()}]\n\t-> ${T.describe()}`);
}

function toParent(parent, i) {
	const childTM = i.rootTM;
	const parentTM = parent.rootTM;
	parent.appendChild(i);
	i.ownTM = parentTM.inverse().multiply(childTM);
}

const parser = new DOMParser();

function closeEnough(t, a, b, threshold = 1e-6, tag) {
	t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function eqBox(t, a, b, epsilon = 0, tag) {
	t.ok(a.equals(b, epsilon), `${tag} [${a}] vs [${b}]`);
}

import { createWriteStream, writeFileSync, WriteStream } from 'fs';

tap.test('layout1', { bail: 0 }, function (t) {
	for (const f of glob.sync('test/res/*.metrix.json')) {
		const data = JSON.parse(fs.readFileSync(f, 'utf8'));
		const document = parser.parseFromString(data['-']);
		const root = document.documentElement;
		Array.from(document.querySelectorAll('path[id]'))
			.filter((v) => v.id.match(/^P_/))
			.forEach((v) => v.remove());
		for (const [id, metrix] of Object.entries(data).filter(([k, v]) => k != '-' && document.getElementById(k))) {
			// console.log(id, metrix);
			const [a, b, c, d, e, f] = metrix.root_tm;
			const [x, y, w, h] = metrix.root_box;
			const m = Matrix.new(a, b, c, d, e, f);
			const v = document.getElementById(id);
			const r = v.rootTM;
			const b0 = Box.forRect(x, y, w, h);
			const b1 = v.boundingBox();
			root.insertAdjacentHTML(
				'beforeend',
				`<rect x="${b1.x}" y="${b1.y}" width="${b1.width}" height="${b1.height}" style="fill:none;stroke:red;opacity:50%;">`
			);

			t.ok(r.equals(m, 1e-3), `${id} ${r.describe()} ${m.describe()}`);
			if ((metrix.tag_name != 'defs', !b0.isEmpty())) {
				eqBox(t, b0, b1, 1e-1, id);
			}
		}

		writeFileSync(`/tmp/test.svg`, root.outerHTML);
	}

	t.end();
});
