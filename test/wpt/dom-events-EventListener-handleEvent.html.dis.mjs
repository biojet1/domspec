import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>EventListener::handleEvent()</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#callbackdef-eventlistener\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

setup({ allow_uncaught_exception: true });

test(function(t) {
    var type = "foo";
    var target = document.createElement("div");
    var eventListener = {
        handleEvent: function(evt) {
            var that = this;
            t.step(function() {
                assert_equals(evt.type, type);
                assert_equals(evt.target, target);
                assert_equals(evt.srcElement, target);
                assert_equals(that, eventListener);
            });
        },
    };

    target.addEventListener(type, eventListener);
    target.dispatchEvent(new Event(type));
}, "calls `handleEvent` method of `EventListener`");

test(function(t) {
    var type = "foo";
    var target = document.createElement("div");
    var calls = 0;

    target.addEventListener(type, {
        get handleEvent() {
            calls++;
            return function() {};
        },
    });

    assert_equals(calls, 0);
    target.dispatchEvent(new Event(type));
    target.dispatchEvent(new Event(type));
    assert_equals(calls, 2);
}, "performs `Get` every time event is dispatched");

test(function(t) {
    var type = "foo";
    var target = document.createElement("div");
    var calls = 0;
    var eventListener = function() { calls++; };
    eventListener.handleEvent = t.unreached_func("`handleEvent` method should not be called on functions");

    target.addEventListener(type, eventListener);
    target.dispatchEvent(new Event(type));
    assert_equals(calls, 1);
}, "doesn't call `handleEvent` method on callable `EventListener`");

const uncaught_error_test = async (t, getHandleEvent) => {
    const type = "foo";
    const target = document.createElement("div");

    let calls = 0;
    target.addEventListener(type, {
        get handleEvent() {
            calls++;
            return getHandleEvent();
        },
    });

    const timeout = () => {
        return new Promise(resolve => {
            t.step_timeout(resolve, 0);
        });
    };

    const eventWatcher = new EventWatcher(t, window, "error", timeout);
    const errorPromise = eventWatcher.wait_for("error");

    target.dispatchEvent(new Event(type));

    const event = await errorPromise;
    assert_equals(calls, 1, "handleEvent property was not looked up");
    throw event.error;
};

promise_test(t => {
    const error = { name: "test" };

    return promise_rejects_exactly(t, error,
        uncaught_error_test(t, () => { throw error; }));
}, "rethrows errors when getting `handleEvent`");

promise_test(t => {
    return promise_rejects_js(t, TypeError, uncaught_error_test(t, () => null));
}, "throws if `handleEvent` is falsy and not callable");

promise_test(t => {
    return promise_rejects_js(t, TypeError, uncaught_error_test(t, () => 42));
}, "throws if `handleEvent` is thruthy and not callable");
