// import fs from "fs";
// import vm from "vm";
import tap from "tap";
// import fetch from "node-fetch";

import { fileURLToPath, pathToFileURL, URL } from "url";
// import * as all from "../dist/all.js";
import { Window, EventTarget, ResourceLoader } from "../dist/all.js";

// for (const [k, v] of Object.entries(all)) {
//     global[k] = v;
// }
const WPT_ROOT_URL = pathToFileURL(process.env.WPT_ROOT + "/");

// /media/biojet1/OS/pub/004/wpt/svg/types/scripted/SVGGraphicsElement.getBBox-01.html
if (1) {
    const postMessage = Window.prototype.postMessage;
    Window.prototype.postMessage = function () {
        console.log("::postMessage", arguments);
        postMessage.apply(this, arguments);
    };
    const addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function () {
        console.log("::addEventListener", arguments[0]);
        addEventListener.apply(this, arguments);
    };
    const dispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function () {
        console.log("::dispatchEvent", arguments[0]);
        dispatchEvent.apply(this, arguments);
    };
}

class TestResourceLoader extends ResourceLoader {
    resolveURL(href, baseURI) {
        if (href == "/resources/testharnessreport.js") {
            href =
                "file:///mnt/META/wrx/ts/svgdom-ts/test/testharnessreport.js";
        } else if (href.startsWith("/")) {
            baseURI = WPT_ROOT_URL;
            href = href.substring(1);
        }
        const url = super.resolveURL(href, baseURI);
        console.log("resolveURL: ", href, baseURI, url);
        return url;
    }
}
// console.log(process.argv)
const window = new Window();

const url =
    "file:///media/biojet1/OS/pub/004/wpt/svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
// "http://0.0.0.0:8048/mod/vfskit.web/local/OS/pub/004/wpt/svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg"
const rl = new TestResourceLoader();

// for await (const chunk of await rl.readStream(url)) {
//     console.log("chunk", chunk.toString());
// }

const self = new Proxy(window, {
    get: function (target, key, receiver) {
        const v = Reflect.get(target, key, receiver);
        // console.log(`GET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`);
        return v;
    },

    set: function (target, key, value, receiver) {
        const v = Reflect.get(target, key, receiver);
        // console.log(`SET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`);
        global[key] = value;
        return Reflect.set(target, key, value, receiver);
    },
});

Object.defineProperty(Window.prototype, "addEventListener", {
    value: function () {
        EventTarget.prototype.addEventListener.apply(window, arguments);
    },
});
Object.defineProperty(Window.prototype, "self", {
    value: self,
});
window.tap = tap;
window
    .loadURL(url, { resourceLoader: new TestResourceLoader() })
    .catch(function (err) {
        console.log("err", err);
        throw err;
    })
    .then(function (document) {
        // console.log("path", document.innerHTML);
        console.log("baseURI", document.baseURI);
        // console.log("win", document.location);
    });
