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

	constructor(doc?: Document) {
		super();
		// const doc = new Document();
		if (doc) {
			doc.defaultView = this;
			this._document = doc;
		}
		// const doc = this.document;
		// this.Image = class {
		// 	constructor(width, height) {
		// 		const img = doc.createElement("img");
		// 		if (width != null) img.setAttribute("width", width);
		// 		if (height != null) img.setAttribute("height", height);
		// 		return img;
		// 	}
		// };
		if (!("HTMLDocument" in Window)) {
			for (const k of Object.getOwnPropertyNames(html_elements)) {
				Reflect.set(this, k, Reflect.get(html_elements, k));
			}
			for (const k of Object.getOwnPropertyNames(all)) {
				Reflect.set(this, k, Reflect.get(all, k));
			}
		}
	}

	get self() {
		return this;
	}

	setDocument(doc?: Document) {
		if (doc) {
			// pass
		} else {
			doc = HTMLDocument.setup();
		}
		doc.defaultView = this;
		this._document = doc;
		return doc;
	}

	get document() {
		let { _document } = this;
		return _document || this.setDocument();
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

	requestAnimationFrame(callback: any) {
		const now = new globalThis.Date().getTime();
		const timeToCall = Math.max(0, 16 - (now - lastTime));
		return globalThis.setTimeout(() => {
			lastTime = now + timeToCall;
			callback(lastTime);
		}, timeToCall);
	}

	cancelAnimationFrame(id: number) {
		globalThis.clearTimeout(id);
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
}

let lastTime = 0;

const frmwm = new WeakMap();
