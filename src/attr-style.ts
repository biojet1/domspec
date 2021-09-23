// export const fullHex = function (hex: string) {
// 	return hex.length === 4
// 		? [
// 				"#",
// 				hex.substring(1, 2),
// 				hex.substring(1, 2),
// 				hex.substring(2, 3),
// 				hex.substring(2, 3),
// 				hex.substring(3, 4),
// 				hex.substring(3, 4),
// 		  ].join("")
// 		: hex;
// };

// export const hexToRGB = function (
// 	valOrMap: string
// 	// | Map<string, string>
// ): string {
// if (valOrMap instanceof Map) {
// 	for (const [key, val] of valOrMap) {
// 		valOrMap.set(key, hexToRGB(val));
// 	}
// 	return valOrMap;
// } else

// 	if (/#[0-9a-f]{3,6}/.test(valOrMap)) {
// 		valOrMap = fullHex(valOrMap);
// 		return (
// 			"rgb(" +
// 			[
// 				parseInt(valOrMap.slice(1, 3), 16),
// 				parseInt(valOrMap.slice(3, 5), 16),
// 				parseInt(valOrMap.slice(5, 7), 16),
// 			].join(",") +
// 			")"
// 		);
// 	} else {
// 		return valOrMap;
// 	}
// };

export function deCamelize(s: string) {
	return String(s).replace(/([a-z])([A-Z])/g, function (m, g1, g2) {
		return g1 + "-" + g2.toLowerCase();
	});
}

// export function camelCase(s: string) {
// 	return String(s).replace(/([a-z])-([a-z])/g, function (m, g1, g2) {
// 		return g1 + g2.toUpperCase();
// 	});
// }

// export const cssToMap = function (css: string) {
// 	return new Map<string, string>(
// 		css
// 			.split(/\s*;\s*/)
// 			.filter(function (el) {
// 				return !!el;
// 			})
// 			.map(function (el): [string, string] {
// 				const a = el.split(/\s*:\s*/);

// 				return [a[0], a[1] || ""];
// 			})
// 	);
// };

// export const mapToCss = function (myMap: Map<string, string>) {
// 	const arr: string[] = [];
// 	for (const [key, val] of myMap) {
// 		switch (val) {
// 			case null:
// 			case undefined:
// 			case "":
// 				break;
// 			default:
// 				arr.push(`${deCamelize(key)} : ${val}`);
// 		}
// 	}
// 	return arr.join("; ");
// };

class CSSMap extends Map<string, String> {}

class CSSValue extends String {
	priority?: string;
}

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
					if (typeof v === "object") {
						const p = (v as CSSValue).priority;
						if (p) {
							arr.push(`${deCamelize(key)}: ${v} !${p};`);
						}
					}
					arr.push(`${deCamelize(key)}: ${v};`);
			}
		}
		return arr.join(" ");
	}

	parse(css: string) {
		let { map } = this;
		map.clear();
		for (const s of css.split(/\s*;\s*/)) {
			if (s) {
				const i = s.indexOf(":");
				if (i > 0) {
					const k = s.substring(0, i).trim();
					const v = s.substring(i + 1).trim();
					if (k && v) {
						const m = v.match(/(.+)\s*!\s*(\w+)$/);
						if (m) {
							const u = new CSSValue(m[1]);
							u.priority = m[2];
							map.set(k, u);
						} else {
							map.set(k, v);
						}
					}
				}
				// const [k, v] = s.split(/\s*:\s*/);

				// if (a[0]) {
				// 	map.set(a[0], a[1] || "");
				// }
			}
		}
	}
	get map() {
		return this.val || (this.val = new CSSMap());
	}
	get mapq() {
		return this.val || null;
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
		return this.format() || "";
	}
	[Symbol.iterator]() {
		const { mapq: map } = this;
		return map ? map.keys() : [].values();
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
		const { mapq: map } = this;
		map && map.clear();
		return super.remove();
	}

	setProperty(name: string, value?: String, priority?: string) {
		return setProperty(this.map, name, value, priority);
	}
	getPropertyPriority(name: string) {
		const { mapq: map } = this;
		if (map && map.size > 0) {
			const v = map.get(name);
			if (typeof v === "object") {
				return (v as CSSValue).priority || "";
			}
		}
		return "";
	}
	getPropertyValue(name: string) {
		const { mapq: map } = this;
		return (map && map.size > 0 && map.get(name)?.valueOf()) || "";
	}
	removeProperty(name: string) {
		const { mapq: map } = this;
		if (map && map.size > 0) {
			const v = map.get(name);
			if (v !== undefined) {
				map.delete(name);
				return v;
			}
		}
		return null;
	}

	valueOf() {
		return this.format() || null;
	}
}

