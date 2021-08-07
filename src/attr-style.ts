// get style() {
//   return this[STYLE] || (
//     this[STYLE] = new CSSStyleDeclaration(this)
//   );
// }
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

export const style_handler = {
	get(target: Element, key: string) {
		const styles = target.getAttribute("style") || "";
		const styleMap = cssToMap(styles);
		if (key === "cssText") {
			return styles;
		}
		if (key === "setProperty") {
			return function (propertyName: string, value = "", priority = "") {
				target.style[propertyName] =
					value + (priority ? ` !${priority}` : "");
			};
		}
		key = deCamelize(key);
		if (!styleMap.has(key)) return "";
		return styleMap.get(key);
	},
	set(target: Element, key: string, value: string) {
		key = deCamelize(key);
		switch (key) {
			case "css-text": {
				// ensure correct spacing and syntax by converting back and forth
				target.setAttribute("style", mapToCss(cssToMap(value)));
				return true;
			}
			default: {
				value = hexToRGB(value.toString());
				const styles = target.getAttribute("style") || "";
				const styleMap = cssToMap(styles);
				switch (key) {
					case null:
					case undefined:
					case "":
						styleMap.delete(key);
						break;
					default:
						styleMap.set(key, value);
				}
				target.setAttribute("style", mapToCss(styleMap));
				return true;
			}
		}
	},
};

class CSSMap extends Map<string, string> {
	format() {
		const arr: string[] = [];
		for (const [key, val] of this) {
			switch (val) {
				case null:
				case undefined:
				case "":
					break;
				default:
					arr.push(`${deCamelize(key)}:${val}`);
			}
		}
		return arr.join(";");
	}
	parse(css: string) {
		const map = this;
		map.clear();
		// console.info(css);
		for (const s of css.split(/\s*;\s*/)) {
			if (s) {
				const a = s.split(/\s*:\s*/);
				a[0] && map.set(a[0], a[1] || "");
			}
		}
		// console.info(map);
	}
}

export class CSSMapAttr extends Attr {
	val?: CSSMap;
	_proxy?: any;

	// format() {
	// 	let { val } = this;
	// 	if (!val) {
	// 		return "";
	// 	}
	// 	const arr: string[] = [];
	// 	for (const [key, v] of val) {
	// 		switch (v) {
	// 			case null:
	// 			case undefined:
	// 			case "":
	// 				break;
	// 			default:
	// 				arr.push(`${deCamelize(key)} : ${v}`);
	// 		}
	// 	}
	// 	return arr.join("; ");
	// }

	// parse(css: string) {
	// 	let { map } = this;
	// 	map.clear();
	// 	for (const s of css.split(/\s*;\s*/)) {
	// 		if (s) {
	// 			const a = s.split(/\s*:\s*/);
	// 			a[0] && map.set(a[0], a[1] || "");
	// 		}
	// 	}
	// }
	get map() {
		return this.val || (this.val = new CSSMap());
	}

	get cssText() {
		return this.map.format();
	}

	set cssText(value: string) {
		this.map.parse(value);
		// refs.get(this).setAttribute("style", value);
	}

	set value(value: string) {
		this.map.parse(value);
	}
	get value() {
		return this.map.format();
	}
	[Symbol.iterator]() {
		return this.map.keys();
	}
	get proxy() {
		return (
			this._proxy || (this._proxy = new Proxy<CSSMapAttr>(this, handler))
		);
	}

	toString() {
		return this.map.format();
	}

	remove() {
		let { val } = this;
		val && val.clear();
		return super.remove();
	}

	dumpXML() {
		const { val } = this;
		return val && val.size > 0 ? super.dumpXML() : "";
	}
}

export const handler = {
	get(attr: CSSMapAttr, key: string) {
		if (key in CSSMapAttr.prototype) return (attr as any)[key];
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
		// if (typeof key === "number")
		key = deCamelize(key);
		return attr.map.get(key);
	},
	set(attr: CSSMapAttr, key: string, value: string) {
		if (key === "cssText") {
			attr.map.parse(value);
		} else {
			key = deCamelize(key);
			switch (value) {
				case null:
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
import { TypeAttr, Attr } from "./attr.js";
