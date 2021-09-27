export interface EventInit {
	bubbles?: boolean;
	cancelable?: boolean;
	composed?: boolean;
}

export interface CustomEventInit extends EventInit {
	detail?: any;
}

export interface MessageEventInit extends EventInit {
	data?: any;
	origin?: string;
	lastEventId?: string;
	source?: EventTarget;
	ports?: EventTarget[];
}

export interface EventListener {
	handleEvent(event: Event): undefined;
}

type CallBack = (event: Event) => undefined;

interface EventEntry {
	capture?: boolean;
	once?: boolean;
	passive?: boolean;
	listener?: EventListener | CallBack;
}

interface EventStack {
	[key: string]: Array<EventEntry>;
}

export class EventTarget {
	_listeners?: EventStack;
	addEventListener(
		type: string,
		callback: EventListener | CallBack,
		options: EventEntry | boolean
	) {
		// console.log("[addEventListener]", type);
		let { _listeners } = this;
		let entry: EventEntry;
		if (typeof options === "boolean") {
			entry = { capture: options };
		} else {
			entry = options || {};
		}
		entry.listener = callback;

		if (_listeners) {
			const { [type]: stack } = _listeners;
			if (stack) {
				stack.push(entry);
			} else {
				_listeners[type] = [entry];
			}
		} else {
			this._listeners = { [type]: [entry] };
		}
	}

	removeEventListener(type: string, callback: EventListener | CallBack) {
		let { _listeners } = this;
		if (_listeners) {
			const { [type]: stack } = _listeners;
			if (stack)
				for (let i = stack.length; i-- > 0; ) {
					if (stack[i].listener === callback) {
						stack.splice(i, 1);
					}
					// if (stack[i] === callback) {
					// 	stack.splice(i, 1);
					// 	// return;
					// }
				}
		}
	}
	*_enumAncestorTargets(): Generator<EventTarget, void, unknown> {}

