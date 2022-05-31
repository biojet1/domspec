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
declare type CallBack = (event: Event) => undefined;
interface EventEntry {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
    listener?: EventListener | CallBack;
}
interface EventStack {
    [key: string]: Array<EventEntry>;
}
export declare class EventTarget {
    _listeners?: EventStack;
    addEventListener(type: string, callback: EventListener | CallBack, options: EventEntry | boolean): void;
    removeEventListener(type: string, callback: EventListener | CallBack): void;
    _enumAncestorTargets(): Generator<EventTarget, void, unknown>;
    dispatchEvent(event: Event, trusted?: boolean): boolean;
    static get DOCUMENT_POSITION_DISCONNECTED(): number;
    get DOCUMENT_POSITION_DISCONNECTED(): number;
    static get DOCUMENT_POSITION_PRECEDING(): number;
    get DOCUMENT_POSITION_PRECEDING(): number;
    static get DOCUMENT_POSITION_FOLLOWING(): number;
    get DOCUMENT_POSITION_FOLLOWING(): number;
    static get DOCUMENT_POSITION_CONTAINS(): number;
    get DOCUMENT_POSITION_CONTAINS(): number;
    static get DOCUMENT_POSITION_CONTAINED_BY(): number;
    get DOCUMENT_POSITION_CONTAINED_BY(): number;
    static get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): number;
    get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): number;
}
export declare class Event {
    static NONE: number;
    static CAPTURING_PHASE: number;
    static AT_TARGET: number;
    static BUBBLING_PHASE: number;
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
    constructor(type?: string, dictionary?: EventInit);
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
    preventDefault(): void;
    get cancelBubble(): boolean;
    set cancelBubble(cancel: boolean);
    get srcElement(): EventTarget | null;
    get returnValue(): boolean;
    set returnValue(b: boolean);
    get CAPTURING_PHASE(): number;
    get AT_TARGET(): number;
    get BUBBLING_PHASE(): number;
    get NONE(): number;
}
export declare class MessageEvent extends Event {
    readonly data?: any;
    readonly origin?: string;
    readonly lastEventId?: string;
    readonly source?: EventTarget;
    readonly ports?: EventTarget[];
    constructor(type?: string, init?: MessageEventInit);
}
export declare class DOMException {
    readonly name?: any;
    readonly message?: string;
    constructor(message: string, name?: string);
    toString(): string;
    get code(): 0 | 1 | 3 | 4 | 8 | 5 | 7 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;
    static new(name: string, message?: string): DOMException;
}
export {};
