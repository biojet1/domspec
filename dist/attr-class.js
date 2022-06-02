export class ClassAttr extends Attr {
    val;
    get tokens() {
        return this.val || (this.val = new DOMTokenList());
    }
    get tokensQ() {
        return this.val || null;
    }
    set value(value) {
        this.tokens.parse(value);
    }
    get value() {
        return this.tokensQ?.format() || "";
    }
    toString() {
        return this.value;
    }
    valueOf() {
        const { tokensQ: tokens } = this;
        return tokens && tokens.size > 0 ? tokens.format() : null;
    }
}
import { Attr } from "./attr.js";
import { DOMTokenList } from "./token-list.js";
//# sourceMappingURL=attr-class.js.map