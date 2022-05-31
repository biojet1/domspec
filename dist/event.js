import { Event, DOMException } from "./event-target.js";
export class CustomEvent extends Event {
}
export function createEvent(name) {
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
    throw DOMException.new("NotSupportedError");
}
//# sourceMappingURL=event.js.map