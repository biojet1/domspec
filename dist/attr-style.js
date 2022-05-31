export class StyleAttr extends Attr {
    map;
    _proxy;
    get MAP() {
        return this.map || (this.map = new StylePropertyMap());
    }
    set value(value) {
        this.MAP._parse(value);
    }
    get proxy() {
        return this._proxy || (this._proxy = this.MAP.styleProxy());
    }
    get value() {
        return this.map?.toString() ?? '';
    }
    remove() {
        this.map?.clear();
        return super.remove();
    }
    valueOf() {
        return this.map?.toString() || null;
    }
}
import { StylePropertyMap } from './css/stylemap.js';
import { Attr } from './attr.js';
//# sourceMappingURL=attr-style.js.map