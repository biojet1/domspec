export interface Event {
	readonly type: string;
	target: EventTarget;
	defaultPrevented?: boolean;
}

export interface EventListener {
	handleEvent(event: Event): undefined;
}

interface EventStack {
	[key: string]: Array<EventListener>;
}

export class EventTarget {
	listeners?: EventStack;
	addEventListener(type: string, callback: EventListener) {
		let { listeners } = this;
		if (listeners) {
			const { [type]: stack } = listeners;
			if (stack) {
				stack.push(callback);
			} else {
				listeners[type] = [callback];
			}
		} else {
			this.listeners = { [type]: [callback] };
		}
	}

	dispatchEvent(event: Event) {
		let { listeners } = this;
		if (listeners) {
			const { [event.type]: stack } = listeners;
			if (stack) {
				event.target = this;
				for (const el of stack) {
					el.handleEvent(event);
				}
				return !event.defaultPrevented;
			}
		}
		return true;
	}

	removeEventListener(type: string, callback: EventListener) {
		let { listeners } = this;
		if (listeners) {
			const { [type]: stack } = listeners;
			if (stack)
				for (let i = stack.length; i-- > 0; ) {
					if (stack[i] === callback) {
						stack.splice(i, 1);
						// return;
					}
				}
		}
	}
}
