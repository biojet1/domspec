export const fullHex = function (hex: string) {
	return hex.length === 4
		? [
				"#",
				hex.substring(1, 2),
				hex.substring(1, 2),
				hex.substring(2, 3),
				hex.substring(2, 3),
				hex.substring(3, 4),
				hex.substring(3, 4),
		  ].join("")
		: hex;
};

export const hexToRGB = function (
	valOrMap: string
	// | Map<string, string>
): string {
	/*if (valOrMap instanceof Map) {
		for (const [key, val] of valOrMap) {
			valOrMap.set(key, hexToRGB(val));
		}
		return valOrMap;
	} else */

	if (/#[0-9a-f]{3,6}/.test(valOrMap)) {
		valOrMap = fullHex(valOrMap);
		return (
			"rgb(" +
			[
				parseInt(valOrMap.slice(1, 3), 16),
				parseInt(valOrMap.slice(3, 5), 16),
				parseInt(valOrMap.slice(5, 7), 16),
			].join(",") +
			")"
		);
	} else {
		return valOrMap;
	}
};

export function deCamelize(s: string) {
	return String(s).replace(/([a-z])([A-Z])/g, function (m, g1, g2) {
		return g1 + "-" + g2.toLowerCase();
	});
}

export function camelCase(s: string) {
	return String(s).replace(/([a-z])-([a-z])/g, function (m, g1, g2) {
		return g1 + g2.toUpperCase();
	});
}

export const cssToMap = function (css: string) {
	return new Map<string, string>(
		css
			.split(/\s*;\s*/)
			.filter(function (el) {
				return !!el;
			})
			.map(function (el): [string, string] {
				const a = el.split(/\s*:\s*/);
				return [a[0], a[1] || ""];
			})
	);
};

export const mapToCss = function (myMap: Map<string, string>) {
	const arr: string[] = [];
	for (const [key, val] of myMap) {
		switch (val) {
			case null:
			case undefined:
			case "":
				break;
			default:
				arr.push(`${deCamelize(key)} : ${val}`);
		}
	}
	return arr.join("; ");
};

class CSSMap extends Map<string, string> {}

export class StyleAttr extends Attr {
	val?: CSSMap;
	// val?: CSSMap|string;
	_proxy?: any;

	format() {
		let { mapq: map } = this;
		if (!map) {
			return "";
		}
		const arr: string[] = [];
		for (const [key, v] of map) {
			switch (v) {
				case null:
				case undefined:
				case "":
					break;
				default:
					arr.push(`${deCamelize(key)}:${v}`);
			}
		}
		return arr.join(";");
	}

	parse(css: string) {
		let { map } = this;
		map.clear();
		for (const s of css.split(/\s*;\s*/)) {
			if (s) {
				const a = s.split(/\s*:\s*/);
				a[0] && map.set(a[0], a[1] || "");
			}
		}
	}
	get map() {
		return this.val || (this.val = new CSSMap());
		// return typeof val === "string" ? (this.val = new CSSMap(val)) : val;
	}
	get mapq() {
		return this.val || null;
		// return val && (typeof val === "string" ? (this.val = new CSSMap(val)) : val) || null;
	}

	get cssText() {
		return this.format();
	}

	set cssText(value: string) {
		this.parse(value);
	}

	set value(value: string) {
		this.parse(value);
		// this.val = value;
	}
	get value() {
		return this.format();
		// return typeof val === "string" ? val : this.format();
	}
	[Symbol.iterator]() {
		return this.map.keys();
	}
	get proxy() {
		return (
			this._proxy || (this._proxy = new Proxy<StyleAttr>(this, handler))
		);
	}

	toString() {
		return this.format();
	}

	remove() {
		let { mapq: map } = this;
		map && map.clear();
		return super.remove();
	}

	dumpXML() {
		let { mapq: map } = this;
		return map && map.size > 0 ? super.dumpXML() : "";
	}


}

const handler = {
	get(attr: StyleAttr, key: string) {
		if (key in StyleAttr.prototype) return (attr as any)[key];
		if (key === "length") return attr.map.size;
		if (/^-?\d+$/.test(key)) {
			let i = parseInt(key);
			for (const v of attr.map.keys()) {
				if (0 === i--) {
					return v;
				} else if (i < 0) {
					break;
				}
			}
			return undefined;
		}
		key = deCamelize(key);
		return attr.map.get(key);
	},
	set(attr: StyleAttr, key: string, value: string) {
		if (key === "cssText") {
			attr.parse(value);
		} else {
			key = deCamelize(key);
			switch (value) {
				case null:
				case undefined:
				case "":
					attr.map.delete(key);
					break;
				default:
					attr.map.set(key, value);
			}
		}
		return true;
	},
};

import { Element } from "./element.js";
import { Attr } from "./attr.js";
