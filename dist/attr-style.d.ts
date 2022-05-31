export declare class StyleAttr extends Attr {
    map?: StylePropertyMap;
    _proxy?: any;
    get MAP(): StylePropertyMap;
    set value(value: string);
    get proxy(): any;
    get value(): string;
    remove(): void;
    valueOf(): string | null;
}
import { StylePropertyMap } from './css/stylemap.js';
import { Attr } from './attr.js';
