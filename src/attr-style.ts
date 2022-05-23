export function deCamelize(s: string) {
	return String(s).replace(/([a-z])([A-Z])/g, function (m, g1, g2) {
		return g1 + '-' + g2.toLowerCase();
	});
}
// StylePropertyMap
class CSSMap extends Map<string, String> {
	// append(key: string, value: String) {
	// 	this.set(key, value);
	// }
	__tag?: any;
	// { priority?: string; short?: string }

	get _tag() {
		return this.__tag || (this.__tag = {});
	}

	set(name: string, value: String): this {
		switch (value) {
			case undefined:
			case null:
			case '':
				throw new TypeError('Invalid type for property');
			default:
				super.set(name, value);
		}
		return this;
	}

	_parse(value: string) {
		this.clear();
		for (const s of value.split(/\s*;\s*/)) {
			if (s) {
				const i = s.indexOf(':');
				if (i > 0) {
					const k = s.substring(0, i).trim();
					const v = s.substring(i + 1).trim();
					if (k && v) {
						const m = v.match(/(.+)\s*!\s*(\w+)$/);
						if (m) {
							super.set(k, m[1].trim());
							this._tag[k] = { priority: m[2] };
						} else {
							super.set(k, v);
						}
					}
				}
			}
		}
	}
	toString() {
		const arr: string[] = [];
		for (const [key, v] of this) {
			if (v) {
				const tag = this.__tag?.[key];
				if (tag) {
					const { short, priority } = tag;
					if (short) {
						continue;
					} else if (priority) {
						arr.push(`${key}: ${v} !${priority};`);
						continue;
					}
				}
				arr.push(`${key}: ${v};`);
			}
		}
		return arr.join(' ');
	}
	// CSSStyleDeclaration
	getPropertyValue(name: string) {
		return this.get(name)?.toString() ?? '';
	}

	getPropertyPriority(name: string) {
		return this.__tag?.[name]?.priority ?? '';
	}

	removeProperty(name: string) {
		delete this.__tag?.[name];
		if (this.size > 0) {
			const v = super.get(name);
			if (v != undefined) {
				super.delete(name);
				return v;
			}
		}
		return '';
	}

	setProperty(name: string, value?: String, priority?: string) {
		return setProperty(this, name, value, priority);
	}

	get cssText() {
		return this.toString();
	}

	set cssText(value: string) {
		this._parse(value);
	}

	item(i: number) {
		for (const v of this.keys()) {
			if (0 === i--) {
				return v;
			} else if (i < 0) {
				break;
			}
		}
	}
	// proxy CSSStyleDeclaration
	proxify() {
		return new Proxy<CSSMap>(this, handlerFor(this));
	}
}

export class CSSStyleDeclaration {

	// _sm = new CSSMap();

	static new() {
		const self = new CSSMap();
		return self.proxify();
	}

	// [Symbol.iterator](): IterableIterator<string> {
	// 	return this.keys();
	// }
}

export class StyleAttr extends Attr {
	map?: CSSMap;
	_proxy?: any;

