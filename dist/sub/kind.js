"use strict";
class DocCategory {
    ignoreCase;
    isEmptyElement(tag) {
        return false;
    }
}
class HTMLDoc extends DocCategory {
    constructor() {
        super();
        this.ignoreCase = true;
    }
}
//# sourceMappingURL=kind.js.map