declare class DocCategory {
    ignoreCase?: boolean;
    isEmptyElement(tag: string): boolean;
}
declare class HTMLDoc extends DocCategory {
    constructor();
}
