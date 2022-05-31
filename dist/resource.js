export class ResourceLoader {
    resolveURL(href, baseURI) {
        return new URL(href, baseURI).href;
    }
    async readURL(url) {
        if (url.indexOf("file:") === 0) {
            const file = fileURLToPath(url);
            return fs.readFile(file, "utf8");
        }
        else {
            const response = await Document.fetch(url);
            if (response) {
                return response.text();
            }
            else {
                throw new Error(`Failed to fetch ${url}`);
            }
        }
    }
    async readStream(url) {
        if (url.indexOf("file:") === 0) {
            const file = fileURLToPath(url);
            return createReadStream(file, {
                encoding: "utf8",
                highWaterMark: 16 * 1024,
            });
        }
        else {
            const response = await Document.fetch(url);
            if (response) {
                return response.body;
            }
            else {
                throw new Error(`Failed to fetch ${url}`);
            }
        }
    }
    async fetch(url, init) {
        return ResourceLoader.fetch(url, init);
    }
    static async fetch(url, init) {
        console.info("Document.fetch");
        return import("node-fetch").then((mod) => {
            console.info("node-fetch imported");
            ResourceLoader.fetch = mod.default;
            return mod.default(url, init);
        });
    }
}
async function _eval(script, res) {
    if (script._alreadyStarted) {
        return script;
    }
    const src = script.getAttributeNS(null, "src");
    let text = !src && script.textContent;
    if (!(text || src)) {
        return script;
    }
    script._alreadyStarted = true;
    const { ownerDocument: document } = script;
    if (document) {
        const { defaultView: window } = document;
        if (window) {
            vm.createContext(window);
            if (src) {
                const { documentURI } = document;
                const url = res.resolveURL(src, documentURI);
                return res.readURL(url).then((code) => {
                    try {
                        document.currentScript = script;
                        vm.runInContext(code, window, src);
                    }
                    finally {
                        delete document.currentScript;
                    }
                    return script;
                });
            }
            else if (text) {
                try {
                    document.currentScript = script;
                    vm.runInContext(text, window, "script");
                }
                finally {
                    delete document.currentScript;
                }
                return script;
            }
        }
    }
    return script;
}
export async function runScripts(scripts, res) {
    const script = scripts && scripts.shift();
    const rl = res || new ResourceLoader();
    return (script &&
        _eval(script, rl).then((script) => scripts.length > 0 ? runScripts(scripts, rl) : script));
}
export async function runScript(script, res) {
    const rl = res || new ResourceLoader();
    return _eval(script, rl);
}
import { createReadStream } from "fs";
import fs from "fs/promises";
import vm from "vm";
import { fileURLToPath } from "url";
import { Document } from "./document.js";
//# sourceMappingURL=resource.js.map