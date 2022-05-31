export declare class ClassAttr extends Attr {
    val?: DOMTokenList;
    get tokens(): DOMTokenList;
    get tokensQ(): DOMTokenList | null;
    set value(value: string);
    get value(): string;
    toString(): string;
    valueOf(): string | null;
}
import { Attr } from "./attr.js";
import { DOMTokenList } from "./token-list.js";
