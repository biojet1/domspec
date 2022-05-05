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

function viewbox_transform(e_x, e_y, e_width, e_height, vb_x, vb_y, vb_width, vb_height, aspect) {
	let [align = 'xmidymid', meet_or_slice = 'meet'] = aspect ? aspect.toLowerCase().split(' ') : [];
	let scale_x = e_width / vb_width;
	let scale_y = e_height / vb_height;
	if (align != 'none' && meet_or_slice == 'meet') {
		scale_x = scale_y = min(scale_x, scale_y);
	} else if (align != 'none' && meet_or_slice == 'slice') {
		// Otherwise, if align is not 'none' and v is 'slice', set the smaller of scale-x and scale-y to the larger
		scale_x = scale_y = max(scale_x, scale_y);
	}
	let translate_x = e_x - vb_x * scale_x;
	let translate_y = e_y - vb_y * scale_y;
	if (align.indexOf('xmid') >= 0) {
		translate_x += (e_width - vb_width * scale_x) / 2.0;
	}
	if (align.indexOf('xmax') >= 0) {
		translate_x += e_width - vb_width * scale_x;
	}
	if (align.indexOf('ymid') >= 0) {
		translate_y += (e_height - vb_height * scale_y) / 2.0;
	}
	if (align.indexOf('ymax') >= 0) {
		translate_y += e_height - vb_height * scale_y;
	}
	return [translate_x, translate_y, scale_x, scale_y];
}

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
			const l = v.localTM();
			const o = v.ownTM;
			const b0 = Box.forRect(x, y, w, h);
			const b1 = v.boundingBox();
			root.insertAdjacentHTML(
				'beforeend',
				`<rect x="${b1.x}" y="${b1.y}" width="${b1.width}" height="${b1.height}" style="fill:none;stroke:red;opacity:50%;">`
			);

			t.ok(r.equals(m, 1e-3), `${id} ${r.describe()} ${m.describe()}`);
			const n = metrix.tag_name == 'svg' ? l.multiply(v.viewportTM().inverse()) : l;

			t.ok(r.equals(n, 1e-3), `${id} ${l.describe()} ${o.describe()}`);
			if ((metrix.tag_name != 'defs', !b0.isEmpty())) {
				eqBox(t, b0, b1, 1e-1, id);
			}
		}

		writeFileSync(`/tmp/test.svg`, root.outerHTML);
	}

	t.end();
});
