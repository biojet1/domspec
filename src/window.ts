/*
s = """*/
import { Document, HTMLDocument } from "./document.js";
import { EventTarget } from "./event-target.js";
import * as html_elements from "./html/element.js";
import * as all from "./all.js";

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
	static _top?: Window;

	constructor(doc?: Document) {
		super();
		doc && this.setDocument(doc);
		if (!("HTMLDocument" in Window)) {
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
			doc = HTMLDocument.setup();
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

	get parent(): Window {
		return this._parent || this;
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
					if (typeof key === "symbol") {
						//pass
					} else if (/^-?\d+$/.test(key)) {
						let i = parseInt(key);
						let { document } = window;
						for (const frame of document.getElementsByTagName(
							"iframe"
						)) {
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

		// return (
		// 	this._location ||
		// 	(this._location = new (class extends Location {})(
		// 		this.document.URL || "about:blank"
		// 	))
		// );
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
