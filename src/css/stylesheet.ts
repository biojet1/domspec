import { CSSRule, MediaList } from './om.js';
import { parse } from './parse.js';

export class CSSStyleSheet extends Array<CSSRule | CSSStyleSheet> {
	get cssRules() {
		return this;
	}
	parentStyleSheet?: CSSStyleSheet;
	parentRule?: CSSRule; // Not in standard
	get cssText(): string {
		// Not in standard
		return this.cssRules.map((r) => r.cssText).join('\n');
	}
	get ownerRule() {
		return this.parentRule;
	}

	__starts?: number;
	__ends?: number;

	insertRule(rule: string, index: number) {
		const { cssRules } = this;

		if (index < 0 || index > cssRules.length) {
			throw new RangeError('INDEX_SIZE_ERR');
		}
		const cssRule = parse(rule).cssRules[0];

		(cssRule as CSSRule).parentRule = this;
		cssRules.splice(index, 0, cssRule);
		return index;
	}
	deleteRule(index: number) {
		const { cssRules } = this;
		if (index < 0 || index >= this.cssRules.length) {
			throw new RangeError('INDEX_SIZE_ERR');
		}
		cssRules.splice(index, 1).forEach((v) => {
			delete v.parentRule;
		});
	}
}
