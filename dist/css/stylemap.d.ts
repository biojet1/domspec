export declare class StylePropertyMap extends Map<string, String> {
    #private;
    get _tag(): any;
    set(name: string, value: String): this;
    _parse(value: string): void;
    toString(): string;
    getPropertyValue(name: string): string;
    getPropertyPriority(name: string): any;
    removeProperty(name: string): String | "";
    setProperty(name: string, value?: String, priority?: string): void;
    get cssText(): string;
    set cssText(value: string);
    item(i: number): string | undefined;
    styleProxy(): StylePropertyMap;
}
export declare class CSSStyleDeclaration {
    static new(): StylePropertyMap;
}
