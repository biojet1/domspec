import { Element } from '../element.js';
import { Document } from '../document.js';
import { CSSStyleSheet, parse } from './stylesheet.js';
// import { parse } from './parse.js';

const wm_sheets = new WeakMap<Document, Array<CSSStyleSheet>>();
const wm_sheet = new WeakMap<Element, CSSStyleSheet>();

export function parseStyleSheet(node: Element) {
	let ss = wm_sheet.get(node);
	if (!ss) {
		wm_sheet.set(node, (ss = parse(node.textContent ?? '')));
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

export function getStyleSheets(document: Document) {
	let ssa = wm_sheets.get(document);
	if (!ssa) {
		wm_sheets.set(
			document,
			(ssa = Array.from(document.querySelectorAll('style'), (node) => {
				return parseStyleSheet(node);
			})),
		);
	}
	return ssa;
}

// class DOMStyle {
// 	constructor(document) {
// 		this._document = document;
// 	}
// 	get sheets() {
// 		let { _sheets, _document } = this;
// 		if (_sheets) {
// 			return _sheets;
// 		}
// 		if (_document) {
// 			const require = createRequire(import.meta.url);
// 			const cssom = require('cssom');
// 			return (this._sheets = Array.from(_document.querySelectorAll('style'), (style) => {
// 				let { _sheet } = style;
// 				return _sheet || (style._sheet = cssom.parse(style.textContent));
// 			}));
// 		}
// 		throw new Error('no document');
// 	}
// 	forEachMatchingSheetRuleOfElement(element, handleRule) {
// 		for (const sheet of this.sheets) {
// 			for (const rule of sheet.cssRules) {
// 				if (rule.media) {
// 					if (rule.media.indexOf('screen') !== -1) {
// 						for (const innerRule of rule.cssRules) {
// 							if (element.matches(innerRule.selectorText)) {
// 								handleRule(innerRule);
// 							}
// 						}
// 					}
// 				} else if (element.matches(rule.selectorText)) {
// 					handleRule(rule);
// 				}
// 			}
// 		}
// 	}
// 	getCascadedPropertyValue(element, property) {
// 		let value = '';
// 		this.forEachMatchingSheetRuleOfElement(element, (rule) => {
// 			const propertyValue = rule.style.getPropertyValue(property);
// 			// getPropertyValue returns "" if the property is not found
// 			if (propertyValue !== '') {
// 				value = propertyValue;
// 			}
// 		});

// 		const inlineValue = element.style.getPropertyValue(property);
// 		if (inlineValue != '' && inlineValue != null) {
// 			value = inlineValue;
// 		}

// 		return value;
// 	}
// 	resolvedValueImpl(property) {
// 		return { initial: '', inherited: true, computedValue: 'as-specified' };
// 	}

// 	getSpecifiedValue(element, property) {
// 		const cascade = this.getCascadedPropertyValue(element, property);

// 		if (cascade != '') {
// 			return cascade;
// 		}

// 		// Defaulting
// 		const { initial, inherited } = this.resolvedValueImpl(property);
// 		if (inherited && element.parentElement != null) {
// 			return this.getComputedValue(element.parentElement, property);
// 		}

// 		// root element without parent element or inherited property
// 		return initial;
// 	}

// 	getComputedValue(element, property) {
// 		const { computedValue } = this.resolvedValueImpl(property);
// 		if (computedValue === 'as-specified') {
// 			return this.getSpecifiedValue(element, property);
// 		}

// 		throw new TypeError(
// 			`Internal error: unrecognized computed value instruction '${computedValue}'`,
// 		);
// 	}

// 	getComputedStyle(element, names) {
// 		const { style } = element;
// 		const declaration = CSSStyleDeclaration.new();

// 		this.forEachMatchingSheetRuleOfElement(element, ({ style }) => {
// 			// console.log(style)
// 			Array.prototype.forEach.call(style, (prop) => {
// 				declaration.setProperty(
// 					prop,
// 					style.getPropertyValue(prop),
// 					style.getPropertyPriority(prop),
// 				);
// 			});
// 			// for (const prop of style) {
// 			// 	declaration.setProperty(
// 			// 		prop,
// 			// 		style.getPropertyValue(prop),
// 			// 		style.getPropertyPriority(prop),
// 			// 	);
// 			// }
// 		});

// 		// // https://drafts.csswg.org/cssom/#dom-window-getcomputedstyle

// 		for (const property of names) {
// 			declaration.setProperty(property, this.getComputedValue(element, property));
// 		}

// 		for (const property of element.style) {
// 			declaration.setProperty(
// 				property,
// 				style.getPropertyValue(property),
// 				style.getPropertyPriority(property),
// 			);
// 		}

// 		return declaration;
// 	}
// }
