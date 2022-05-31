export class EventTarget {
    _listeners;
    addEventListener(type, callback, options) {
        let { _listeners } = this;
        let entry;
        if (typeof options === "boolean") {
            entry = { capture: options };
        }
        else {
            entry = options || {};
        }
        entry.listener = callback;
        if (_listeners) {
            const { [type]: stack } = _listeners;
            if (stack) {
                stack.push(entry);
            }
            else {
                _listeners[type] = [entry];
            }
        }
        else {
            this._listeners = { [type]: [entry] };
        }
    }
    removeEventListener(type, callback) {
        let { _listeners } = this;
        if (_listeners) {
            const { [type]: stack } = _listeners;
            if (stack)
                for (let i = stack.length; i-- > 0;) {
                    if (stack[i].listener === callback) {
                        stack.splice(i, 1);
                    }
                }
        }
    }
    *_enumAncestorTargets() { }
    dispatchEvent(event, trusted) {
        if (typeof trusted !== "boolean")
            trusted = false;
        function invoke(target, event) {
            const { _listeners } = target;
            const { type, eventPhase: phase } = event;
            event.currentTarget = target;
            if (_listeners) {
                const { [type]: stack } = _listeners;
                if (stack) {
                    for (const { listener, capture } of stack) {
                        if (event._immediatePropagationStopped) {
                            return !event.defaultPrevented;
                        }
                        switch (phase) {
                            case Event.CAPTURING_PHASE:
                                if (!capture)
                                    continue;
                                break;
                            case Event.BUBBLING_PHASE:
                                if (capture)
                                    continue;
                                break;
                        }
                        if (typeof listener === "function") {
                            listener.call(target, event);
                        }
                        else if (listener) {
                            listener.handleEvent(event);
                        }
                    }
                    return !event.defaultPrevented;
                }
            }
        }
        if (!event._initialized || event._dispatching)
            throw DOMException.new("InvalidStateError");
        event.isTrusted = trusted;
        event._dispatching = true;
        event.target = this;
        let ancestors = Array.from(this._enumAncestorTargets());
        event.eventPhase = Event.CAPTURING_PHASE;
        for (let i = ancestors.length; i-- > 0 && !event._propagationStopped;)
            invoke(ancestors[i], event);
        if (!event._propagationStopped) {
            event.eventPhase = Event.AT_TARGET;
            invoke(this, event);
        }
        if (event.bubbles && !event._propagationStopped) {
            event.eventPhase = Event.BUBBLING_PHASE;
            for (const et of ancestors) {
                invoke(et, event);
                if (event._propagationStopped)
                    break;
            }
        }
        event._dispatching = false;
        event.eventPhase = Event.AT_TARGET;
        event.currentTarget = null;
        event._propagationStopped = false;
        event._immediatePropagationStopped = false;
        return !event.defaultPrevented;
    }
    static get DOCUMENT_POSITION_DISCONNECTED() {
        return 1;
    }
    get DOCUMENT_POSITION_DISCONNECTED() {
        return 1;
    }
    static get DOCUMENT_POSITION_PRECEDING() {
        return 2;
    }
    get DOCUMENT_POSITION_PRECEDING() {
        return 2;
    }
    static get DOCUMENT_POSITION_FOLLOWING() {
        return 4;
    }
    get DOCUMENT_POSITION_FOLLOWING() {
        return 4;
    }
    static get DOCUMENT_POSITION_CONTAINS() {
        return 8;
    }
    get DOCUMENT_POSITION_CONTAINS() {
        return 8;
    }
    static get DOCUMENT_POSITION_CONTAINED_BY() {
        return 16;
    }
    get DOCUMENT_POSITION_CONTAINED_BY() {
        return 16;
    }
    static get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC() {
        return 32;
    }
    get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC() {
        return 32;
    }
}
export class Event {
    static NONE = 0;
    static CAPTURING_PHASE = 1;
    static AT_TARGET = 2;
    static BUBBLING_PHASE = 3;
    type;
    target;
    currentTarget;
    eventPhase;
    bubbles;
    cancelable;
    composed;
    isTrusted;
    defaultPrevented;
    timeStamp;
    _propagationStopped;
    _immediatePropagationStopped;
    _dispatching;
    _initialized;
    constructor(type, dictionary) {
        this.type = type || "";
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 2;
        this.bubbles = dictionary?.bubbles || false;
        this.cancelable = dictionary?.cancelable || false;
        this.composed = dictionary?.composed || false;
        this.isTrusted = false;
        this.defaultPrevented = false;
        this.timeStamp = Date.now();
        this._initialized = true;
        this._dispatching = false;
    }
    initEvent(type, bubbles = false, cancelable = false) {
        this._initialized = true;
        if (this._dispatching)
            return;
        delete this._propagationStopped;
        delete this._immediatePropagationStopped;
        this.defaultPrevented = false;
        this.isTrusted = false;
        this.target = null;
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        if (type === undefined) {
            throw new TypeError();
        }
    }
    stopImmediatePropagation() {
        this._propagationStopped = true;
        this._immediatePropagationStopped = true;
    }
    stopPropagation() {
        this._propagationStopped = true;
    }
    preventDefault() {
        if (this.cancelable) {
            this.defaultPrevented = true;
        }
    }
    get cancelBubble() {
        return this._propagationStopped || false;
    }
    set cancelBubble(cancel) {
        this._propagationStopped = cancel;
    }
    get srcElement() {
        return this.target || null;
    }
    get returnValue() {
        return this.cancelable ? !this.defaultPrevented : true;
    }
    set returnValue(b) {
        if (this.cancelable && !this.defaultPrevented) {
            this.defaultPrevented = !this.defaultPrevented;
        }
    }
    get CAPTURING_PHASE() {
        return 1;
    }
    get AT_TARGET() {
        return 2;
    }
    get BUBBLING_PHASE() {
        return 3;
    }
    get NONE() {
        return 0;
    }
}
export class MessageEvent extends Event {
    data;
    origin;
    lastEventId;
    source;
    ports;
    constructor(type, init) {
        super(type, init);
        if (init) {
            const { data, origin, lastEventId, source, ports } = init;
            if (data)
                this.data = data;
            if (origin)
                this.origin = origin;
            if (lastEventId)
                this.lastEventId = lastEventId;
            if (source)
                this.source = source;
            if (ports)
                this.ports = ports;
        }
    }
}
export class DOMException {
    name;
    message;
    constructor(message, name = "") {
        this.message = message;
        this.name = name;
    }
    toString() {
        const { name, message, code } = this;
        return `DOMException: ${code} ${name} ${message}`;
    }
    get code() {
        switch (this.name) {
            case "IndexSizeError":
                return 1;
            case "HierarchyRequestError":
                return 3;
            case "WrongDocumentError":
                return 4;
            case "InvalidCharacterError":
                return 5;
            case "NoModificationAllowedError":
                return 7;
            case "NotFoundError":
                return 8;
            case "NotSupportedError":
                return 9;
            case "InUseAttributeError":
                return 10;
            case "InvalidStateError":
                return 11;
            case "SyntaxError":
                return 12;
            case "InvalidModificationError":
                return 13;
            case "NamespaceError":
                return 14;
            case "InvalidAccessError":
                return 15;
            case "TypeMismatchError":
                return 17;
            case "SecurityError":
                return 18;
            case "NetworkError":
                return 19;
            case "AbortError":
                return 20;
            case "URLMismatchError":
                return 21;
            case "QuotaExceededError":
                return 22;
            case "TimeoutError":
                return 23;
            case "InvalidNodeTypeError":
                return 24;
            case "DataCloneError":
                return 25;
            default:
                return 0;
        }
    }
    static new(name, message = "") {
        return new DOMException(message, name);
    }
}
//# sourceMappingURL=event-target.js.map