	dispatchEvent(event: Event, trusted?: boolean) {
		// console.log("[dispatchEvent]", event);
		if (typeof trusted !== "boolean") trusted = false;
		function invoke(target: EventTarget, event: Event) {
			const { _listeners } = target;
			const { type, eventPhase: phase } = event;

			event.currentTarget = target;

			// If there was an individual handler defined, invoke it first
			// XXX: see comment above: this shouldn't always be first.
			// if (
			// 	phase !== Event.CAPTURING_PHASE &&
			// 	target._handlers &&
			// 	target._handlers[type]
			// ) {
			// 	let handler = target._handlers[type];
			// 	let rv;
			// 	if (typeof handler === "function") {
			// 		rv = handler.call(event.currentTarget, event);
			// 	} else {
			// 		let f = handler.handleEvent;
			// 		if (typeof f !== "function")
			// 			throw new TypeError(
			// 				"handleEvent property of " +
			// 					"event handler object is" +
			// 					"not a function."
			// 			);
			// 		rv = f.call(handler, event);
			// 	}

			// 	switch (event.type) {
			// 		case "mouseover":
			// 			if (rv === true)
			// 				// Historical baggage
			// 				event.preventDefault();
			// 			break;
			// 		case "beforeunload":
			// 		// XXX: eventually we need a special case here
			// 		// falls through
			// 		default:
			// 			if (rv === false) event.preventDefault();
			// 			break;
			// 	}
			// }

			// Now invoke list list of _listeners for this target and type
			// let list = target._listeners && target._listeners[type];
			// if (!list) return;
			// list = list.slice();
			// for (let i = 0, n = list.length; i < n; i++) {
			// 	if (event._immediatePropagationStopped) return;
			// 	let l = list[i];
			// 	if (
			// 		(phase === Event.CAPTURING_PHASE && !l.capture) ||
			// 		(phase === Event.BUBBLING_PHASE && l.capture)
			// 	)
			// 		continue;
			// 	if (l.f) {
			// 		l.f.call(event.currentTarget, event);
			// 	} else {
			// 		let fn = l.listener.handleEvent;
			// 		if (typeof fn !== "function")
			// 			throw new TypeError(
			// 				"handleEvent property of event listener object is not a function."
			// 			);
			// 		fn.call(l.listener, event);
			// 	}
			// }
			if (_listeners) {
				const { [type]: stack } = _listeners;
				if (stack) {
					for (const { listener, capture } of stack) {
						if (event._immediatePropagationStopped) return;
						switch (phase) {
							case Event.CAPTURING_PHASE:
								if (!capture) continue;
								break;
							case Event.BUBBLING_PHASE:
								if (capture) continue;
								break;
						}
						if (typeof listener === "function") {
							listener.call(target, event);
						} else if (listener) {
							listener.handleEvent(event);
						}
					}
					return !event.defaultPrevented;
				}
			}
		}

		if (!event._initialized || event._dispatching)
			throw new Error("InvalidStateError");
		event.isTrusted = trusted;

		// Begin dispatching the event now
		event._dispatching = true;
		event.target = this;

		// Build the list of targets for the capturing and bubbling phases
		// XXX: we'll eventually have to add Window to this list.
		let ancestors = Array.from(this._enumAncestorTargets());

		// Capturing phase
		event.eventPhase = Event.CAPTURING_PHASE;
		for (let i = ancestors.length; i-- > 0 && !event._propagationStopped; )
			invoke(ancestors[i], event);

		// At target phase
		if (!event._propagationStopped) {
			event.eventPhase = Event.AT_TARGET;
			invoke(this, event);
		}

		// Bubbling phase
		if (event.bubbles && !event._propagationStopped) {
			event.eventPhase = Event.BUBBLING_PHASE;
			for (const et of ancestors) {
				invoke(et, event);
				if (event._propagationStopped) break;
			}
		}

		event._dispatching = false;
		event.eventPhase = Event.AT_TARGET;
		event.currentTarget = null;
		event._propagationStopped = false;
		event._immediatePropagationStopped = false;

		// Deal with mouse events and figure out when
		// a click has happened
		// if (trusted && !event.defaultPrevented && event instanceof MouseEvent) {
		// 	switch (event.type) {
		// 		case "mousedown":
		// 			this._armed = {
		// 				x: event.clientX,
		// 				y: event.clientY,
		// 				t: event.timeStamp,
		// 			};
		// 			break;
		// 		case "mouseout":
		// 		case "mouseover":
		// 			this._armed = null;
		// 			break;
		// 		case "mouseup":
		// 			if (this._isClick(event)) this._doClick(event);
		// 			this._armed = null;
		// 			break;
		// 	}
		// }

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
	type: string;
	target: EventTarget | null;
	currentTarget: EventTarget | null;
	eventPhase: number;
	bubbles: boolean;
	cancelable: boolean;
	composed: boolean;
	isTrusted: boolean;
	defaultPrevented: boolean;
	timeStamp: number;
	_propagationStopped?: boolean;
	_immediatePropagationStopped?: boolean;
	_dispatching?: boolean;
	_initialized: boolean;
	constructor(type?: string, dictionary?: EventInit) {
		// Initialize basic event properties
		this.type = type || "";
		this.target = null;
		this.currentTarget = null;
		this.eventPhase = 2; // AT_TARGET
		this.bubbles = dictionary?.bubbles || false;
		this.cancelable = dictionary?.cancelable || false;
		this.composed = dictionary?.composed || false;
		this.isTrusted = false;
		this.defaultPrevented = false;
		this.timeStamp = Date.now();

		// Initialize internal flags
		// XXX: Would it be better to inherit these defaults from the prototype?
		// this._propagationStopped = false;
		// this._immediatePropagationStopped = false;
		this._initialized = true;
		this._dispatching = false;
	}
	initEvent(
		type: string,
		bubbles: boolean = false,
		cancelable: boolean = false
	) {
		this._initialized = true;
		if (this._dispatching) return;

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
			// this._retval = b;
		}
	}
	get cancelBubble() {
		return this._propagationStopped || false;
	}
	set cancelBubble(cancel: boolean) {
		this._propagationStopped = cancel;
	}
	get srcElement() {
		return this.target || null;
	}
	get returnValue() {
		return this.cancelable ? !this.defaultPrevented : true;
	}
	set returnValue(b: boolean) {
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
	readonly data?: any;
	readonly origin?: string;
	readonly lastEventId?: string;
	readonly source?: EventTarget;
	readonly ports?: EventTarget[];
	constructor(type?: string, init?: MessageEventInit) {
		super(type, init);
		if (init) {
			const { data, origin, lastEventId, source, ports } = init;
			if (data) this.data = data;
			if (origin) this.origin = origin;
			if (lastEventId) this.lastEventId = lastEventId;
			if (source) this.source = source;
			if (ports) this.ports = ports;
		}
	}
}
