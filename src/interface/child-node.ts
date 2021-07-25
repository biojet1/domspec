import { Node } from "./node.js";

export class ChildNode extends Node {
	//// Tree

	//// Dom
	get nextSibling(): ChildNode | null {
		const { precedingSibling: node } = this;
		return node instanceof ChildNode ? node : null;
	}
	get parentElement(): Element | null {
		const { parentNode: node } = this;
		return node instanceof Element ? node : null;
	}
}

import { Element } from "./element.js";
