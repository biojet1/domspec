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

export abstract class WithRuleSet extends CSSRule {
	cssRules = new Array<CSSRule>();
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

export class MatcherList extends Array<string> {
	get matcherText() {
		return this.join(', ');
	}
	set matcherText(value: string) {
		this.splice(0, this.length, ...value.split(',').map((v) => v.trim()));
	}
}

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

export class CSSImportRule extends CSSRule {
	href?: string;
	media = new MediaList();
	styleSheet = new CSSStyleSheet();
	get cssText() {
		const {
			href = '',
			media: { mediaText },
		} = this;
		return `@import url(${href})${mediaText ? ' ' + mediaText : ''};`;
	}
	set cssText(value: string) {
		let i = 0;
		/**
		 * @import url(partial.css) screen, handheld;
		 *        ||               |
		 *        after-import     media
		 *         |
		 *         url
		 */
		let state: 'after-import' | 'url' | 'media' | undefined;
		let buffer = '';
		let index;
		for (let character; (character = value.charAt(i)); i++) {
			switch (character) {
				case ' ':
				case '\t':
				case '\r':
				case '\n':
				case '\f':
					if (state === 'after-import') {
						state = 'url';
					} else {
						buffer += character;
					}
					break;

				case '@':
					if (!state && value.indexOf('@import', i) === i) {
						state = 'after-import';
						i += 'import'.length;
						buffer = '';
					}
					break;

				case 'u':
					if (state === 'url' && value.indexOf('url(', i) === i) {
						index = value.indexOf(')', i + 1);
						if (index === -1) {
							throw SyntaxError(i + ': ")" not found');
						}
						i += 'url('.length;
						let url = value.slice(i, index);
						if (url[0] === url[url.length - 1]) {
							if (url[0] === '"' || url[0] === "'") {
								url = url.slice(1, -1);
							}
						}
						this.href = url;
						i = index;
						state = 'media';
					}
					break;

				case '"':
					if (state === 'url') {
						index = value.indexOf('"', i + 1);
						if (!index) {
							// index === -1?
							throw SyntaxError(i + ": '\"' not found");
						}
						this.href = value.slice(i + 1, index);
						i = index;
						state = 'media';
					}
					break;

				case "'":
					if (state === 'url') {
						index = value.indexOf("'", i + 1);
						if (!index) {
							// index === -1?
							throw SyntaxError(i + ': "\'" not found');
						}
						this.href = value.slice(i + 1, index);
						i = index;
						state = 'media';
					}
					break;

				case ';':
					if (state === 'media') {
						if (buffer) {
							this.media.mediaText = buffer.trim();
						}
					}
					break;

				default:
					if (state === 'media') {
						buffer += character;
					}
					break;
			}
		}
	}
}

export abstract class WithStyleProp extends CSSRule {
	#style?: any;
	styleMap = new StylePropertyMap();
	get style() {
		const { styleMap } = this;
		return this.#style || (this.#style = styleMap.proxify());
	}
}
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

export class CSSHostRule extends CSSGroupingRule {
	get cssText() {
		const { cssRules } = this;
		return `@host {${cssRules.map((r) => r.cssText).join('')}}`;
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

export class CSSKeyframeRule extends WithStyleProp {
	keyText = '';
	get cssText() {
		const { keyText, styleMap } = this;
		return `${keyText}{${styleMap.cssText}}`;
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

export class CSSStyleRule extends WithStyleProp {
	selectorText: string = '';

	get cssText() {
		const { selectorText, styleMap } = this;
		if (selectorText) {
			return `${selectorText} {${styleMap.cssText}}`;
		} else {
			return styleMap.cssText;
		}
	}
	set cssText(ruleText: string) {
		const { styleMap } = this;
		let i = 0;
		let state: 'selector' | 'name' | 'value' = 'selector';
		let index;
		let j = i;
		let buffer = '';

		const SIGNIFICANT_WHITESPACE: { [prop: string]: boolean } = {
			selector: true,
			value: true,
		};

		let name,
			priority = '';
		styleMap.clear();
		this.selectorText = '';

		for (let character; (character = ruleText.charAt(i)); i++) {
			switch (character) {
				case ' ':
				case '\t':
				case '\r':
				case '\n':
				case '\f':
					if (SIGNIFICANT_WHITESPACE[state]) {
						// Squash 2 or more white-spaces in the row into 1
						switch (ruleText.charAt(i - 1)) {
							case ' ':
							case '\t':
							case '\r':
							case '\n':
							case '\f':
								break;
							default:
								buffer += ' ';
								break;
						}
					}
					break;

				// String
				case '"':
					j = i + 1;
					index = ruleText.indexOf('"', j) + 1;
					if (!index) {
						throw '" is missing';
					}
					buffer += ruleText.slice(i, index);
					i = index - 1;
					break;

				case "'":
					j = i + 1;
					index = ruleText.indexOf("'", j) + 1;
					if (!index) {
						throw "' is missing";
					}
					buffer += ruleText.slice(i, index);
					i = index - 1;
					break;

				// Comment
				case '/':
					if (ruleText.charAt(i + 1) === '*') {
						i += 2;
						index = ruleText.indexOf('*/', i);
						if (index === -1) {
							throw new SyntaxError('Missing */');
						} else {
							i = index + 1;
						}
					} else {
						buffer += character;
					}
					break;

				case '{':
					if (state === 'selector') {
						this.selectorText = buffer.trim();
						buffer = '';
						state = 'name';
					}
					break;

				case ':':
					if (state === 'name') {
						name = buffer.trim();
						buffer = '';
						state = 'value';
					} else {
						buffer += character;
					}
					break;

				case '!':
					if (state === 'value' && ruleText.indexOf('!important', i) === i) {
						priority = 'important';
						i += 'important'.length;
					} else {
						buffer += character;
					}
					break;

				case ';':
					if (state === 'value') {
						if (name) {
							styleMap.setProperty(name, buffer.trim(), priority);
						} else {
							throw Error();
						}
						priority = '';
						buffer = '';
						state = 'name';
					} else {
						buffer += character;
					}
					break;

				case '}':
					if (state === 'value') {
						if (name) {
							styleMap.setProperty(name, buffer.trim(), priority);
						} else {
							throw Error();
						}
						priority = '';
						buffer = '';
					} else if (state === 'name') {
						break;
					} else {
						buffer += character;
					}
					state = 'selector';
					break;

				default:
					buffer += character;
					break;
			}
		}
	}
}

import { StylePropertyMap, CSSStyleDeclaration } from './stylemap.js';


// import { CSSRule } from './rule.js';
// import { parse } from './parse.js';
export function parse(token: string) {
	let i = 0;

	let state:
		| 'before-selector'
		| 'selector'
		| 'atRule'
		| 'atBlock'
		| 'conditionBlock'
		| 'before-name'
		| 'name'
		| 'before-value'
		| 'value'
		| 'importRule'
		| 'importRule-begin'
		| 'keyframeRule-begin'
		| 'value-parenthesis'
		| 'fontFaceRule-begin'
		| 'documentRule-begin'
		| 'hostRule-begin'
		| 'keyframesRule-begin' = 'before-selector';

	let index;
	let buffer = '';
	let valueParenthesisDepth = 0;

	const SIGNIFICANT_WHITESPACE: { [prop: string]: boolean } = {
		selector: true,
		value: true,
		'value-parenthesis': true,
		atRule: true,
		'importRule-begin': true,
		importRule: true,
		atBlock: true,
		conditionBlock: true,
		'documentRule-begin': true,
	};

	const styleSheet = new CSSStyleSheet();

	let currentScope:
		| CSSStyleSheet
		| CSSMediaRule
		| CSSSupportsRule
		| CSSFontFaceRule
		| CSSKeyframesRule
		| CSSDocumentRule
		| CSSHostRule = styleSheet;

	let parentRule:
		| CSSMediaRule
		| CSSSupportsRule
		| CSSKeyframesRule
		| CSSDocumentRule
		| CSSHostRule
		| undefined = undefined;

	let ancestorRules: (
		| CSSMediaRule
		| CSSSupportsRule
		| CSSKeyframesRule
		| CSSDocumentRule
		| CSSHostRule
	)[] = [];
	let hasAncestors = false;
	let prevScope;

	let name,
		priority = '',
		styleRule: CSSStyleRule | CSSKeyframeRule | CSSFontFaceRule | undefined,
		mediaRule: CSSMediaRule | undefined,
		supportsRule: CSSSupportsRule | undefined,
		importRule: CSSImportRule | undefined,
		fontFaceRule: CSSFontFaceRule | undefined,
		keyframesRule: CSSKeyframesRule | undefined,
		documentRule: CSSDocumentRule | undefined,
		hostRule: CSSHostRule | undefined;

	let atKeyframesRegExp = /@(-(?:\w+-)+)?keyframes/g;

	const parseError = function (message: string) {
		let lines = token.substring(0, i).split('\n');
		let lineCount = lines.length;
		let charCount = (lines.pop()?.length ?? 0) + 1;
		let error = new SyntaxError(message + ' (line ' + lineCount + ', char ' + charCount + ')');
		(error as any).lineNumber = lineCount;
		(error as any).columnNumber = charCount;
		(error as any).styleSheet = styleSheet;
		return error;
	};

	for (let character; (character = token.charAt(i)); i++) {
		switch (character) {
			case ' ':
			case '\t':
			case '\r':
			case '\n':
			case '\f':
				if (SIGNIFICANT_WHITESPACE[state]) {
					buffer += character;
				}
				break;

			// String
			case '"':
				index = i + 1;
				do {
					index = token.indexOf('"', index) + 1;
					if (!index) {
						throw parseError('Unmatched "');
					}
				} while (token[index - 2] === '\\');
				buffer += token.slice(i, index);
				i = index - 1;
				switch (state) {
					case 'before-value':
						state = 'value';
						break;
					case 'importRule-begin':
						state = 'importRule';
						break;
				}
				break;

			case "'":
				index = i + 1;
				do {
					index = token.indexOf("'", index) + 1;
					if (!index) {
						throw parseError("Unmatched '");
					}
				} while (token[index - 2] === '\\');
				buffer += token.slice(i, index);
				i = index - 1;
				switch (state) {
					case 'before-value':
						state = 'value';
						break;
					case 'importRule-begin':
						state = 'importRule';
						break;
				}
				break;

			// Comment
			case '/':
				if (token.charAt(i + 1) === '*') {
					i += 2;
					index = token.indexOf('*/', i);
					if (index === -1) {
						throw parseError('Missing */');
					} else {
						i = index + 1;
					}
				} else {
					buffer += character;
				}
				if (state === 'importRule-begin') {
					buffer += ' ';
					state = 'importRule';
				}
				break;

			// At-rule
			case '@':
				if (token.indexOf('@-moz-document', i) === i) {
					state = 'documentRule-begin';
					documentRule = new CSSDocumentRule();
					documentRule.__starts = i;
					i += '-moz-document'.length;
					buffer = '';
					break;
				} else if (token.indexOf('@media', i) === i) {
					state = 'atBlock';
					mediaRule = new CSSMediaRule();
					mediaRule.__starts = i;
					i += 'media'.length;
					buffer = '';
					break;
				} else if (token.indexOf('@supports', i) === i) {
					state = 'conditionBlock';
					supportsRule = new CSSSupportsRule();
					supportsRule.__starts = i;
					i += 'supports'.length;
					buffer = '';
					break;
				} else if (token.indexOf('@host', i) === i) {
					state = 'hostRule-begin';
					i += 'host'.length;
					hostRule = new CSSHostRule();
					hostRule.__starts = i;
					buffer = '';
					break;
				} else if (token.indexOf('@import', i) === i) {
					state = 'importRule-begin';
					i += 'import'.length;
					buffer += '@import';
					break;
				} else if (token.indexOf('@font-face', i) === i) {
					state = 'fontFaceRule-begin';
					i += 'font-face'.length;
					fontFaceRule = new CSSFontFaceRule();
					fontFaceRule.__starts = i;
					buffer = '';
					break;
				} else {
					atKeyframesRegExp.lastIndex = i;
					let matchKeyframes = atKeyframesRegExp.exec(token);
					if (matchKeyframes && matchKeyframes.index === i) {
						state = 'keyframesRule-begin';
						keyframesRule = new CSSKeyframesRule();
						keyframesRule.__starts = i;
						keyframesRule._vendorPrefix = matchKeyframes[1]; // Will come out as undefined if no prefix was found
						i += matchKeyframes[0].length - 1;
						buffer = '';
						break;
					} else if (state === 'selector') {
						state = 'atRule';
					}
				}
				buffer += character;
				break;

			case '{':
				if (state === 'selector' || state === 'atRule') {
					if (styleRule instanceof CSSStyleRule) {
						styleRule.selectorText = buffer.trim();
						styleRule.style.__starts = i;
					} else {
						throw new Error();
					}
					buffer = '';
					state = 'before-name';
				} else if (state === 'atBlock') {
					if (mediaRule) {
						mediaRule.media.mediaText = buffer.trim();

						if (parentRule) {
							ancestorRules.push(parentRule);
						}

						currentScope = parentRule = mediaRule;
						mediaRule.parentStyleSheet = styleSheet;
						buffer = '';
						state = 'before-selector';
					} else {
						throw new Error();
					}
				} else if (state === 'conditionBlock') {
					if (supportsRule) {
						supportsRule.conditionText = buffer.trim();

						if (parentRule) {
							ancestorRules.push(parentRule);
						}

						currentScope = parentRule = supportsRule;
						supportsRule.parentStyleSheet = styleSheet;
						buffer = '';
						state = 'before-selector';
					} else {
						throw new Error();
					}
				} else if (state === 'hostRule-begin') {
					if (hostRule) {
						if (parentRule) {
							ancestorRules.push(parentRule);
						}

						currentScope = parentRule = hostRule;
						hostRule.parentStyleSheet = styleSheet;
						buffer = '';
						state = 'before-selector';
					} else {
						throw new Error();
					}
				} else if (state === 'fontFaceRule-begin') {
					if (fontFaceRule) {
						if (parentRule) {
							fontFaceRule.parentRule = parentRule;
						}
						fontFaceRule.parentStyleSheet = styleSheet;
						styleRule = fontFaceRule;
						buffer = '';
						state = 'before-name';
					} else {
						throw new Error();
					}
				} else if (state === 'keyframesRule-begin') {
					if (keyframesRule) {
						keyframesRule.name = buffer.trim();
						if (parentRule) {
							ancestorRules.push(parentRule);
							keyframesRule.parentRule = parentRule;
						}
						keyframesRule.parentStyleSheet = styleSheet;
						currentScope = parentRule = keyframesRule;
						buffer = '';
						state = 'keyframeRule-begin';
					} else {
						throw new Error();
					}
				} else if (state === 'keyframeRule-begin') {
					styleRule = new CSSKeyframeRule();
					styleRule.keyText = buffer.trim();
					styleRule.__starts = i;
					buffer = '';
					state = 'before-name';
				} else if (state === 'documentRule-begin') {
					// FIXME: what if this '{' is in the url text of the match function?
					if (documentRule) {
						documentRule.matcher.matcherText = buffer.trim();
						if (parentRule) {
							ancestorRules.push(parentRule);
							documentRule.parentRule = parentRule;
						}
						currentScope = parentRule = documentRule;
						documentRule.parentStyleSheet = styleSheet;
						buffer = '';
						state = 'before-selector';
					} else {
						throw new Error();
					}
				}
				break;

			case ':':
				if (state === 'name') {
					name = buffer.trim();
					buffer = '';
					state = 'before-value';
				} else {
					buffer += character;
				}
				break;

			case '(':
				if (state === 'value') {
					// ie css expression mode
					if (buffer.trim() === 'expression') {
						throw parseError(`css expression not supported`);
						// let info = new CSSValueExpression(token, i).parse();
						// if (info.error) {
						// 	throw parseError(info.error);
						// } else {
						// 	buffer += info.expression;
						// 	i = info.idx;
						// }
					} else {
						state = 'value-parenthesis';
						//always ensure this is reset to 1 on transition
						//from value to value-parenthesis
						valueParenthesisDepth = 1;
						buffer += character;
					}
				} else if (state === 'value-parenthesis') {
					valueParenthesisDepth++;
					buffer += character;
				} else {
					buffer += character;
				}
				break;

			case ')':
				if (state === 'value-parenthesis') {
					valueParenthesisDepth--;
					if (valueParenthesisDepth === 0) state = 'value';
				}
				buffer += character;
				break;

			case '!':
				if (state === 'value' && token.indexOf('!important', i) === i) {
					priority = 'important';
					i += 'important'.length;
				} else {
					buffer += character;
				}
				break;

			case ';':
				switch (state) {
					case 'value':
						if (styleRule && name) {
							styleRule.style.setProperty(name, buffer.trim(), priority);
							priority = '';
							buffer = '';
							state = 'before-name';
						} else {
							throw new Error();
						}
						break;
					case 'atRule':
						buffer = '';
						state = 'before-selector';
						break;
					case 'importRule':
						importRule = new CSSImportRule();
						importRule.parentStyleSheet = importRule.styleSheet.parentStyleSheet = styleSheet;
						importRule.cssText = buffer + character;
						styleSheet.cssRules.push(importRule);
						buffer = '';
						state = 'before-selector';
						break;
					default:
						buffer += character;
						break;
				}
				break;

			case '}':
				switch (state) {
					// @ts-ignore
					case 'value':
						if (styleRule && name) {
							styleRule.style.setProperty(name, buffer.trim(), priority);
							priority = '';
						} else {
							throw new Error();
						}
					/* falls through */
					case 'before-name':
					case 'name':
						if (styleRule) {
							styleRule.__ends = i + 1;
							if (parentRule) {
								styleRule.parentRule = parentRule;
							}
							styleRule.parentStyleSheet = styleSheet;
							currentScope.cssRules.push(styleRule);
							buffer = '';
							if (currentScope.constructor === CSSKeyframesRule) {
								state = 'keyframeRule-begin';
							} else {
								state = 'before-selector';
							}
						} else {
							throw new Error();
						}
						break;
					case 'keyframeRule-begin':
					case 'before-selector':
					case 'selector':
						// End of media/supports/document rule.
						if (!parentRule) {
							throw parseError('Unexpected }');
						}

						// Handle rules nested in @media or @supports
						hasAncestors = ancestorRules.length > 0;

						while (ancestorRules.length > 0) {
							parentRule = ancestorRules.pop();
							if (!parentRule) {
								throw new Error();
							} else if (parentRule instanceof CSSConditionRule) {
								//  CSSConditionRule: CSSMediaRule and CSSSupportsRule
								prevScope = currentScope;
								currentScope = parentRule;
								if (prevScope instanceof CSSConditionRule) {
									currentScope.cssRules.push(prevScope);
								} else {
									throw new Error();
								}
								break;
							}

							if (ancestorRules.length === 0) {
								hasAncestors = false;
							}
						}

						if (!hasAncestors) {
							currentScope.__ends = i + 1;
							styleSheet.cssRules.push(currentScope);
							currentScope = styleSheet;
							parentRule = undefined;
						}

						buffer = '';
						state = 'before-selector';
						break;
				}
				break;

			default:
				switch (state) {
					case 'before-selector':
						state = 'selector';
						styleRule = new CSSStyleRule();
						styleRule.__starts = i;
						break;
					case 'before-name':
						state = 'name';
						break;
					case 'before-value':
						state = 'value';
						break;
					case 'importRule-begin':
						state = 'importRule';
						break;
				}
				buffer += character;
				break;
		}
	}

	return styleSheet;
}
