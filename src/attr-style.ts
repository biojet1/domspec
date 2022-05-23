
export class StyleAttr extends Attr {
	map?: StylePropertyMap;
	_proxy?: any;

	get MAP() {
		return this.map || (this.map = new StylePropertyMap());
	}

	set value(value: string) {
		this.MAP._parse(value);
	}

	get proxy() {
		return this._proxy || (this._proxy = this.MAP.proxify());
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