const handler = {
	get(self: StyleAttr, key: string, receiver?: any) {
		switch (key) {
			case "setProperty":
				return (name: string, value?: string, priority?: string) =>
					setProperty(self.map, name, value, priority);

			case "getPropertyValue":
				return (name: string) => {
					const { mapq: map } = self;
					return (
						(map && map.size > 0 && map.get(name)?.valueOf()) || ""
					);
				};
			case "removeProperty":
				return (name: string) => {
					const { mapq: map } = self;
					if (map && map.size > 0) {
						const v = map.get(name);
						if (v !== undefined) {
							map.delete(name);
							return v;
						}
					}
					return null;
				};

			case "getPropertyPriority":
				return (name: string) => {
					const { mapq: map } = self;
					if (map && map.size > 0) {
						const v = map.get(name);
						if (typeof v === "object") {
							return (v as CSSValue).priority || "";
						}
					}
					return "";
				};

			case "length":
				return self.map.size;
			case "cssText":
				return self.cssText;
			case "toString":
				return () => {
					return self.cssText;
				};
		}
		if (typeof key === "symbol") {
			if (key === Symbol.iterator) {
				return () => {
					const { mapq: map } = self;
					return map ? map.keys() : [].values();
				};
			}
			// return self[Symbol.iterator];
			console.log(`handler: symbol ${key}`);
			return undefined;
		} else if (/^-?\d+$/.test(key)) {
			let i = parseInt(key);
			for (const v of self.map.keys()) {
				if (0 === i--) {
					return v;
				} else if (i < 0) {
					break;
				}
			}
			return undefined;
		}
		key = deCamelize(key);
		return self.map.get(key);
	},
	set(self: StyleAttr, key: string, value: string) {
		if (key in StyleAttr.prototype) {
			switch (key) {
				case "cssText":
					self.cssText = value;
					break;
				default:
					throw new Error(`cant set "${key}"`);
			}
			// (StyleAttr.prototype as any)[key];
		} else {
			setProperty(self.map, deCamelize(key), value);
		}
		return true;
	},
};

function setProperty(
	map: CSSMap,
	name: string,
	value?: String,
	priority?: string
) {
	L1: switch (name) {
		case "margin":
		case "padding": {
			switch (value) {
				case undefined:
					break;
				case null:
					map.set(name, "");
					break;
				case "inherit":
				case "initial":
				case "unset":
				case "revert":
					break L1;
				case "":
					map.delete(`${name}-top`);
					map.delete(`${name}-right`);
					map.delete(`${name}-bottom`);
					map.delete(`${name}-left`);
					break;
				default:
					const a = value.split(/\s+/);
					if (a.length > 3) {
						setProperty(map, `${name}-top`, a[0], priority);
						setProperty(map, `${name}-right`, a[1], priority);
						setProperty(map, `${name}-bottom`, a[2], priority);
						setProperty(map, `${name}-left`, a[3], priority);
					} else if (a.length > 2) {
						setProperty(map, `${name}-top`, a[0], priority);
						setProperty(map, `${name}-right`, a[1], priority);
						setProperty(map, `${name}-bottom`, a[2], priority);
						setProperty(map, `${name}-left`, a[1], priority);
					} else if (a.length > 1) {
						setProperty(map, `${name}-top`, a[0], priority);
						setProperty(map, `${name}-right`, a[1], priority);
						setProperty(map, `${name}-bottom`, a[0], priority);
						setProperty(map, `${name}-left`, a[1], priority);
					} else if (a.length > 0) {
						setProperty(map, `${name}-top`, a[0], priority);
						setProperty(map, `${name}-right`, a[0], priority);
						setProperty(map, `${name}-bottom`, a[0], priority);
						setProperty(map, `${name}-left`, a[0], priority);
					}
			}
			return;
		}
	}
	switch (value) {
		case undefined:
			break;
		case "":
			map.delete(name);
			break;
		case null:
			map.set(name, "");
			break;
		default:
			const v = map.get(name);
			if (v === undefined) {
				if (priority) {
					const v = new CSSValue(value);
					v.priority = priority;
					map.set(name, v);
				} else {
					map.set(name, value);
				}
			} else if (typeof v === "object") {
				if (v.toString() == value) {
					if (priority !== (v as CSSValue).priority) {
						(v as CSSValue).priority = priority;
					}
				} else {
					if (priority) {
						const u = new CSSValue(value);
						u.priority = priority;
						map.set(name, u);
					} else {
						map.set(name, value);
					}
				}
			} else if (v === value) {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					map.set(name, u);
				}
			} else {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					map.set(name, u);
				} else {
					map.set(name, value);
				}
			}
	}
}

import { Element } from "./element.js";
import { Attr } from "./attr.js";
