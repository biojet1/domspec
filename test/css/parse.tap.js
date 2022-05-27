import tap from 'tap';
import {CSSStyleSheet} from '../../dist/css/index.js';

tap.test('a{content:"\\""}', function (t) {
	const ss = CSSStyleSheet.parse(t.name);
	t.strictSame(ss.cssRules[0].style.content, '"\\""');
	t.end();
});
tap.test("a{content:'\\''}", function (t) {
	const ss = CSSStyleSheet.parse(t.name);
	t.strictSame(ss.cssRules[0].style.content, "'\\''");
	t.end();
});
tap.test('a{content:"abc\\"\\"d\\"ef"}', function (t) {
	const ss = CSSStyleSheet.parse(t.name);
	t.strictSame(ss.cssRules[0].style.content, '"abc\\"\\"d\\"ef"');
	t.end();
});

tap.test("a{content:'abc\\'\\'d\\'ef'}", function (t) {
	const ss = CSSStyleSheet.parse(t.name);
	t.strictSame(ss.cssRules[0].style.content, "'abc\\'\\'d\\'ef'");
	t.end();
});

function empty(t) {
	const ss = CSSStyleSheet.parse(t.name);
	t.match(ss, {
		parentStyleSheet: null,
	});
	t.match(ss.cssRules, []);
	t.end();
}
tap.test('/* fuuuu */', empty);
tap.test('/**/', empty);
tap.test("/*a {content: '* {color:#000}'}*/", empty);
function isLiteralObject(a) {
	return !!a && a.constructor === Object;
}
tap.Test.prototype.addAssert('looks', 3, function (A, B, opt, message, extra) {
	function eq(a, b, p) {
		// console.log('EQ', p, b);
		return a === b;
	}
	let eq_count = 0;
	const self = this;
	function like(a, b, path) {
		for (const [k, B] of Object.entries(b)) {
			const A = a[k];
			const p = `${path ?? ''}/${k}`;
			if (A === undefined) {
				if (B == null) {
					continue;
				}
				self.fail(`"${p}" not found`);
				return;
			}
			if (typeof B === 'object') {
				if (Array.isArray(B)) {
					if (B.length === 0) {
						if (A.length === 0) {
							++eq_count;
							continue;
						}
					}
				}
				like(A, B, p);
			} else {
				if (eq(A, B, p)) {
					++eq_count;
				} else {
					console.log(path, JSON.stringify(A), JSON.stringify(B));
					self.fail(`"${p}" not equal [${A}]:${typeof A} != [${B}]:${typeof B}`);
					return;
				}
			}
		}
	}
	like(A, B);
	if (eq_count > 0) {
		this.pass(`same ${eq_count}`);
	} else {
		// console.log('DIDNT', JSON.stringify(A), JSON.stringify(B));
		// console.log('DIDNT', A.constructor, B.constructor);
		this.fail(`did not compare [${A}], [${B}]`);
	}
});

function fn1(pattern, css) {
	return function (t) {
		t.looks(CSSStyleSheet.parse(css), pattern);
		t.end();
	};
}
tap.test('a {color: red}', function (t) {
	t.looks(CSSStyleSheet.parse(t.name), {
		cssRules: [
			{
				selectorText: 'a',
				style: {
					0: 'color',
					color: 'red',
					__starts: 2,
					length: 1,
				},
				parentRule: null,
				__starts: 0,
				__ends: 14,
			},
		],
		parentStyleSheet: null,
	});
	t.end();
});

import('./data.mjs').then((mod) => {
	for (const [k, v] of Object.entries(mod.DATA)) {
		tap.test(k, fn1(v, k));
	}
});
