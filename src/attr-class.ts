export class ClassAttr extends Attr {
	val?: Set<string>;
	get classes() {
		return this.val || (this.val = new Set<string>());
	}
	get classesq() {
		return this.val || null;
	}

	format() {
		let { classesq: classes } = this;
		return classes ? [...classes].join(" ") : "";
	}

	parse(value: string) {
		let { classes } = this;
		classes.clear();
		for (const v of value.split(/\s+/)) classes.add(v);
	}

	set value(value: string) {
		this.parse(value);
	}
	get value() {
		return this.format();
	}
	[Symbol.iterator]() {
		return this.classes;
	}
	get length() {
		return this.classes.size;
	}

	toString() {
		return this.format();
	}

	remove() {
		let { classesq: classes } = this;
		classes && classes.clear();
		return super.remove();
	}

	dumpXML() {
		let { classesq: classes } = this;
		return classes && classes.size > 0 ? super.dumpXML() : "";
	}

	// add(...tokens: Array<string>) {
	// 	let { classes } = this;
	// 	for (const v of tokens) classes.add(v);
	// }

	// contains(token: string) {
	// 	let { classes } = this;
	// 	return classes.has(token);
	// }

	// remove(...tokens: Array<string>) {
	// 	let { classes } = this;
	// 	for (const token of tokens) classes.delete(token);
	// }

	// toggle(token: string, force?: boolean) {
	// 	let { classes } = this;
	// 	if (classes.has(token)) {
	// 		if (force) return true;
	// 		classes.delete(token);
	// 	} else if (force || arguments.length === 1) {
	// 		classes.add(token);
	// 		return true;
	// 	}
	// 	return false;
	// }

	// replace(token: string, newToken: string) {
	// 	let { classes } = this;
	// 	if (classes.has(token)) {
	// 		classes.delete(token);
	// 		classes.add(newToken);
	// 		return true;
	// 	}
	// 	return false;
	// }

	// supports(token: string) {
	// 	return true;
	// }
}

import { Element } from "./element.js";
import { Attr } from "./attr.js";
