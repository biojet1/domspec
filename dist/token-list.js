function checkToken(token) {
    if (token.length > 0) {
        if (/\s/.test(token)) {
            throw DOMException.new("SyntaxError", `white space`);
        }
        return token;
    }
    else {
        throw DOMException.new("SyntaxError", `empty token`);
    }
}
export class DOMTokenList extends Set {
    add(...tokens) {
        for (const token of tokens) {
            checkToken(token) && super.add(token);
        }
        return this;
    }
    contains(token) {
        return this.has(token);
    }
    remove(...tokens) {
        for (const token of tokens) {
            checkToken(token) && this.delete(token);
        }
    }
    toggle(token, force) {
        if (checkToken(token)) {
            if (this.has(token)) {
                if (force)
                    return true;
                this.delete(token);
            }
            else if (force || force === undefined) {
                this.add(token);
                return true;
            }
        }
        return false;
    }
    replace(token, newToken) {
        if (this.has(token)) {
            this.delete(token);
            this.add(newToken);
            return true;
        }
        return false;
    }
    supports(token) {
        return true;
    }
    format() {
        return [...this].join(" ");
    }
    parse(tokens) {
        this.clear();
        for (const token of tokens.split(/[\t\n\f\r ]+/))
            token.length > 0 && super.add(token);
    }
    get value() {
        return this.format();
    }
    get length() {
        return this.size;
    }
    item(index) {
        if (index >= 0) {
            for (const token of this) {
                if (index-- === 0) {
                    return token;
                }
                else if (index < 0) {
                    break;
                }
            }
        }
    }
    toString() {
        return this.format();
    }
}
import { DOMException } from "./event-target.js";
//# sourceMappingURL=token-list.js.map