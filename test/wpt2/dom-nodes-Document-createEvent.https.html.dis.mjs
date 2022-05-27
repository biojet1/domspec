import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf-8\"/>\n<title>Document.createEvent</title>\n<link rel=\"help\" href=\"https://dom.spec.whatwg.org/#dom-document-createevent\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"Document-createEvent.js\"/>\n</head><body><div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/Document-createEvent.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

function testAlias(arg, iface) {
  var ev;
  test(function() {
    ev = document.createEvent(arg);
    assert_equals(Object.getPrototypeOf(ev), window[iface].prototype);
  }, arg + " should be an alias for " + iface + ".");
  test(function() {
    assert_equals(ev.type, "",
                  "type should be initialized to the empty string");
    assert_equals(ev.target, null,
                  "target should be initialized to null");
    assert_equals(ev.currentTarget, null,
                  "currentTarget should be initialized to null");
    assert_equals(ev.eventPhase, 0,
                  "eventPhase should be initialized to NONE (0)");
    assert_equals(ev.bubbles, false,
                  "bubbles should be initialized to false");
    assert_equals(ev.cancelable, false,
                  "cancelable should be initialized to false");
    assert_equals(ev.defaultPrevented, false,
                  "defaultPrevented should be initialized to false");
    assert_equals(ev.isTrusted, false,
                  "isTrusted should be initialized to false");
  }, "createEvent('" + arg + "') should be initialized correctly.");
}
for (var alias in aliases) {
  var iface = aliases[alias];
  testAlias(alias, iface);
  testAlias(alias.toLowerCase(), iface);
  testAlias(alias.toUpperCase(), iface);

  if (alias[alias.length - 1] != "s") {
    var plural = alias + "s";
    if (!(plural in aliases)) {
      test(function () {
        assert_throws_dom("NOT_SUPPORTED_ERR", function () {
          var evt = document.createEvent(plural);
        });
      }, 'Should throw NOT_SUPPORTED_ERR for pluralized legacy event interface "' + plural + '"');
    }
  }
}

test(function() {
  assert_throws_dom("NOT_SUPPORTED_ERR", function() {
    var evt = document.createEvent("foo");
  });
  assert_throws_dom("NOT_SUPPORTED_ERR", function() {
    // 'LATIN CAPITAL LETTER I WITH DOT ABOVE' (U+0130)
    var evt = document.createEvent("U\u0130Event");
  });
  assert_throws_dom("NOT_SUPPORTED_ERR", function() {
    // 'LATIN SMALL LETTER DOTLESS I' (U+0131)
    var evt = document.createEvent("U\u0131Event");
  });
}, "Should throw NOT_SUPPORTED_ERR for unrecognized arguments");

/*
 * The following are event interfaces which do actually exist, but must still
 * throw since they're absent from the table in the spec for
 * document.createEvent().  This list is not exhaustive, but includes all
 * interfaces that it is known some UA does or did not throw for.
 */
var someNonCreateableEvents = [
  "AnimationEvent",
  "AnimationPlaybackEvent",
  "AnimationPlayerEvent",
  "ApplicationCacheErrorEvent",
  "AudioProcessingEvent",
  "AutocompleteErrorEvent",
  "BeforeInstallPromptEvent",
  "BlobEvent",
  "ClipboardEvent",
  "CloseEvent",
  "CommandEvent",
  "DataContainerEvent",
  "ErrorEvent",
  "ExtendableEvent",
  "ExtendableMessageEvent",
  "FetchEvent",
  "FontFaceSetLoadEvent",
  "GamepadEvent",
  "GeofencingEvent",
  "IDBVersionChangeEvent",
  "InstallEvent",
  "KeyEvent",
  "MIDIConnectionEvent",
  "MIDIMessageEvent",
  "MediaEncryptedEvent",
  "MediaKeyEvent",
  "MediaKeyMessageEvent",
  "MediaQueryListEvent",
  "MediaStreamEvent",
  "MediaStreamTrackEvent",
  "MouseScrollEvent",
  "MutationEvent",
  "NotificationEvent",
  "NotifyPaintEvent",
  "OfflineAudioCompletionEvent",
  "OrientationEvent",
  "PageTransition", // Yes, with no "Event"
  "PageTransitionEvent",
  "PointerEvent",
  "PopStateEvent",
  "PopUpEvent",
  "PresentationConnectionAvailableEvent",
  "PresentationConnectionCloseEvent",
  "ProgressEvent",
  "PromiseRejectionEvent",
  "PushEvent",
  "RTCDTMFToneChangeEvent",
  "RTCDataChannelEvent",
  "RTCIceCandidateEvent",
  "RelatedEvent",
  "ResourceProgressEvent",
  "SVGEvent",
  "SVGZoomEvent",
  "ScrollAreaEvent",
  "SecurityPolicyViolationEvent",
  "ServicePortConnectEvent",
  "ServiceWorkerMessageEvent",
  "SimpleGestureEvent",
  "SpeechRecognitionError",
  "SpeechRecognitionEvent",
  "SpeechSynthesisEvent",
  "SyncEvent",
  "TimeEvent",
  "TouchEvent",
  "TrackEvent",
  "TransitionEvent",
  "WebGLContextEvent",
  "WebKitAnimationEvent",
  "WebKitTransitionEvent",
  "WheelEvent",
  "XULCommandEvent",
];
someNonCreateableEvents.forEach(function (eventInterface) {
  test(function () {
    assert_throws_dom("NOT_SUPPORTED_ERR", function () {
      var evt = document.createEvent(eventInterface);
    });
  }, 'Should throw NOT_SUPPORTED_ERR for non-legacy event interface "' + eventInterface + '"');

  // SVGEvents is allowed, other plurals are not
  if (eventInterface !== "SVGEvent") {
    test(function () {
      assert_throws_dom("NOT_SUPPORTED_ERR", function () {
        var evt = document.createEvent(eventInterface + "s");
      });
    }, 'Should throw NOT_SUPPORTED_ERR for pluralized non-legacy event interface "' + eventInterface + 's"');
  }
});
