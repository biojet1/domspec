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

    // console.info("_FILE", _FILE);

    const REPORT_URL = pathToFileURL("./test/testharnessreport.js").href;

    // svg/types/scripted/SVGGraphicsElement.getBBox-01.html
    if (1) {
        const postMessage = Window.prototype.postMessage;
        Window.prototype.postMessage = function () {
            console.error("::postMessage", arguments);
            postMessage.apply(this, arguments);
        };
        const addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function () {
            // console.error("::addEventListener", arguments[0]);
            addEventListener.apply(this, arguments);
        };
        const dispatchEvent = EventTarget.prototype.dispatchEvent;
        EventTarget.prototype.dispatchEvent = function () {
            // console.error("::dispatchEvent", arguments[0].type);
            return dispatchEvent.apply(this, arguments);
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
            // console.error("resolveURL: ", href, baseURI, url);
            return url;
        }
    }
    // console.error(process.argv)
    const window = new Window();

    window.test_name = test_name;

    // const url =
    //     "file://svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
    // "http://0.0.0.0:8048/mod/vfskit.web/local/OS/pub/004/wpt/svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg"
    const rl = new TestResourceLoader();

    // for await (const chunk of await rl.readStream(url)) {
    //     console.error("chunk", chunk.toString());
    // }

    const seen = {};

    const self = new Proxy(window, {
        get: function (target, key, receiver) {
            const v = Reflect.get(target, key, receiver);
            if (!seen[key]) {
                seen[key] = 1;
                // console.error(
                //     `GET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`
                // );
            }
            return v;
        },

        set: function (target, key, value, receiver) {
            const v = Reflect.get(target, key, receiver);
            // console.error(
            //     `SET ${v ? (typeof v).substring(0, 7) : "NONE"}\t${key}`
            // );
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
    globalThis.window = window;
    process.on("beforeExit", (code) => {
        code && console.error(`beforeExit: ${code}`);
        // console.error(window.tests);
    });

    //catches uncaught exceptions
    process.on("uncaughtException", () => {
        console.error(`uncaughtException`);
    });

    window.tap = tap;
    window.TypeError = TypeError;

    window.addEventListener(
        "error",
        function (e) {
            console.error("event error", e);
        },
        false
    );
    window.addEventListener(
        "unhandledrejection",
        function (e) {
            console.error("event unhandledrejection", e);
        },
        false
    );

    window
        .loadURL(_FILE, { resourceLoader: new TestResourceLoader() })
        .then(function (document) {
            // console.error("baseURI", document.isHTML, document.baseURI);
            // console.error("path", document.innerHTML);
            // console.error("win", document.location);
        })
        .catch(function (err) {
            tap.fail(`Load failed ${test_name}`, err);
            tap.threw(err);
            // console.error("err", err);
            throw err;
        });

    // console.error("This message is displayed first.");
} else {
    // const test_file = "svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg";
    process.env._FILE = "AUX";
    const PKG_DIR_URL = pathToFileURL(".");
    let tests = `
svg/types/scripted/SVGGeometryElement.getTotalLength-01.svg
svg/types/scripted/SVGGeometryElement.getPointAtLength-01.svg
svg/types/scripted/SVGGeometryElement.getPointAtLength-02.svg
// svg/types/scripted/SVGGeometryElement.getPointAtLength-04.svg
// svg/types/scripted/SVGGeometryElement.getPointAtLength-05.svg

dom/nodes/Document-createCDATASection-xhtml.xhtml
dom/nodes/Document-createProcessingInstruction-xhtml.xhtml
dom/nodes/DocumentType-literal-xhtml.xhtml
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
dom/nodes/Node-lookupPrefix.xhtml

dom/nodes/ProcessingInstruction-literal-1.xhtml
dom/nodes/ProcessingInstruction-literal-2.xhtml
dom/nodes/DocumentType-literal-xhtml.xhtml

dom/nodes/Document-getElementsByTagName-xhtml.xhtml
dom/nodes/Node-nodeName-xhtml.xhtml

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

dom/nodes/CharacterData-appendChild.html
dom/nodes/CharacterData-appendData.html
dom/nodes/CharacterData-data.html
dom/nodes/CharacterData-deleteData.html
dom/nodes/CharacterData-insertData.html
dom/nodes/CharacterData-remove.html
dom/nodes/CharacterData-replaceData.html
dom/nodes/CharacterData-substringData.html
dom/nodes/CharacterData-surrogates.html

dom/nodes/Document-constructor.html
dom/nodes/Document-createAttribute.html
dom/nodes/Document-createCDATASection.html
dom/nodes/Document-createComment.html
dom/nodes/Document-createProcessingInstruction.html
dom/nodes/Document-createTextNode.html
dom/nodes/Document-doctype.html
dom/nodes/DocumentFragment-getElementById.html
dom/nodes/DocumentFragment-querySelectorAll-after-modification.html
dom/nodes/Document-getElementById.html

dom/nodes/DocumentFragment-constructor.html
dom/nodes/Document-implementation.html
dom/nodes/Document-importNode.html
dom/nodes/DocumentType-literal.html
dom/nodes/DocumentType-remove.html

dom/nodes/append-on-Document.html
dom/nodes/Element-childElementCount.html
dom/nodes/Element-childElementCount-dynamic-add.html
dom/nodes/Element-childElementCount-dynamic-remove.html
dom/nodes/Element-childElementCount-nochild.html
dom/nodes/Element-childElement-null.html

dom/nodes/Element-firstElementChild.html
dom/nodes/Element-firstElementChild-namespace.html
dom/nodes/Element-getElementsByClassName.html

dom/nodes/Element-hasAttribute.html
dom/nodes/Element-hasAttributes.html
dom/nodes/Element-insertAdjacentElement.html
dom/nodes/Element-lastElementChild.html
dom/nodes/Element-nextElementSibling.html
dom/nodes/Element-previousElementSibling.html
dom/nodes/Element-remove.html
dom/nodes/Element-removeAttribute.html
dom/nodes/Element-removeAttributeNS.html
dom/nodes/Element-setAttribute.html
dom/nodes/Element-setAttribute-crbug-1138487.html
dom/nodes/Element-siblingElement-null.html
dom/nodes/Element-tagName.html

dom/nodes/Node-appendChild.html
dom/nodes/Node-baseURI.html
dom/nodes/Node-cloneNode.html
dom/nodes/Node-cloneNode-document-with-doctype.html

dom/nodes/Node-nodeName.html
dom/nodes/Node-nodeValue.html
dom/nodes/Node-normalize.html
dom/nodes/Node-parentElement.html
dom/nodes/Node-properties.html
dom/nodes/Node-removeChild.html
dom/nodes/Node-replaceChild.html
dom/nodes/Node-textContent.html
dom/nodes/Node-constants.html
dom/nodes/Node-contains.html
dom/nodes/Node-insertBefore.html
dom/nodes/Node-isEqualNode.html
dom/nodes/Node-isSameNode.html
dom/nodes/Text-splitText.html
dom/nodes/Text-wholeText.html

dom/nodes/ParentNode-append.html
dom/nodes/ParentNode-children.html
dom/nodes/ParentNode-prepend.html
dom/nodes/ParentNode-querySelector-case-insensitive.html
dom/nodes/ParentNode-querySelectors-exclusive.html
dom/nodes/ParentNode-querySelectors-space-and-dash-attribute-value.html
dom/nodes/prepend-on-Document.html
dom/nodes/ChildNode-after.html
dom/nodes/ChildNode-before.html
dom/nodes/ChildNode-replaceWith.html
dom/nodes/getElementsByClassName-32.html
dom/nodes/getElementsByClassName-empty-set.html
dom/nodes/Node-cloneNode-XMLDocument.html
dom/nodes/NodeList-Iterable.html
dom/nodes/Node-lookupNamespaceURI.html
dom/nodes/Node-mutation-adoptNode.html
dom/nodes/insert-adjacent.html
dom/events/Event-constants.html
dom/events/Event-defaultPrevented.html
dom/events/Event-dispatch-bubble-canceled.html
dom/events/Event-propagation.html
dom/events/Event-returnValue.html
dom/events/Event-type.html

css/cssom/cssom-cssText-serialize.html
css/cssom/cssom-cssstyledeclaration-set.html
css/cssom/cssom-setProperty-shorthand.html
css/cssom/cssstyledeclaration-setter-declarations.html
css/cssom/setproperty-null-undefined.html

dom/nodes/getElementsByClassName-01.htm
dom/nodes/getElementsByClassName-02.htm
dom/nodes/getElementsByClassName-03.htm
dom/nodes/getElementsByClassName-04.htm
dom/nodes/getElementsByClassName-05.htm
dom/nodes/getElementsByClassName-06.htm
dom/nodes/getElementsByClassName-07.htm
dom/nodes/getElementsByClassName-08.htm
dom/nodes/getElementsByClassName-12.htm
dom/nodes/getElementsByClassName-13.htm
dom/nodes/getElementsByClassName-14.htm
dom/nodes/getElementsByClassName-15.htm
dom/nodes/getElementsByClassName-16.htm
dom/nodes/getElementsByClassName-17.htm
dom/nodes/getElementsByClassName-18.htm
dom/nodes/getElementsByClassName-19.htm
dom/nodes/getElementsByClassName-23.htm
dom/nodes/getElementsByClassName-24.htm
dom/nodes/getElementsByClassName-29.htm
dom/nodes/getElementsByClassName-30.htm

dom/nodes/ProcessingInstruction-escapes-1.xhtml
dom/nodes/getElementsByClassName-10.xml
dom/nodes/Element-insertAdjacentText.html
dom/nodes/Node-compareDocumentPosition.html
svg/types/scripted/SVGGraphicsElement.getBBox-01.html
dom/nodes/Element-closest.html
dom/nodes/Document-getElementsByClassName.html
dom/nodes/attributes.html
dom/events/Event-initEvent.html
dom/events/EventTarget-dispatchEvent-returnvalue.html
    dom/nodes/svg-template-querySelector.html
    dom/nodes/DOMImplementation-hasFeature.html
    dom/nodes/attributes-namednodemap.html
dom/nodes/Node-childNodes.html
dom/nodes/getElementsByClassName-whitespace-class-names.html
svg/types/scripted/SVGLength.html

//     `;
    //     tests = `
    // dom/nodes/node-appendchild-crash.html
    // dom/nodes/Node-cloneNode-on-inactive-document-crash.html
    // dom/nodes/Node-cloneNode-external-stylesheet-no-bc.sub.html

    // // dom/nodes/aria-attribute-reflection.tentative.html
    // // dom/nodes/aria-element-reflection.tentative.html
    // // dom/nodes/case.html
    // // dom/nodes/Comment-constructor.html

    // // dom/nodes/Document-createTreeWalker.html
    // // dom/nodes/Document-getElementsByTagNameNS.html
    // // dom/nodes/Document-URL.html

    // // dom/nodes/MutationObserver-attributes.html
    // // dom/nodes/MutationObserver-callback-arguments.html
    // // dom/nodes/MutationObserver-characterData.html
    // // dom/nodes/MutationObserver-childList.html
    // // dom/nodes/MutationObserver-disconnect.html
    // // dom/nodes/MutationObserver-document.html
    // // dom/nodes/MutationObserver-inner-outer.html
    // // dom/nodes/MutationObserver-sanity.html
    // // dom/nodes/MutationObserver-takeRecords.html
    // // dom/nodes/ParentNode-querySelector-All-content.html
    // // dom/nodes/ParentNode-querySelectorAll-removed-elements.html
    // // dom/nodes/ParentNode-querySelector-escapes.html
    // // dom/nodes/ParentNode-querySelector-scope.html
    // // dom/nodes/ParentNode-querySelectors-namespaces.html
    // dom/nodes/query-target-in-load-event.html
    // dom/nodes/query-target-in-load-event.part.html
    // dom/nodes/remove-and-adopt-thcrash.html
    // dom/nodes/remove-from-shadow-host-and-adopt-into-iframe.html
    // dom/nodes/remove-from-shadow-host-and-adopt-into-iframe-ref.html
    // dom/nodes/remove-unscopable.html
    // dom/nodes/rootNode.html
    // dom/nodes/Text-constructor.html

    //      `;

    // //     tests = `// Iframed
    // // dom/nodes/Document-createElement.html
    // // `;

    //     tests = `
    // dom/nodes/DOMImplementation-createDocumentType.html
    // // dom/nodes/DOMImplementation-createDocument.html
    // dom/nodes/DOMImplementation-createDocument-with-null-browsing-context-crash.html

    // `;
    let tests_try = `
// # MutationObserver
// dom/nodes/ParentNode-replaceChildren.html


    // Iframed
// dom/nodes/Document-createElementNS.html
// dom/nodes/DOMImplementation-createHTMLDocument.html
// dom/nodes/DOMImplementation-createHTMLDocument-with-null-browsing-context-crash.html
// dom/nodes/DOMImplementation-createHTMLDocument-with-saved-implementation.html
// dom/nodes/Document-createElement-namespace.html
// dom/nodes/Node-isEqualNode-xhtml.xhtml
// dom/nodes/Node-parentNode.html
// dom/nodes/Node-parentNode-iframe.html
// dom/nodes/Element-webkitMatchesSelector.html
// dom/nodes/Document-characterSet-normalization-1.html
// dom/nodes/Document-characterSet-normalization-2.html

/////////
// dom/nodes/getElementsByClassName-11.xml

// dom/nodes/Element-children.html
// dom/nodes/Element-classlist.html

// dom/nodes/Element-getElementsByTagName.html
// dom/nodes/Element-getElementsByTagName-change-document-HTMLNess.html
// dom/nodes/Element-getElementsByTagNameNS.html
// dom/nodes/Element-matches.html
// dom/nodes/Element-matches-namespaced-elements.html

// dom/nodes/Node-cloneNode-svg.html
// dom/nodes/Node-isConnected.html
// dom/nodes/Node-isConnected-shadow-dom.html

// dom/nodes/Document-getElementsByTagName.html

// dom/nodes/getElementsByClassName-20.htm
// dom/nodes/getElementsByClassName-21.htm
// dom/nodes/getElementsByClassName-22.htm
// dom/nodes/getElementsByClassName-25.htm
// dom/nodes/getElementsByClassName-26.htm
// dom/nodes/getElementsByClassName-27.htm
// dom/nodes/getElementsByClassName-28.htm
// dom/nodes/getElementsByClassName-31.htm
// // dom/nodes/ParentNode-querySelector-All.html
// // dom/nodes/Document-createEvent.https.html
// svg/types/scripted/SVGGeometryElement.getPointAtLength-03.svg
svg/types/scripted/SVGLengthList-basics.html
css/css-box/parsing/padding-shorthand.html
css/css-box/parsing/margin-shorthand.html
`;
    tests = (process.env.TRY ? tests_try : tests)
        .split(/[\r\n]+/)
        .map((v) => v.trim())
        .filter((v) => v && !v.startsWith("#") && !v.startsWith("//"));

    // console.info(tests);
    tap.jobs = 5;
    // console.info(`test: ${tests.length}`);
    let i = 0;
    for (const sub of tests) {
        // const href = new URL(sub, WPT_ROOT_URL).href;
        process.env._FILE = sub;
        tap.spawn(
            // "tap",
            "node",
            ["test/wpt-run.tap.mjs"],
            // {buffered:true},
            `[${++i} ${sub}]`
        );
    }
}
