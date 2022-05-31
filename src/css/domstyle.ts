import { Element } from '../element.js';
import { Document } from '../document.js';
import { CSSStyleSheet, CSSMediaRule, CSSStyleRule/*, CSSRule*/ } from './stylesheet.js';
import { StylePropertyMap } from './stylemap.js';

const wm_sheet = new WeakMap<Element, CSSStyleSheet>();

export function parseStyleSheet(node: Element) {
	let ss = wm_sheet.get(node);
	if (!ss) {
		wm_sheet.set(node, (ss = CSSStyleSheet.parse(node.textContent ?? '')));
	}
	return ss;
}

// function fetchStyleSheet(node: Node) {
// 	let ss = wm_sheet.get(node);
// 	if (!ss) {
// 		wm_sheet.set(node, (ss = parse(node.textContent)));
// 	}
// 	return ss;
// }

export class StyleSheetList extends Array<CSSStyleSheet> {
	static create(document: Document) {
		const ss = new StyleSheetList();
		ss.push(
			...Array.from(document.querySelectorAll('style'), (node) => {
				return parseStyleSheet(node);
			}),
		);
		return ss;
	}
	static assign(document: Document) {
		let ssa = wm_sheets.get(document);
		if (!ssa) {
			wm_sheets.set(document, (ssa = StyleSheetList.create(document)));
		}
		return ssa;
	}
	// from: jsdom/lib/jsdom/living/helpers/style-rules.js
	forEachMatchingSheetRuleOfElement(element: Element, handleRule: (rule: CSSStyleRule) => void) {
		for (const sheet of this) {
			for (const rule of sheet.cssRules) {
				if (rule instanceof CSSMediaRule) {
					if (rule.media.indexOf('screen') >= 0) {
						for (const innerRule of rule.cssRules) {
							if (innerRule instanceof CSSStyleRule) {
								if (element.matches(innerRule.selectorText)) {
									handleRule(innerRule);
								}
							}
						}
					}

					continue;
				}
				if (rule instanceof CSSStyleRule) {
					if (element.matches(rule.selectorText)) {
						handleRule(rule);
					}
					continue;
				}
			}
		}
	}

	getCascadedPropertyValue(element: Element, property: string) {
		let value = '';
		this.forEachMatchingSheetRuleOfElement(element, (rule) => {
			const propertyValue = rule.style.getPropertyValue(property);
			// getPropertyValue returns "" if the property is not found
			if (propertyValue !== '') {
				value = propertyValue;
			}
		});

		const inlineValue = element.style.getPropertyValue(property);
		if (inlineValue != '' && inlineValue != null) {
			value = inlineValue;
		}

		return value;
	}
	resolvedValueImpl(property: string) {
		return { initial: '', inherited: true, computedValue: 'as-specified' };
	}

	getSpecifiedValue(element: Element, property: string): string {
		const cascade = this.getCascadedPropertyValue(element, property);

		if (cascade != '') {
			return cascade;
		}

		// Defaulting
		const { initial, inherited } = this.resolvedValueImpl(property);
		if (inherited && element.parentElement != null) {
			return this.getComputedValue(element.parentElement, property);
		}

		// root element without parent element or inherited property
		return initial;
	}
	getComputedValue(element: Element, property: string) {
		const { computedValue } = this.resolvedValueImpl(property);
		if (computedValue === 'as-specified') {
			return this.getSpecifiedValue(element, property);
		}

		throw new TypeError(
			`Internal error: unrecognized computed value instruction '${computedValue}'`,
		);
	}
	// from : jsdom/lib/jsdom/browser/Window.js
	getComputedStyle(element: Element, names?: string[]) {
		const { style } = element;
		const declaration = new StylePropertyMap();

		this.forEachMatchingSheetRuleOfElement(element, ({ style }) => {
			// console.log(style)
			for (const prop of style) {
				declaration.setProperty(
					prop,
					style.getPropertyValue(prop),
					style.getPropertyPriority(prop),
				);
			}
		});

		// // https://drafts.csswg.org/cssom/#dom-window-getcomputedstyle
		if (names) {
			for (const property of names) {
				declaration.setProperty(property, this.getComputedValue(element, property));
			}
		}

		for (const property of element.style) {
			declaration.setProperty(
				property,
				style.getPropertyValue(property),
				style.getPropertyPriority(property),
			);
		}

		return declaration.styleProxy();
	}
}

const wm_sheets = new WeakMap<Document, StyleSheetList>();

export function getStyleSheets(document: Document) {
	let ssa = wm_sheets.get(document);
	if (!ssa) {
		wm_sheets.set(document, (ssa = StyleSheetList.create(document)));
	}
	return ssa;
}

const wm_stylemap = new WeakMap<Element, StylePropertyMapReadOnly>();

export function getComputedStyleMap(node: Element) {
	let sm = wm_stylemap.get(node);
	if (!sm) {
		wm_stylemap.set(node, (sm = new StylePropertyMapReadOnly(node)));
	}
	return sm;
}

class StylePropertyMapReadOnly {
	sheets: StyleSheetList;
	element: Element;
	constructor(node: Element) {
		this.element = node;
		const sheets = node?.ownerDocument?.styleSheets;
		if (sheets) {
			this.sheets = sheets;
		} else {
			throw Error();
		}
	}
	get(name: string) {
		const { sheets, element } = this;
		return sheets.getSpecifiedValue(element, name);
	}
}
