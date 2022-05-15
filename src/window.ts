/*
s = """*/
import { Document, HTMLDocument } from './document.js';
import { EventTarget, MessageEvent } from './event-target.js';
import * as html_elements from './html/element.js';
import * as all from './all.js';

// """

/*
import re
def ls():
	for m in re.finditer(r"{([^\}]+)}", s):
		for x in m.group(1).strip().split(','):
			yield (f"""
	get {x}() {{
		return {x};
	}}""")
for x in ls():
	print(x)

Object.getOwnPropertyNames(window).filter(s=>/^[A-Z]\w+$/.test(s))
*/

export class Window extends EventTarget {
	_document?: Document;
	_frames?: any;
	_performance?: any;
	_parent?: Window;
	_first?: Window;
	_next?: Window;
	_name?: string;
	static _top?: Window;

	constructor(doc?: Document) {
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
	setDocument(doc?: Document) {
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
	get parent(): Window {
		return this._parent ?? this;
	}
	get name() {
		return this._name ?? '';
	}

	get top() {
		let _parent: Window = this;
		let p: Window | null | undefined;
		while ((p = _parent._parent)) {
			_parent = p;
		}
		return _parent;
	}

	get frames() {
		let { _frames } = this;
		if (!_frames) {
			this._frames = _frames = new Proxy<Window>(this, {
				get(window: Window, key: string) {
					if (typeof key === 'symbol') {
						//pass
					} else if (/^-?\d+$/.test(key)) {
						let i = parseInt(key);
						let { document } = window;
						for (const frame of document.getElementsByTagName('iframe')) {
							if (0 === i--) {
								let win = frmwm.get(frame);
								win || frmwm.set(frame, (win = new Window()));
								return win;
							} else if (i < 0) {
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

	set location(url: URL | string | null) {
		let { document } = this;
		if (document) {
			document.location = url;
		}
	}

	get location(): URL | string | null {
		let { document } = this;
		if (document) {
			return document.location;
		}
		return null;
	}

	requestAnimationFrame(callback: any) {
		const { Date, setTimeout } = globalThis;
		const now = new Date().getTime();
		const timeToCall = Math.max(0, 16 - (now - lastTime));
		return setTimeout(() => {
			lastTime = now + timeToCall;
			callback(lastTime);
		}, timeToCall);
	}

	cancelAnimationFrame(id: number) {
		globalThis.clearTimeout(id);
	}

	postMessage(message: any, targetOrigin: string) {
		// console.log("[postMessage]", arguments);
		if (arguments.length < 2) {
			// "'postMessage' requires 2 arguments: 'message' and 'targetOrigin'"
			throw new TypeError();
		}

		// targetOrigin = String(targetOrigin);

		// if (!isValidTargetOrigin(targetOrigin)) {
		// 	// TODO: Fix me
		// 	throw DOMException.create(globalObject, [
		// 		"Failed to execute 'postMessage' on 'Window': " +
		// 			"Invalid target origin '" +
		// 			targetOrigin +
		// 			"' in a call to 'postMessage'.",
		// 		"SyntaxError",
		// 	]);
		// }

		// // TODO: targetOrigin === '/' - requires reference to source window
		// // See https://github.com/jsdom/jsdom/pull/1140#issuecomment-111587499
		// if (
		// 	targetOrigin !== "*" &&
		// 	targetOrigin !==
		// 		idlUtils.implForWrapper(globalObject._document)._origin
		// ) {
		// 	return;
		// }

		// TODO: event.source - requires reference to source window
		// TODO: event.origin - requires reference to source window
		// TODO: event.ports
		// TODO: event.data - structured clone message - requires cloning DOM nodes
		const { window: source } = globalThis;
		setTimeout(() => {
			const event = new MessageEvent('message', {
				data: message,
				source: source as any as EventTarget,
			});

			this.dispatchEvent(event);
		}, 0);
	}

	async loadURL1(url: string, params?: any) {
		let doc;
		// console.log("loadURL: ", params);
		function mimeTypeFor(s: string) {
			if (/\.svg$/.test(s)) {
				return 'image/svg+xml';
			} else if (/\.xhtml?$/.test(s)) {
				return 'application/xhtml+xml';
			} else if (/\.html?$/.test(s)) {
				return 'application/xhtml+xml';
			} else if (/\.xml$/.test(s)) {
				return 'application/xml';
			}
		}
		const rl = (params.resourceLoader as ResourceLoader) || Document.resourceLoader;
		if (url.indexOf('file:') === 0) {
			// const file = fileURLToPath(url);
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
		} else {
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
				} else {
					throw new Error(`No response body ${url}`);
				}
			} else {
				throw new Error(`Failed to fetch ${url}`);
			}
		}
		return doc;
	}
	async loadURL(url: string, params?: any) {
		function mimeTypeFor(s: string) {
			if (/\.svg$/.test(s)) {
				return 'image/svg+xml';
			} else if (/\.xhtml?$/.test(s)) {
				return 'application/xhtml+xml';
			} else if (/\.html?$/.test(s)) {
				return 'text/html';
			} else if (/\.xml$/.test(s)) {
				return 'application/xml';
			}
		}
		const rl = (params.resourceLoader as ResourceLoader) || Document.resourceLoader;
		// let p: Promise<[string, AsyncIterableIterator<string | Buffer>]>;
		let mt: string;
		let it: AsyncIterableIterator<string | Buffer>;

		[mt, it] = await (url.indexOf('file:') === 0
			? rl.readStream(url).then((strm) => {
					if (strm) {
						return ['', strm[Symbol.asyncIterator]()];
					} else {
						throw new Error();
					}
			  })
			: rl.fetch(url).then((response) => {
					const { body } = response;
					if (body) {
						return [response.headers.get('content-type') || '', body[Symbol.asyncIterator]()];
					} else {
						throw new Error(`No response body ${url}`);
					}
			  }));
		// return p.then(function ([mt, it]) {
		const doc = this.setDocument(Document.new(mt || mimeTypeFor(url)));
		doc._location = url;
		// console.log("loadURL", doc.isHTML, url);
		// const sax = pushDOMParser(doc, params);
		// for await (const chunk of it) {
		// 	sax.write(chunk.toString());
		// }
		// sax.close();
		const parser = await htmlParser2(doc, doc, params);
		for await (const chunk of it) {
			parser.write(chunk.toString());
		}
		// const { _promises } = parser as any;
		// if (_promises) {
		// 	console.log("await", "_promises", _promises.length);

		// 	await Promise.all(_promises);
		// }
		parser.end();
		return doc;
		// });
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

import { ResourceLoader } from './resource.js';
import { DOMImplementation } from './dom-implementation.js';
import { pushDOMParser, htmlParser2 } from './dom-parse.js';
// import { fileURLToPath, pathToFileURL } from "url";
// import fs from "fs";

/*
interface Window : EventTarget {
  // the current browsing context
  //+/ [LegacyUnforgeable] readonly attribute WindowProxy window;
  //+/ [Replaceable] readonly attribute WindowProxy self;
  //+/ [LegacyUnforgeable] readonly attribute Document document;
  //+/ attribute DOMString name;
  //+/ [PutForwards=href, LegacyUnforgeable] readonly attribute Location location;
  readonly attribute History history;
  readonly attribute CustomElementRegistry customElements;
  [Replaceable] readonly attribute BarProp locationbar;
  [Replaceable] readonly attribute BarProp menubar;
  [Replaceable] readonly attribute BarProp personalbar;
  [Replaceable] readonly attribute BarProp scrollbars;
  [Replaceable] readonly attribute BarProp statusbar;
  [Replaceable] readonly attribute BarProp toolbar;
  attribute DOMString status;
  undefined close();
  readonly attribute boolean closed;
  undefined stop();
  undefined focus();
  undefined blur();

  // other browsing contexts
  [Replaceable] readonly attribute WindowProxy frames;
  [Replaceable] readonly attribute unsigned long length;
  //+/ [LegacyUnforgeable] readonly attribute WindowProxy? top;
  attribute any opener;
  [Replaceable] readonly attribute WindowProxy? parent;
  readonly attribute Element? frameElement;
  WindowProxy? open(optional USVString url = "", optional DOMString target = "_blank", optional [LegacyNullToEmptyString] DOMString features = "");
  getter object (DOMString name);
  // Since this is the global object, the IDL named getter adds a NamedPropertiesObject exotic
  // object on the prototype chain. Indeed, this does not make the global object an exotic object.
  // Indexed access is taken care of by the WindowProxy exotic object.

  // the user agent
  readonly attribute Navigator navigator;
  readonly attribute Navigator clientInformation; // legacy alias of .navigator
  readonly attribute boolean originAgentCluster;

  // user prompts
  undefined alert();
  undefined alert(DOMString message);
  boolean confirm(optional DOMString message = "");
  DOMString? prompt(optional DOMString message = "", optional DOMString default = "");
  undefined print();

  undefined postMessage(any message, USVString targetOrigin, optional sequence<object> transfer = []);
  undefined postMessage(any message, optional WindowPostMessageOptions options = {});

  // also has obsolete members
};
*/
