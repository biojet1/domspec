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

	override toString() {
		return this.value;
	}

	override valueOf() {
		const { tokensQ: tokens } = this;
		return tokens && tokens.size > 0 ? tokens.format() : null;
	}
}

import { Attr } from "./attr.js";
import { DOMTokenList } from "./token-list.js";