	get MAP() {
		return this.map || (this.map = new CSSMap());
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

function handlerFor(self: CSSMap) {
	const proto = CSSMap.prototype;
	const _setProperty = proto.setProperty.bind(self);
	const _getPropertyValue = proto.getPropertyValue.bind(self);
	const _getPropertyPriority = proto.getPropertyPriority.bind(self);
	const _iter = proto.keys.bind(self);
	const _removeProperty = proto.removeProperty.bind(self);
	const _toString = () => self.toString();

	return {
		get(self: CSSMap, key: string, receiver?: any) {
			switch (key) {
				case 'setProperty':
					return _setProperty;
				case 'getPropertyValue':
					return _getPropertyValue;
				case 'getPropertyPriority':
					return _getPropertyPriority;
				case 'removeProperty':
					return _removeProperty;
				case 'toString':
					return _toString;
				case 'length':
					return self.size;
				// case 'constructor':
				// 	return CSSStyleDeclaration;
				case 'cssText':
					return self.toString();
				case 'self':
					return self;
			}

			if (typeof key === 'symbol') {
				if (key === Symbol.iterator) {
					return _iter;
				}
			} else {
				if (/^-?\d+$/.test(key)) {
					let i = parseInt(key);
					for (const v of self.keys()) {
						if (0 === i--) {
							return v;
						} else if (i < 0) {
							break;
						}
					}
				} else {
					key = deCamelize(key);
					const val = self.get(key);
					if (val != undefined) {
						return val.toString();
					}
					return '';
				}
			}
		},
		set(self: CSSMap, key: string, value: string) {
			switch (key) {
				case 'cssText':
					self._parse(value);
					break;
				default:
					if ((self as any)[key]) {
						throw new Error(`cant set "${key}"`);
					}
					setProperty(self, deCamelize(key), value);
			}
			return true;
		},
	};
}

function setProperty(
	_map: CSSMap,
	name: string,
	value?: String,
	priority?: string,
	short?: string,
) {
	L1: switch (name) {
		case 'margin':
		case 'padding': {
			switch (value) {
				case undefined:
					break;
				case null:
					_map.set(name, '');
					break;
				case 'inherit':
				case 'initial':
				case 'unset':
				case 'revert':
					break L1;
				case '':
					_map.delete(`${name}-top`);
					_map.delete(`${name}-right`);
					_map.delete(`${name}-bottom`);
					_map.delete(`${name}-left`);
					break;
				default:
					const a = value.split(/\s+/);
					const s = _map.size;
					if (a.length > 3) {
						setProperty(_map, `${name}-top`, a[0], priority, name);
						setProperty(_map, `${name}-right`, a[1], priority, name);
						setProperty(_map, `${name}-bottom`, a[2], priority, name);
						setProperty(_map, `${name}-left`, a[3], priority, name);
					} else if (a.length > 2) {
						setProperty(_map, `${name}-top`, a[0], priority, name);
						setProperty(_map, `${name}-right`, a[1], priority, name);
						setProperty(_map, `${name}-bottom`, a[2], priority, name);
						setProperty(_map, `${name}-left`, a[1], priority, name);
					} else if (a.length > 1) {
						setProperty(_map, `${name}-top`, a[0], priority, name);
						setProperty(_map, `${name}-right`, a[1], priority, name);
						setProperty(_map, `${name}-bottom`, a[0], priority, name);
						setProperty(_map, `${name}-left`, a[1], priority, name);
					} else if (a.length > 0) {
						setProperty(_map, `${name}-top`, a[0], priority, name);
						setProperty(_map, `${name}-right`, a[0], priority, name);
						setProperty(_map, `${name}-bottom`, a[0], priority, name);
						setProperty(_map, `${name}-left`, a[0], priority, name);
					}
					if (_map.size == s) {
						// nothing added
						return;
					}
			}
			// return;
		}
		// TODO:
		// border...
	}
	switch (value) {
		case undefined:
			break;
		case '':
			_map.delete(name);
			break;
		case null:
			_map.delete(name);
			break;
		default:
			const v = _map.get(name);

			// if (v == '') {
			if (priority || short) {
				_map._tag[name] = { priority, short };
			} else {
				delete _map.__tag?.[name];
			}
			_map.set(name, value);
		// }

		// if (v === undefined) {
		// 	if (priority || short) {
		// 		const u = new CSSValue(value);
		// 		priority && (u.priority = priority);
		// 		short && (u.short = short);
		// 		_map.set(name, u);
		// 	} else {
		// 		_map.set(name, value);
		// 	}
		// } else if (typeof v === 'object') {
		// 	const u = v as CSSValue;
		// 	delete u.short;

		// 	if (u.toString() == value) {
		// 		if (priority !== u.priority) {
		// 			u.priority = priority;
		// 		}
		// 	} else {
		// 		if (priority) {
		// 			const u = new CSSValue(value);
		// 			u.priority = priority;
		// 			_map.set(name, u);
		// 		} else {
		// 			_map.set(name, value);
		// 		}
		// 	}
		// } else if (v === value) {
		// 	if (priority) {
		// 		const u = new CSSValue(value);
		// 		u.priority = priority;
		// 		// no short
		// 		_map.set(name, u);
		// 	}
		// } else {
		// 	if (priority) {
		// 		const u = new CSSValue(value);
		// 		u.priority = priority;
		// 		// no short
		// 		_map.set(name, u);
		// 	} else {
		// 		_map.set(name, value);
		// 	}
		// }
	}
}

import { Element } from './element.js';
import { Attr } from './attr.js';
