import fs from "fs";
import vm from "vm";
import tap from "tap";
import fetch from "node-fetch";

import { fileURLToPath, pathToFileURL, URL } from "url";
import * as all from "../dist/all.js";
import {
    pushDOMParser,
    SVGDocument,
    HTMLDocument,
    XMLDocument,
    Window,
} from "../dist/all.js";

for (const [k, v] of Object.entries(all)) {
    global[k] = v;
}
const WPT_ROOT_URL = pathToFileURL(process.env.WPT_ROOT + "/");

// const parser = new DOMParser();

// class TestWindow extends Window {
//     static async loadURL(url) {
//         const window = new Window();
//         let doc;
//         function mimeTypeFor(s) {
//             if (/\.svg$/.test(s)) {
//                 return "image/svg+xml";
//             } else if (/\.xhtml?$/.test(s)) {
//                 return "application/xhtml+xml";
//             } else if (/\.html?$/.test(s)) {
//                 return "application/xhtml+xml";
//             } else if (/\.xml$/.test(s)) {
//                 return "application/xml";
//             }
//         }
//         if (url.indexOf("file:") === 0) {
//             const file = fileURLToPath(url);
//             doc = Document.new(mimeTypeFor(url));
//             doc._location = url;
//             const sax = pushDOMParser(window.setDocument(doc));

//             sax.write(fs.readFileSync(file, "utf8"));
//             sax.close();
//         } else {
//             const response = await SVGDocument.fetch(url);
//             doc = Document.new(
//                 response.headers.get("content-type") || mimeTypeFor(url)
//             );
//             const sax = pushDOMParser(window.setDocument(doc));
//             doc._location = url;
//             try {
//                 for await (const chunk of response.body) {
//                     sax.write(chunk.toString());
//                 }
//             } catch (err) {
//                 console.error(err.stack);
//             }
//             sax.close();
//             return window;
//         }
//     }
// }

const window = new Window();
// await SVGDocument.fetch(
//     "http://0.0.0.0:8048/mod/vfskit.web/local/OS/pub/004/wpt/svg/idlharness.window.js"
// );
const url =
    // "file:///media/biojet1/OS/pub/004/wpt/svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
    "http://0.0.0.0:8048/mod/vfskit.web/local/OS/pub/004/wpt/svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";

// TestWindow.loadURL(url)
//     .then(function (win) {
//         console.log("path", win.document.innerHTML);
//         console.log("baseURI", win.document.baseURI);
//         console.log("win", win.location);
//     })
//     .catch(function (err) {
//         console.log("err", err);
//         throw err;
//     });

const self = new Proxy(window, {
    get: function (target, key, receiver) {
        const v = Reflect.get(target, key, receiver);
        console.log(`GET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`);
        return v;
    },

    set: function (target, key, value, receiver) {
        const v = Reflect.get(target, key, receiver);
        console.log(`SET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`);
        global[key] = value;
        return Reflect.set(target, key, value, receiver);
    },
});

Object.defineProperties(Window.prototype, {
    console: {
        value: console,
    },
    clearTimeout: {
        value: clearTimeout,
    },
    setTimeout: {
        value: setTimeout,
    },
    setInterval: {
        value: setTimeout,
    },
    // addEventListener: ,

    //     EventTarget.prototype.addEventListener.apply(window, arguments);
});

Object.defineProperty(Window.prototype, "addEventListener", {
    value: function () {
        EventTarget.prototype.addEventListener.apply(window, arguments);
    },
});

Object.defineProperty(Window.prototype, "self", {
    value: self,
});
// window.setTimeout = setTimeout;
// window.setInterval = setInterval;
// window.clearTimeout = clearTimeout;
// window.clearInterval = clearInterval;
// window.setImmediate = setImmediate;
// window.clearImmediate = clearImmediate;

