// export class Eval {
// 	constructor(doc: Document) {
// 		this.document = doc;

// 		return false;
// 	}

// 	resolveURL(href: string, baseURI: string) {
// 		return new URL(href, baseURI);
// 	}

// 	async fetchExternalScript(src: string) {
// 		const { document } = this;
// 		const { defaultView: window, documentURI } = document;
// 		if (window && documentURI) {
// 			const url = this.resolveURL(src, baseURI);
// 			return this.readURL(url).then((code) => {
// 				vm.runInContext(code, window, src);
// 			});
// 		}

// 		// const { ownerDocument: document, defaultView: window } =
// 		// 	this.ownerDocument;
// 		// const resourceLoader = document._fetcher;
// 		// const { URL, defaultView } = document;
// 	}
// }

export class ResourceLoader {
	resolveURL(href: string, baseURI: string) {
		return new URL(href, baseURI).href;
	}
	async readURL(url: string) {
		if (url.indexOf("file:") === 0) {
			const file = fileURLToPath(url);
			return fs.readFile(file, "utf8");
		} else {
			const response = await Document.fetch(url);
			if (response) {
				return response.text();
			} else {
				throw new Error(`Failed to fetch ${url}`);
			}
		}
	}
	async readStream(url: string) {
		if (url.indexOf("file:") === 0) {
			const file = fileURLToPath(url);
			return createReadStream(file, {
				encoding: "utf8",
				highWaterMark: 16 * 1024,
			});
		} else {
			const response = await Document.fetch(url);
			if (response) {
				return response.body;
			} else {
				throw new Error(`Failed to fetch ${url}`);
			}
		}
	}

	async fetch(url: RequestInfo, init?: RequestInit) {
		return ResourceLoader.fetch(url, init);
	}

	static async fetch(url: RequestInfo, init?: RequestInit) {
		console.info("Document.fetch");
		return import("node-fetch").then((mod) => {
			console.info("node-fetch imported");
			ResourceLoader.fetch = mod.default;
			return mod.default(url, init);
		});
	}
	//  const readStream = fs.createReadStream(inputFilePath,
	//   { encoding: 'utf8', highWaterMark: 1024 });

	// for await (const chunk of readStream) {
	//   console.log('>>> '+chunk);
	// }
}

import { RequestInfo, RequestInit } from "node-fetch";

async function _eval(script: Element, res: ResourceLoader): Promise<Element> {
	if ((script as any)._alreadyStarted) {
		return script;
	}

	// TODO: this text check doesn't seem completely the same as the spec, which e.g. will try to execute scripts with
	// child element nodes. Spec bug? https://github.com/whatwg/html/issues/3419
	const src = script.getAttributeNS(null, "src");
	let text = !src && script.textContent;

	if (!(text || src)) {
		return script;
	}

	// if (!this._attached) {
	// 	return;
	// }

	// const scriptBlocksTypeString = this._getTypeString();
	// const type = getType(scriptBlocksTypeString);

	// if (type !== "classic") {
	// 	// TODO: implement modules, and then change the check to `type === null`.
	// 	return;
	// }

	(script as any)._alreadyStarted = true;

	// TODO: implement nomodule here, **but only after we support modules**.

	// At this point we completely depart from the spec.

	const { ownerDocument: document } = script;
	if (document) {
		const { defaultView: window } = document;
		if (window) {
			vm.createContext(window);
			if (src) {
				const { documentURI } = document;
				const url = res.resolveURL(src, documentURI);
				return res.readURL(url).then((code: string) => {
					try {
						document.currentScript = script;
						// console.log(`eval: ${url} [${src}]`);
						vm.runInContext(code, window, src);
					} finally {
						delete document.currentScript;
					}
					return script;
				});
			} else if (text) {
				try {
					document.currentScript = script;
					// console.log(`eval: ${text.trim().substring(0, 32)}`);
					vm.runInContext(text, window, "script");
				} finally {
					delete document.currentScript;
				}
				return script;
			}
		}
	}

	return script;
}

export async function runScripts(
	scripts: Element[],
	res?: ResourceLoader
): Promise<Element | undefined> {
	const script = scripts && scripts.shift();
	const rl = res || new ResourceLoader();
	// console.log("script: ", script && script.getAttributeNS(null, "src"), rl);

	return (
		script &&
		_eval(script, rl).then((script) =>
			scripts.length > 0 ? runScripts(scripts, rl) : script
		)
	);
}

import { createReadStream } from "fs";
import fs from "fs/promises";
import vm from "vm";
import { fileURLToPath, pathToFileURL } from "url";
import { Element } from "./element.js";
import { Document } from "./document.js";
