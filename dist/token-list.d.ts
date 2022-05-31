export declare class DOMTokenList extends Set<string> {
    add(...tokens: Array<string>): this;
    contains(token: string): boolean;
    remove(...tokens: Array<string>): void;
    toggle(token: string, force?: boolean): boolean;
    replace(token: string, newToken: string): boolean;
    supports(token: string): boolean;
    format(): string;
    parse(tokens: string): void;
    get value(): string;
    get length(): number;
    item(index: number): string | undefined;
    toString(): string;
}