window
    .loadURL(url)
    .catch(function (err) {
        console.log("err", err);
        throw err;
    })
    .then(function (document) {
        console.log("path", document.innerHTML);
        console.log("baseURI", document.baseURI);
        console.log("win", document.location);
        vm.createContext(window);
        vm.runInContext(
            `
        console.log("top", top.location.toString());
        console.log("self", self.location.toString());
        console.log("window", window.location.toString());
        console.log("parent", parent.location.toString());
        console.log("document", document.location.href);
window.addEventListener("test", (e)=> console.log("test event"));

                    `,
            window,
            `scriptX`
        );
        window.dispatchEvent(new Event("test"));
        // window.setTimeout = setTimeout;
        // window.setInterval = setInterval;
        // // window.clearTimeout = clearTimeout;
        // window.clearInterval = clearInterval;
        // window.setImmediate = setImmediate;
        // window.clearImmediate = clearImmediate;
        // window.addEventListener = function () {
        //     EventTarget.prototype.addEventListener.apply(window, arguments);
        // };
        // const my = { self: self, window: window, document: document };
        // vm.createContext(my);
        let i = 0;
        for (const script of document.getElementsByTagName("script")) {
            const src = script.getAttribute("src");

            if (src) {
                let file = src.substring(1);
                // console.log("file", file.substring(1));
                file = new URL(file, WPT_ROOT_URL);
                // console.log("url", file);
                file = fileURLToPath(file);
                // console.log("path", file);
                vm.runInContext(fs.readFileSync(file, "utf8"), window, file);
            } else {
                // console.log("script", script.textContent);

                vm.runInContext(script.textContent, window, `script${++i}`);
            }
            // if (!test_harness_found) {
            // }

            // console.log(scr.tagName, file);
        }
        console.log("add_completion_callback");
        if (window.add_completion_callback) {
            // test_harness_found = true;
            window.add_completion_callback(function (tests, status) {
                console.log("DONE", status, tests);
                for (const test of tests) {
                    tap.equal(test.status, 0, test.name, {
                        message: test.message,
                    });
                }

                // tap.test(`test`, function (t) {
                //     for (const test of tests) {
                //         t.equal(test.status, 0, test.name, test);
                //     }

                //     t.end();
                // });
            });
        }
        console.log("dispatchEvent", "load");
        window.dispatchEvent(new Event("load"));
    });

// process.exit();
if (0) {
    const loadDOM = function (xml, mime = "text/html") {
        let self;
        const doc = (global.document = parser.parseFromString(xml, mime));
        global.window = new Window(doc);
        global.self = self = global.window;
        global.frames = global.window.frames;
        self.setTimeout = setTimeout;
        self.setInterval = setInterval;
        self.clearTimeout = clearTimeout;
        self.clearInterval = clearInterval;
        self.setImmediate = setImmediate;
        self.clearImmediate = clearImmediate;

        global.self = new Proxy(self, {
            get: function (target, key, receiver) {
                const v = Reflect.get(target, key, receiver);
                console.log(
                    `GET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`
                );
                return v;
            },

            set: function (target, key, value, receiver) {
                const v = Reflect.get(target, key, receiver);
                console.log(
                    `SET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`
                );
                global[key] = value;
                return Reflect.set(target, key, value, receiver);
            },
        });
        return doc;
    };

    global.addEventListener = function () {
        EventTarget.prototype.addEventListener.apply(global.window, arguments);
    };

    const dom1 = "svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
    const document = loadDOM(
        fs.readFileSync(`${process.env.WPT_ROOT}/${dom1}`, "utf8"),
        `application/xml`
    );

    let test_harness_found;
    let i = 0;
    for (const script of document.getElementsByTagName("script")) {
        const src = script.getAttribute("src");

        if (src) {
            let file = src.substring(1);
            // console.log("file", file.substring(1));
            file = new URL(file, WPT_ROOT_URL);
            // console.log("url", file);
            file = fileURLToPath(file);
            // console.log("path", file);
            vm.runInThisContext(fs.readFileSync(file, "utf8"), file);
        } else {
            // console.log("script", script.textContent);

            vm.runInThisContext(script.textContent, `script${i++}`);
        }
        if (!test_harness_found) {
        }

        // console.log(scr.tagName, file);
    }
    if (window.add_completion_callback) {
        test_harness_found = true;
        window.add_completion_callback(function (tests, status) {
            console.log("DONE", status, tests);
            for (const test of tests) {
                tap.equal(test.status, 0, test.name, {
                    message: test.message,
                });
            }

            // tap.test(`test`, function (t) {
            //     for (const test of tests) {
            //         t.equal(test.status, 0, test.name, test);
            //     }

            //     t.end();
            // });
        });
    }
    window.dispatchEvent(new Event("load"));
    // console.log(document.innerHTML);
}
