import { Event } from "./event-target.js";

export class CustomEvent extends Event {}

export function createEvent(name: string) {
	// TODO
	name = name.toLowerCase();
	switch (name) {
		case "events":
		case "htmlevents":
		case "event":
		case "svgevents":
			{
				const e = new Event();
				e._initialized = false;
				return e;
			}
			break;
		case "customevent":
			{
				const e = new CustomEvent();
				e._initialized = false;
				return e;
			}
			break;
		case "uievents":
		case "uievent":
			break;

		case "mouseevents":
		case "mouseevent":
			break;
		case "mutationevents":
		case "mutationevent":
			break;
	}
	throw new Error("NotSupportedError");
}
// "event" 	Event
// "events"
// "svgevents" 	Event
// "htmlevents" 	Event
// "mouseevent" 	MouseEvent 	[UIEVENTS]
// "mouseevents"
// "customevent" 	CustomEvent
// "uievent" 	UIEvent 	[UIEVENTS]
// "uievents"

// "beforeunloadevent" 	BeforeUnloadEvent 	[HTML]
// "messageevent" 	MessageEvent 	[HTML]
// "storageevent" 	StorageEvent 	[HTML]

// "hashchangeevent" 	HashChangeEvent 	[HTML]
// "compositionevent" 	CompositionEvent 	[UIEVENTS]
// "devicemotionevent" 	DeviceMotionEvent 	[DEVICE-ORIENTATION]
// "deviceorientationevent" 	DeviceOrientationEvent
// "dragevent" 	DragEvent 	[HTML]
// "focusevent" 	FocusEvent 	[UIEVENTS]
// "keyboardevent" 	KeyboardEvent 	[UIEVENTS]
// "textevent" 	CompositionEvent 	[UIEVENTS]
// "touchevent" 	TouchEvent 	[TOUCH-EVENTS]

// function runScript(){
//     const src = script.getAttributeNode("src");

//     // if (src) {
//     //     let file = src.substring(1);
//     //     // console.log("file", file.substring(1));
//     //     file = new URL(file, WPT_ROOT_URL);
//     //     // console.log("url", file);
//     //     file = fileURLToPath(file);
//     //     // console.log("path", file);
//     //     vm.runInThisContext(fs.readFileSync(file, "utf8"), file);
//     // } else {
//     //     // console.log("script", script.textContent);

//     //     vm.runInThisContext(script.textContent, `script${i++}`);
//     // }
// }