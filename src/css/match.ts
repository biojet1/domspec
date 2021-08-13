import { Node, NEXT, END } from "../node.js";
import { ParentNode } from "../parent-node.js";
import { compile, is } from "css-select";

// import {ELEMENT_NODE, TEXT_NODE} from './constants.js';
// import {ignoreCase} from './utils.js';

// const {isArray} = Array;

// /* c8 ignore start */

// /* c8 ignore stop */

function* iterAll(test: (node: Element) => boolean, nodes: Iterable<Node>) {
	for (const node of nodes) {
		if (node.nodeType === 1) {
			if (test(node as Element)) {
				yield node as Element;
			} else {
				let { [NEXT]: next, [END]: end } = node as Element;
				for (; next && next !== end; next = next[NEXT]) {
					if (next.nodeType === 1 && test(next as Element)) {
						yield next as Element;
					}
				}
			}
		}
	}
}
const adapter = {
	isTag: function (node: Node): node is Element {
		// return node is Element;
		return node.nodeType === 1;
	},

	getName: function (elem: Element) {
		return elem.localName.toLowerCase();
	},

	hasAttrib: function (elem: Element, name: string) {
		return elem.hasAttribute(name);
	},

	getText: function (node: Node) {
		switch (node.nodeType) {
			case 3:
				return node.nodeValue || "";
			case 1:
				return node.textContent || "";
		}
		return "";
	},

	getAttributeValue: function (elem: Element, name: string) {
		return elem.getAttribute(name) || undefined;
	},

	getParent: function (elem: Element) {
		const { parentNode } = elem;
		return parentNode && parentNode instanceof Element ? parentNode : null;
	},

	getChildren: function (node: Node) {
		return node instanceof Element ? node.childNodes : [];
	},

	getSiblings: function (elem: Node) {
		const { parentNode } = elem;
		return parentNode ? (parentNode.childNodes as Array<Node>) : [elem];
	},

	findOne: function (
		test: (node: Element) => boolean,
		nodes: Iterable<Node>
	) {
		for (const node of iterAll(test, nodes)) {
			return node;
		}
		return null;
	},

	findAll: function (
		test: (node: Element) => boolean,
		nodes: Iterable<Node>
	) {
		return Array.from(iterAll(test, nodes));
	},

	existsOne: function (
		test: (node: Element) => boolean,
		elements: Iterable<Node>
	) {
		for (const node of iterAll(test, elements)) {
			return true;
		}
		return false;
	},
	removeSubsets: function (nodes: Node[]) {
		let { length } = nodes;
		while (length-- > 0) {
			const node = nodes[length];
			if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
				nodes.splice(length, 1);
				continue;
			}
			for (
				let { parentNode } = node;
				parentNode;
				parentNode = parentNode.parentNode
			) {
				if (nodes.includes(parentNode)) {
					nodes.splice(length, 1);
					break;
				}
			}
		}
		return nodes;
	},
	// const removeSubsets = nodes => {
	//   let {length} = nodes;
	//   while (length--) {
	//     const node = nodes[length];
	//   }
	//   return nodes;
	// };

	// const getText = node => {
	//   if (isArray(node))
	//     return node.map(getText).join('');
	//   if (isTag(node))
	//     return getText(getChildren(node));
	//   if (node.nodeType === TEXT_NODE)
	//     return node.data;
	//   return '';
	// };
	// removeSubsets,
};

export function prepareMatch(
	elem: ParentNode,
	selectors: string
): (node: Element) => boolean {
	return compile(selectors, {
		// xmlMode: !ignoreCase(elem),
		xmlMode: true,
		adapter,
	});
}

// export const matches = (elem: Element, selectors: string) => {
// 	return is(elem, selectors, {
// 		// strict: true,
// 		// xmlMode: !ignoreCase(elem),
// 		xmlMode: true,
// 		adapter,
// 	});
// };

import { Element } from "../element.js";
