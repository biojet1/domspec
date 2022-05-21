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
							const u = new CSSValue(m[1].trim());
							u.priority = m[2];
							super.set(k, u);
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
				if (typeof v === 'object') {
					const { short, priority } = v as CSSValue;
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
}

// CSSStyleValue

class CSSValue extends String {
	priority?: string;
	short?: string;
}

interface IStyleDec {
	_map: CSSMap;
	_mapq: CSSMap | undefined;
}

export class CSSStyleDeclaration {
	val?: CSSMap;

	get _map() {
		return this.val || (this.val = new CSSMap());
	}

	get _mapq() {
		return this.val;
	}

	get cssText() {
		return this._map.toString();
	}

	set cssText(value: string) {
		this._map._parse(value);
	}

	[Symbol.iterator]() {
		return this._mapq?.keys() ?? [].values();
	}

	static new() {
		const self = new CSSStyleDeclaration();
		return new Proxy<CSSStyleDeclaration>(self, handlerFor(self));
	}

	proxify() {
		return new Proxy<CSSStyleDeclaration>(this, handlerFor(this));
	}

	getPropertyValue(name: string) {
		return this._mapq?.get(name)?.valueOf() ?? '';
	}

	getPropertyPriority(name: string) {
		let v = this._mapq?.get(name);
		return (typeof v === 'object' && (v as CSSValue).priority) || '';
	}

	setProperty(name: string, value?: String, priority?: string) {
		return setProperty(this._map, name, value, priority);
	}

	removeProperty(name: string) {
		const { _mapq: _map } = this;
		if (_map && _map.size > 0) {
			const v = _map.get(name);
			if (v != undefined) {
				_map.delete(name);
				return v;
			}
		}
		return '';
	}
}

export class StyleAttr extends Attr {
	val?: CSSMap;
	_proxy?: any;

	get _map() {
		return this.val || (this.val = new CSSMap());
	}

	get _mapq() {
		return this.val;
	}

	set value(value: string) {
		this._map._parse(value);
	}

	get value() {
		return this._mapq?.toString() ?? '';
	}

	get proxy() {
		return this._proxy || (this._proxy = new Proxy<StyleAttr>(this, handlerFor(this)));
	}

	remove() {
		this._mapq?.clear();
		return super.remove();
	}

	valueOf() {
		return this._mapq?.toString() || null;
	}
}

function handlerFor(self: IStyleDec) {
	const proto = CSSStyleDeclaration.prototype;
	const _setProperty = proto.setProperty.bind(self);
	const _getPropertyValue = proto.getPropertyValue.bind(self);
	const _getPropertyPriority = proto.getPropertyPriority.bind(self);
	const _iter = proto[Symbol.iterator].bind(self);
	const _removeProperty = proto.removeProperty.bind(self);
	const _toString = () => self._map.toString();

	return {
		get(self: IStyleDec, key: string, receiver?: any) {
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
					return self._map.size;
				case 'constructor':
					return CSSStyleDeclaration;
				case '_map':
					return self._map;
				case 'cssText':
					return self._map.toString();
				case 'self':
					return self;
			}

			if (typeof key === 'symbol') {
				if (key === Symbol.iterator) {
					return _iter;
				}
			} else {
				const { _mapq: _map } = self;
				if (_map) {
					if (/^-?\d+$/.test(key)) {
						let i = parseInt(key);
						for (const v of _map.keys()) {
							if (0 === i--) {
								return v;
							} else if (i < 0) {
								break;
							}
						}
					} else {
						key = deCamelize(key);
						const val = _map.get(key);
						if (val != undefined) {
							return val.toString();
						}
						return '';
					}
				}
			}
		},
		set(self: IStyleDec, key: string, value: string) {
			switch (key) {
				case 'cssText':
					self._map._parse(value);
					break;
				default:
					if ((self as any)[key]) {
						throw new Error(`cant set "${key}"`);
					}
					setProperty(self._map, deCamelize(key), value);
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
			if (v === undefined) {
				if (priority || short) {
					const u = new CSSValue(value);
					priority && (u.priority = priority);
					short && (u.short = short);
					_map.set(name, u);
				} else {
					_map.set(name, value);
				}
			} else if (typeof v === 'object') {
				const u = v as CSSValue;
				delete u.short;
				if (u.toString() == value) {
					if (priority !== u.priority) {
						u.priority = priority;
					}
				} else {
					if (priority) {
						const u = new CSSValue(value);
						u.priority = priority;
						_map.set(name, u);
					} else {
						_map.set(name, value);
					}
				}
			} else if (v === value) {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					// no short
					_map.set(name, u);
				}
			} else {
				if (priority) {
					const u = new CSSValue(value);
					u.priority = priority;
					// no short
					_map.set(name, u);
				} else {
					_map.set(name, value);
				}
			}
	}
}

import { Element } from './element.js';
import { Attr } from './attr.js';
