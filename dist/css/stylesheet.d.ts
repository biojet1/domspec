declare abstract class CSSNode {
    parentRule?: CSSRule;
    parentStyleSheet?: CSSStyleSheet;
    __starts?: number;
    __ends?: number;
}
export declare abstract class CSSRule extends CSSNode {
    abstract get cssText(): string;
}
declare abstract class WithRuleSet extends CSSRule {
    cssRules: CSSRule[];
}
export declare class MediaList extends Array<string> {
    get mediaText(): string;
    set mediaText(value: string);
    appendMedium(medium: string): void;
    deleteMedium(medium: string): void;
}
export declare class CSSKeyframesRule extends WithRuleSet {
    name?: string;
    _vendorPrefix?: string;
    get cssText(): string;
}
export declare class MatcherList extends Array<string> {
    get matcherText(): string;
    set matcherText(value: string);
}
export declare class CSSStyleSheet extends Array<CSSRule | CSSStyleSheet> {
    get cssRules(): this;
    parentStyleSheet?: CSSStyleSheet;
    parentRule?: CSSRule;
    get cssText(): string;
    get ownerRule(): CSSRule | undefined;
    __starts?: number;
    __ends?: number;
    insertRule(rule: string, index: number): number;
    deleteRule(index: number): void;
    static parse(text: string): CSSStyleSheet;
}
export declare class CSSImportRule extends CSSRule {
    href?: string;
    media: MediaList;
    styleSheet: CSSStyleSheet;
    get cssText(): string;
    set cssText(value: string);
}
declare abstract class WithStyleProp extends CSSRule {
    #private;
    styleMap: StylePropertyMap;
    get style(): any;
}
export declare abstract class CSSGroupingRule extends WithRuleSet {
    insertRule(rule: string, index: number): number;
    deleteRule(index: number): void;
}
export declare class CSSHostRule extends CSSGroupingRule {
    get cssText(): string;
}
export declare abstract class CSSConditionRule extends CSSGroupingRule {
    abstract get conditionText(): string;
    abstract set conditionText(value: string);
}
export declare class CSSSupportsRule extends CSSConditionRule {
    _condition?: string;
    get conditionText(): string;
    set conditionText(value: string);
    get cssText(): string;
}
export declare class CSSMediaRule extends CSSConditionRule {
    media: MediaList;
    get conditionText(): string;
    set conditionText(value: string);
    get cssText(): string;
}
export declare class CSSFontFaceRule extends WithRuleSet {
    #private;
    get cssText(): string;
    styleMap: StylePropertyMap;
    get style(): any;
}
export declare class CSSKeyframeRule extends WithStyleProp {
    keyText: string;
    get cssText(): string;
}
export declare class CSSDocumentRule extends CSSConditionRule {
    matcher: MatcherList;
    get conditionText(): string;
    set conditionText(value: string);
    get cssText(): string;
}
export declare class CSSStyleRule extends WithStyleProp {
    selectorText: string;
    get cssText(): string;
    set cssText(ruleText: string);
}
import { StylePropertyMap } from './stylemap.js';
export {};
