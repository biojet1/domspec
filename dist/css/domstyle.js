import { CSSStyleSheet, CSSMediaRule, CSSStyleRule } from './stylesheet.js';
import { StylePropertyMap } from './stylemap.js';
const wm_sheet = new WeakMap();
export function parseStyleSheet(node) {
    let ss = wm_sheet.get(node);
    if (!ss) {
        wm_sheet.set(node, (ss = CSSStyleSheet.parse(node.textContent ?? '')));
    }
    return ss;
}
export class StyleSheetList extends Array {
    static create(document) {
        const ss = new StyleSheetList();
        ss.push(...Array.from(document.querySelectorAll('style'), (node) => {
            return parseStyleSheet(node);
        }));
        return ss;
    }
    static assign(document) {
        let ssa = wm_sheets.get(document);
        if (!ssa) {
            wm_sheets.set(document, (ssa = StyleSheetList.create(document)));
        }
        return ssa;
    }
    forEachMatchingSheetRuleOfElement(element, handleRule) {
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
    getCascadedPropertyValue(element, property) {
        let value = '';
        this.forEachMatchingSheetRuleOfElement(element, (rule) => {
            const propertyValue = rule.style.getPropertyValue(property);
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
    resolvedValueImpl(property) {
        return { initial: '', inherited: true, computedValue: 'as-specified' };
    }
    getSpecifiedValue(element, property) {
        const cascade = this.getCascadedPropertyValue(element, property);
        if (cascade != '') {
            return cascade;
        }
        const { initial, inherited } = this.resolvedValueImpl(property);
        if (inherited && element.parentElement != null) {
            return this.getComputedValue(element.parentElement, property);
        }
        return initial;
    }
    getComputedValue(element, property) {
        const { computedValue } = this.resolvedValueImpl(property);
        if (computedValue === 'as-specified') {
            return this.getSpecifiedValue(element, property);
        }
        throw new TypeError(`Internal error: unrecognized computed value instruction '${computedValue}'`);
    }
    getComputedStyle(element, names) {
        const { style } = element;
        const declaration = new StylePropertyMap();
        this.forEachMatchingSheetRuleOfElement(element, ({ style }) => {
            for (const prop of style) {
                declaration.setProperty(prop, style.getPropertyValue(prop), style.getPropertyPriority(prop));
            }
        });
        if (names) {
            for (const property of names) {
                declaration.setProperty(property, this.getComputedValue(element, property));
            }
        }
        for (const property of element.style) {
            declaration.setProperty(property, style.getPropertyValue(property), style.getPropertyPriority(property));
        }
        return declaration.styleProxy();
    }
}
const wm_sheets = new WeakMap();
export function getStyleSheets(document) {
    let ssa = wm_sheets.get(document);
    if (!ssa) {
        wm_sheets.set(document, (ssa = StyleSheetList.create(document)));
    }
    return ssa;
}
const wm_stylemap = new WeakMap();
export function getComputedStyleMap(node) {
    let sm = wm_stylemap.get(node);
    if (!sm) {
        wm_stylemap.set(node, (sm = new StylePropertyMapReadOnly(node)));
    }
    return sm;
}
class StylePropertyMapReadOnly {
    sheets;
    element;
    constructor(node) {
        this.element = node;
        const sheets = node?.ownerDocument?.styleSheets;
        if (sheets) {
            this.sheets = sheets;
        }
        else {
            throw Error();
        }
    }
    get(name) {
        const { sheets, element } = this;
        return sheets.getSpecifiedValue(element, name);
    }
}
//# sourceMappingURL=domstyle.js.map