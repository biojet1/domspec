export class ClassAttr extends Attr {
	val?: DOMTokenList;

	get tokens() {
		return this.val || (this.val = new DOMTokenList());
	}

	get tokensQ() {
		return this.val || null;
	}

	set value(value: string) {
		this.tokens.parse(value);
	}

	get value() {
		return this.tokensQ?.format() || "";
	}

	toString() {
		return this.value;
	}

	// formatXML() {
	// 	let { tokensQ: tokens } = this;
	// 	return tokens && tokens.size > 0 ? super.formatXML() : "";
	// }

	valueOf() {
		let { tokensQ: tokens } = this;
		return tokens && tokens.size > 0 ? tokens.format() : null;
	}
}

import { Element } from "./element.js";
import { Attr } from "./attr.js";
import { DOMTokenList } from "./token-list.js";
