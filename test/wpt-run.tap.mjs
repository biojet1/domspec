// import fs from "fs";
// import vm from "vm";
import tap from "tap";
// import fetch from "node-fetch";

import { fileURLToPath, pathToFileURL, URL } from "url";
// import * as all from "../dist/all.js";

const ct = globalThis.clearTimeout;

globalThis.clearTimeout = function () {
    // console.log("::clearTimeout", arguments);
    ct(arguments);
};
import { Window, EventTarget, ResourceLoader } from "../dist/all.js";

let _FILE = process.env._FILE;

const WPT_ROOT_URL = pathToFileURL(process.env.WPT_ROOT + "/");
if (_FILE) {
    const test_name = _FILE;

    _FILE = new URL(_FILE, WPT_ROOT_URL).href;

    console.info("_FILE", _FILE);

    const REPORT_URL = pathToFileURL("./test/testharnessreport.js").href;

    // svg/types/scripted/SVGGraphicsElement.getBBox-01.html
    if (1) {
        const postMessage = Window.prototype.postMessage;
        Window.prototype.postMessage = function () {
            console.log("::postMessage", arguments);
            postMessage.apply(this, arguments);
        };
        const addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function () {
            // console.log("::addEventListener", arguments[0]);
            addEventListener.apply(this, arguments);
        };
        const dispatchEvent = EventTarget.prototype.dispatchEvent;
        EventTarget.prototype.dispatchEvent = function () {
            // console.log("::dispatchEvent", arguments[0].type);
            dispatchEvent.apply(this, arguments);
        };
    }

    class TestResourceLoader extends ResourceLoader {
        resolveURL(href, baseURI) {
            if (href == "/resources/testharnessreport.js") {
                href = REPORT_URL;
            } else if (href.startsWith("/")) {
                baseURI = WPT_ROOT_URL;
                href = href.substring(1);
            }
            const url = super.resolveURL(href, baseURI);
            // console.log("resolveURL: ", href, baseURI, url);
            return url;
        }
    }
    // console.log(process.argv)
    const window = new Window();

    window.test_name = test_name;

    // const url =
    //     "file://svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
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
        .loadURL(_FILE, { resourceLoader: new TestResourceLoader() })
        .then(function (document) {
            // console.log("path", document.innerHTML);
            console.log("baseURI", document.baseURI);
            // console.log("win", document.location);
        })
        .catch(function (err) {
            tap.fail(`Load failed ${test_name}`, err);
            tap.threw(err);
            // console.log("err", err);
            // throw err;
        });
} else {
    // const test_file = "svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
    process.env._FILE = "AUX";
    const PKG_DIR_URL = pathToFileURL(".");
    let tests = `
svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg
// svg/types/scripted/SVGGraphicsElement.getBBox-01.html
svg/types/scripted/SVGGeometryElement.getPointAtLength-01.svg
svg/types/scripted/SVGGeometryElement.getPointAtLength-02.svg
// svg/types/scripted/SVGGeometryElement.getPointAtLength-03.svg
// svg/types/scripted/SVGGeometryElement.getPointAtLength-04.svg
// svg/types/scripted/SVGGeometryElement.getPointAtLength-05.svg

dom/nodes/Document-createCDATASection-xhtml.xhtml
dom/nodes/Document-createProcessingInstruction-xhtml.xhtml
// dom/nodes/Document-getElementsByTagName-xhtml.xhtml
// dom/nodes/DocumentType-literal-xhtml.xhtml
dom/nodes/Element-childElementCount-dynamic-add-xhtml.xhtml
dom/nodes/Element-childElementCount-dynamic-remove-xhtml.xhtml
dom/nodes/Element-childElementCount-nochild-xhtml.xhtml
dom/nodes/Element-childElementCount-xhtml.xhtml
dom/nodes/Element-childElement-null-xhtml.xhtml
// dom/nodes/Element-firstElementChild-entity-xhtml.xhtml
dom/nodes/Element-firstElementChild-namespace-xhtml.xhtml
dom/nodes/Element-firstElementChild-xhtml.xhtml
dom/nodes/Element-lastElementChild-xhtml.xhtml
dom/nodes/Element-nextElementSibling-xhtml.xhtml
dom/nodes/Element-previousElementSibling-xhtml.xhtml
dom/nodes/Element-siblingElement-null-xhtml.xhtml
dom/nodes/Node-isEqualNode-xhtml.xhtml
dom/nodes/Node-lookupPrefix.xhtml
// dom/nodes/Node-nodeName-xhtml.xhtml
// dom/nodes/ProcessingInstruction-escapes-1.xhtml
// dom/nodes/ProcessingInstruction-literal-1.xhtml
// dom/nodes/ProcessingInstruction-literal-2.xhtml



dom/nodes/Document-constructor-svg.svg
dom/nodes/Element-childElementCount-dynamic-add-svg.svg
dom/nodes/Element-childElementCount-dynamic-remove-svg.svg
dom/nodes/Element-childElementCount-nochild-svg.svg
dom/nodes/Element-childElementCount-svg.svg
dom/nodes/Element-childElement-null-svg.svg
// dom/nodes/Element-firstElementChild-entity.svg
dom/nodes/Element-firstElementChild-namespace-svg.svg
dom/nodes/Element-firstElementChild-svg.svg
dom/nodes/Element-lastElementChild-svg.svg
dom/nodes/Element-nextElementSibling-svg.svg
dom/nodes/Element-previousElementSibling-svg.svg
dom/nodes/Element-siblingElement-null-svg.svg
    `;
    // tests = `
    // dom/nodes/Document-getElementsByTagName-xhtml.xhtml
    // `;

    tests = tests
        .split(/[\r\n]+/)
        .map((v) => v.trim())
        .filter((v) => v && !v.startsWith("#") && !v.startsWith("//"));
    // tests=['dom/nodes/Document-createCDATASection-xhtml.xhtml']

    //

    console.info(tests);
    tap.jobs = 5;
    console.info(`test: ${tests.length}`);
    for (const sub of tests) {
        // const href = new URL(sub, WPT_ROOT_URL).href;
        process.env._FILE = sub;
        tap.spawn(
            // "tap",
            "node",
            ["test/wpt-run.tap.mjs"],
            // {buffered:true},
            sub
        );
    }
}
