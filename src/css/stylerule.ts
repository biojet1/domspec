import { WithStyleProp } from './om.js';

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
		let state : 'selector' | 'name' | 'value' = 'selector';
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
