import { Document } from './document.js';
import { EventTarget, MessageEvent } from './event-target.js';
import * as html_elements from './html/element.js';
import * as all from './all.js';
export class Window extends EventTarget {
    _document;
    _frames;
    _performance;
    _parent;
    _first;
    _next;
    _name;
    static _top;
    constructor(doc) {
        super();
        doc && this.setDocument(doc);
        if (!('HTMLDocument' in Window)) {
            for (const k of Object.getOwnPropertyNames(html_elements)) {
                Reflect.set(this, k, Reflect.get(html_elements, k));
            }
            for (const k of Object.getOwnPropertyNames(all)) {
                Reflect.set(this, k, Reflect.get(all, k));
            }
        }
    }
    setDocument(doc) {
        if (!doc) {
            doc = DOMImplementation.createHTMLDocument();
        }
        doc.defaultView = this;
        return (this._document = doc);
    }
    get document() {
        let { _document } = this;
        return _document || this.setDocument();
    }
    get self() {
        return this;
    }
    get window() {
        return this;
    }
    get parent() {
        return this._parent ?? this;
    }
    get name() {
        return this._name ?? '';
    }
    get top() {
        let _parent = this;
        let p;
        while ((p = _parent._parent)) {
            _parent = p;
        }
        return _parent;
    }
    get frames() {
        let { _frames } = this;
        if (!_frames) {
            this._frames = _frames = new Proxy(this, {
                get(window, key) {
                    if (typeof key === 'symbol') {
                    }
                    else if (/^-?\d+$/.test(key)) {
                        let i = parseInt(key);
                        let { document } = window;
                        for (const frame of document.getElementsByTagName('iframe')) {
                            if (0 === i--) {
                                let win = frmwm.get(frame);
                                win || frmwm.set(frame, (win = new Window()));
                                return win;
                            }
                            else if (i < 0) {
                                break;
                            }
                        }
                    }
                    return Reflect.get(window, key);
                },
            });
        }
        return _frames;
    }
    get performance() {
        let { _performance } = this;
        if (!_performance) {
            const nowOffset = globalThis.Date.now();
            this._performance = _performance = {
                now: () => Date.now() - nowOffset,
            };
        }
        return _performance;
    }
    set location(url) {
        let { document } = this;
        if (document) {
            document.location = url;
        }
    }
    get location() {
        let { document } = this;
        if (document) {
            return document.location;
        }
        return null;
    }
    requestAnimationFrame(callback) {
        const { Date, setTimeout } = globalThis;
        const now = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (now - lastTime));
        return setTimeout(() => {
            lastTime = now + timeToCall;
            callback(lastTime);
        }, timeToCall);
    }
    cancelAnimationFrame(id) {
        globalThis.clearTimeout(id);
    }
    getComputedStyle(node) {
        return this.document.styleSheets.getComputedStyle(node);
    }
    postMessage(message, targetOrigin) {
        if (arguments.length < 2) {
            throw new TypeError();
        }
        const { window: source } = globalThis;
        setTimeout(() => {
            const event = new MessageEvent('message', {
                data: message,
                source: source,
            });
            this.dispatchEvent(event);
        }, 0);
    }
    async loadURL1(url, params) {
        let doc;
        function mimeTypeFor(s) {
            if (/\.svg$/.test(s)) {
                return 'image/svg+xml';
            }
            else if (/\.xhtml?$/.test(s)) {
                return 'application/xhtml+xml';
            }
            else if (/\.html?$/.test(s)) {
                return 'application/xhtml+xml';
            }
            else if (/\.xml$/.test(s)) {
                return 'application/xml';
            }
        }
        const rl = params.resourceLoader || Document.resourceLoader;
        if (url.indexOf('file:') === 0) {
            const strm = await rl.readStream(url);
            if (strm) {
                doc = Document.new(mimeTypeFor(url));
                doc._location = url;
                const sax = pushDOMParser(this.setDocument(doc), params);
                for await (const chunk of strm) {
                    sax.write(chunk);
                }
                sax.close();
            }
        }
        else {
            const response = await rl.fetch(url);
            if (response) {
                const { body } = response;
                if (body) {
                    doc = Document.new(response.headers.get('content-type') || mimeTypeFor(url));
                    doc._location = url;
                    const sax = pushDOMParser(this.setDocument(doc), params);
                    for await (const chunk of body) {
                        sax.write(chunk.toString());
                    }
                    sax.close();
                }
                else {
                    throw new Error(`No response body ${url}`);
                }
            }
            else {
                throw new Error(`Failed to fetch ${url}`);
            }
        }
        return doc;
    }
    async loadURL(url, params) {
        function mimeTypeFor(s) {
            if (/\.svg$/.test(s)) {
                return 'image/svg+xml';
            }
            else if (/\.xhtml?$/.test(s)) {
                return 'application/xhtml+xml';
            }
            else if (/\.html?$/.test(s)) {
                return 'text/html';
            }
            else if (/\.xml$/.test(s)) {
                return 'application/xml';
            }
        }
        const rl = params.resourceLoader || Document.resourceLoader;
        let mt;
        let it;
        [mt, it] = await (url.indexOf('file:') === 0
            ? rl.readStream(url).then((strm) => {
                if (strm) {
                    return ['', strm[Symbol.asyncIterator]()];
                }
                else {
                    throw new Error();
                }
            })
            : rl.fetch(url).then((response) => {
                const { body } = response;
                if (body) {
                    return [response.headers.get('content-type') || '', body[Symbol.asyncIterator]()];
                }
                else {
                    throw new Error(`No response body ${url}`);
                }
            }));
        const doc = this.setDocument(Document.new(mt || mimeTypeFor(url)));
        doc._location = url;
        const parser = await htmlParser2(doc, doc, params);
        for await (const chunk of it) {
            parser.write(chunk.toString());
        }
        parser.end();
        return doc;
    }
}
let lastTime = 0;
const frmwm = new WeakMap();
export class Location extends URL {
    set href(url) {
        super.href = url;
    }
    get href() {
        return super.href;
    }
}
Object.defineProperties(Window.prototype, {
    console: {
        value: console,
    },
    clearTimeout: {
        value: clearTimeout,
    },
    clearInterval: {
        value: clearInterval,
    },
    setTimeout: {
        value: setTimeout,
    },
    setInterval: {
        value: setInterval,
    },
});
import { DOMImplementation } from './dom-implementation.js';
import { pushDOMParser, htmlParser2 } from './dom-parse.js';
//# sourceMappingURL=window.js.map