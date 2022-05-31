function deCamelize(s) {
    return String(s).replace(/([a-z])([A-Z])/g, function (m, g1, g2) {
        return g1 + '-' + g2.toLowerCase();
    });
}
export class StylePropertyMap extends Map {
    #tag;
    get _tag() {
        return this.#tag || (this.#tag = {});
    }
    set(name, value) {
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
    _parse(value) {
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
                        }
                        else {
                            super.set(k, v);
                        }
                    }
                }
            }
        }
    }
    toString() {
        const arr = [];
        for (const [key, v] of this) {
            if (v != undefined) {
                const tag = this.#tag?.[key];
                if (tag) {
                    const { short, priority } = tag;
                    if (short) {
                        continue;
                    }
                    else if (priority) {
                        arr.push(`${key}: ${v} !${priority};`);
                        continue;
                    }
                }
                arr.push(`${key}: ${v};`);
            }
        }
        return arr.join(' ');
    }
    getPropertyValue(name) {
        return this.get(name)?.toString() ?? '';
    }
    getPropertyPriority(name) {
        return this.#tag?.[name]?.priority ?? '';
    }
    removeProperty(name) {
        delete this.#tag?.[name];
        if (this.size > 0) {
            const v = super.get(name);
            if (v != undefined) {
                super.delete(name);
                return v;
            }
        }
        return '';
    }
    setProperty(name, value, priority) {
        return setProperty(this, name, value, priority);
    }
    get cssText() {
        return this.toString();
    }
    set cssText(value) {
        this._parse(value);
    }
    item(i) {
        for (const v of this.keys()) {
            if (0 === i--) {
                return v;
            }
            else if (i < 0) {
                break;
            }
        }
        return undefined;
    }
    styleProxy() {
        return new Proxy(this, handlerFor(this));
    }
}
export class CSSStyleDeclaration {
    static new() {
        const self = new StylePropertyMap();
        return self.styleProxy();
    }
}
function handlerFor(self) {
    const proto = StylePropertyMap.prototype;
    const _setProperty = proto.setProperty.bind(self);
    const _getPropertyValue = proto.getPropertyValue.bind(self);
    const _getPropertyPriority = proto.getPropertyPriority.bind(self);
    const _iter = proto.keys.bind(self);
    const _removeProperty = proto.removeProperty.bind(self);
    const _toString = () => self.toString();
    return {
        get(self, key) {
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
                case 'cssText':
                    return self.toString();
                case 'self':
                    return self;
                case '__starts':
                    return self[key];
                case '_importants':
                    return Object.create(Object.entries(self._tag).map((e) => [e[0], e[1].priority]));
            }
            if (typeof key === 'symbol') {
                if (key === Symbol.iterator) {
                    return _iter;
                }
            }
            else {
                if (/^-?\d+$/.test(key)) {
                    let i = ~~key;
                    for (const v of self.keys()) {
                        if (0 === i--) {
                            return v;
                        }
                        else if (i < 0) {
                            break;
                        }
                    }
                }
                else {
                    return self.getPropertyValue(deCamelize(key));
                }
            }
            return undefined;
        },
        set(self, key, value) {
            switch (key) {
                case 'cssText':
                    self._parse(value);
                    break;
                case '__starts':
                    self[key] = value;
                    break;
                default:
                    if (self[key]) {
                        throw new Error(`cant set "${key}"`);
                    }
                    self.setProperty(deCamelize(key), value);
            }
            return true;
        },
    };
}
function setProperty(_map, name, value, priority, short) {
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
                    _map.removeProperty(`${name}-top`);
                    _map.removeProperty(`${name}-right`);
                    _map.removeProperty(`${name}-bottom`);
                    _map.removeProperty(`${name}-left`);
                    break;
                default:
                    const a = value.split(/\s+/);
                    const s = _map.size;
                    if (a.length > 3) {
                        setProperty(_map, `${name}-top`, a[0], priority, name);
                        setProperty(_map, `${name}-right`, a[1], priority, name);
                        setProperty(_map, `${name}-bottom`, a[2], priority, name);
                        setProperty(_map, `${name}-left`, a[3], priority, name);
                    }
                    else if (a.length > 2) {
                        setProperty(_map, `${name}-top`, a[0], priority, name);
                        setProperty(_map, `${name}-right`, a[1], priority, name);
                        setProperty(_map, `${name}-bottom`, a[2], priority, name);
                        setProperty(_map, `${name}-left`, a[1], priority, name);
                    }
                    else if (a.length > 1) {
                        setProperty(_map, `${name}-top`, a[0], priority, name);
                        setProperty(_map, `${name}-right`, a[1], priority, name);
                        setProperty(_map, `${name}-bottom`, a[0], priority, name);
                        setProperty(_map, `${name}-left`, a[1], priority, name);
                    }
                    else if (a.length > 0) {
                        setProperty(_map, `${name}-top`, a[0], priority, name);
                        setProperty(_map, `${name}-right`, a[0], priority, name);
                        setProperty(_map, `${name}-bottom`, a[0], priority, name);
                        setProperty(_map, `${name}-left`, a[0], priority, name);
                    }
                    if (_map.size == s) {
                        return;
                    }
            }
        }
    }
    switch (value) {
        case undefined:
            break;
        case '':
            _map.removeProperty(name);
            break;
        case null:
            _map.removeProperty(name);
            break;
        default:
            _map._tag[name] = { priority, short };
            _map.set(name, value);
    }
}
//# sourceMappingURL=stylemap.js.map