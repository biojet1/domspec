import { CSSStyleSheet } from './stylesheet.js';
import { parse } from './index.js';
import { StylePropertyMap } from './stylemap.js';

abstract class CSSNode {
	parentRule?: CSSRule;
	parentStyleSheet?: CSSStyleSheet;
	__starts?: number;
	__ends?: number;
}

export abstract class CSSRule extends CSSNode {
	// parentRule?: CSSRule;
	// parentStyleSheet?: CSSStyleSheet;
	abstract get cssText(): string;
}

abstract class WithRuleSet extends CSSRule {
	cssRules = new Array<CSSRule>();
}

export abstract class WithStyleProp extends CSSRule {
	#style?: any;
	styleMap = new StylePropertyMap();
	get style() {
		const { styleMap } = this;
		return this.#style || (this.#style = styleMap.proxify());
	}
}

// type Constructor = new (...args: any[]) => {};

// function RuleSetOps<TBase extends Constructor>(Base: TBase) {
// 	return class RuleSetOps extends Base {
// 		insertRule(rule: string, index: number) {
// 			const { cssRules } = this;

// 			if (index < 0 || index > cssRules.length) {
// 				throw new RangeError('INDEX_SIZE_ERR');
// 			}
// 			const cssRule = parse(rule).cssRules[0];

// 			(cssRule as CSSRule).parentRule = this;
// 			cssRules.splice(index, 0, cssRule);
// 			return index;
// 		}
// 		deleteRule(index: number) {
// 			const { cssRules } = this;
// 			if (index < 0 || index >= this.cssRules.length) {
// 				throw new RangeError('INDEX_SIZE_ERR');
// 			}
// 			cssRules.splice(index, 1).forEach((v) => {
// 				delete v.parentRule;
// 			});
// 		}
// 	};
// }

export abstract class CSSGroupingRule extends WithRuleSet {
	insertRule(rule: string, index: number) {
		if (index < 0 || index > this.cssRules.length) {
			throw new RangeError('INDEX_SIZE_ERR');
		}
		const cssRule = parse(rule).cssRules[0];

		(cssRule as CSSRule).parentRule = this;
		this.cssRules.splice(index, 0, cssRule);
		return index;
	}
	deleteRule(index: number) {
		if (index < 0 || index >= this.cssRules.length) {
			throw new RangeError('INDEX_SIZE_ERR');
		}
		this.cssRules.splice(index, 1).forEach((v) => {
			delete v.parentRule;
		});
	}
}

export abstract class CSSConditionRule extends CSSGroupingRule {
	abstract get conditionText();
	abstract set conditionText(value: string);
}

export class CSSSupportsRule extends CSSConditionRule {
	_condition?: string;
	get conditionText() {
		return this._condition ?? '';
	}
	set conditionText(value: string) {
		this._condition = value;
	}
	get cssText() {
		const { conditionText, cssRules } = this;
		return `@supports ${conditionText} {${cssRules.map((r) => r.cssText).join('')}}`;
	}
}

export class CSSMediaRule extends CSSConditionRule {
	media = new MediaList();
	get conditionText() {
		return this.media.mediaText;
	}
	set conditionText(value: string) {
		this.media.mediaText = value;
	}
	get cssText() {
		const { conditionText, cssRules } = this;
		return `@supports ${conditionText} {${cssRules.map((r) => r.cssText).join('')}}`;
	}
}

export class CSSHostRule extends CSSGroupingRule {
	get cssText() {
		const { cssRules } = this;
		return `@host {${cssRules.map((r) => r.cssText).join('')}}`;
	}
}

export class CSSFontFaceRule extends WithRuleSet {
	get cssText() {
		return `@font-face {${this.style.cssText}}`;
	}
	#style?: any;
	styleMap = new StylePropertyMap();
	get style() {
		const { styleMap } = this;
		return this.#style || (this.#style = styleMap.proxify());
	}
}

export class CSSKeyframesRule extends WithRuleSet {
	name?: string;
	_vendorPrefix?: string;
	get cssText() {
		const { _vendorPrefix, name, cssRules } = this;
		return `@${_vendorPrefix ?? ''}keyframes ${name ?? ''}{\n${cssRules
			.map((r) => r.cssText)
			.join('\n')}\n}`;
	}
}

export class CSSDocumentRule extends CSSConditionRule {
	matcher = new MatcherList();
	get conditionText() {
		return this.matcher.matcherText;
	}
	set conditionText(value: string) {
		this.matcher.matcherText = value;
	}
	get cssText() {
		const { matcher, cssRules } = this;
		return `@-moz-document ${matcher.matcherText} {${cssRules.map((r) => r.cssText).join('')}}`;
	}
}

export class MatcherList extends Array<string> {
	get matcherText() {
		return this.join(', ');
	}
	set matcherText(value: string) {
		this.splice(0, this.length, ...value.split(',').map((v) => v.trim()));
	}
}

export class MediaList extends Array<string> {
	get mediaText() {
		return this.join(', ');
	}
	set mediaText(value: string) {
		this.splice(0, this.length, ...value.split(',').map((v) => v.trim()));
	}

	appendMedium(medium: string) {
		if (this.indexOf(medium) < 0) {
			this.push(medium);
		}
	}

	deleteMedium(medium: string) {
		let index;
		while ((index = this.indexOf(medium)) >= 0) {
			this.splice(index, 1);
		}
	}
}

export class CSSKeyframeRule extends WithStyleProp {
	keyText = '';
	get cssText() {
		const { keyText, styleMap } = this;
		return `${keyText}{${styleMap.cssText}}`;
	}
}
