import { NEXT, END /*, Node*/ } from '../node.js';
import { ChildNode } from '../child-node.js';
import { ParentNode } from '../parent-node.js';
import { compile } from 'css-select';

function* iterAll(test: (node: Element) => boolean, nodes: Iterable<ChildNode>) {
	for (const node of nodes) {
		if (node.nodeType === 1) {
			if (test(node as Element)) {
				yield node as Element;
			} else {
				let { [NEXT]: next, [END]: end } = node as ParentNode;
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
	isTag: function (node: ChildNode): node is Element {
		// return node is Element;
		return node.nodeType === 1;
	},

	getName: function (elem: Element) {
		return elem.localName.toLowerCase();
	},

	hasAttrib: function (elem: Element, name: string) {
		return elem.hasAttribute(name);
	},

	getText: function (node: ChildNode) {
		switch (node.nodeType) {
			case 3:
				return node.nodeValue || '';
			case 1:
				return node.textContent || '';
		}
		return '';
	},

	getAttributeValue: function (elem: Element, name: string) {
		return elem.getAttribute(name) || undefined;
	},

	getParent: function (elem: Element) {
		const { parentNode } = elem;
		return parentNode && 1 === parentNode.nodeType ? (parentNode as Element) : null;
	},

	getChildren: function (node: ChildNode) {
		return node instanceof ParentNode ? Array.from(node.childNodes) : [];
	},

	getSiblings: function (elem: ChildNode) {
		const { parentNode } = elem;
		return parentNode ? Array.from(parentNode.childNodes) : [elem];
	},

	findOne: function (test: (node: Element) => boolean, nodes: Iterable<ChildNode>) {
		for (const node of iterAll(test, nodes)) {
			return node;
		}
		return null;
	},

	findAll: function (test: (node: Element) => boolean, nodes: Iterable<ChildNode>) {
		return Array.from(iterAll(test, nodes));
	},

	existsOne: function (test: (node: Element) => boolean, elements: Iterable<ChildNode>) {
		for (const node of iterAll(test, elements)) {
			if (node) {
				return true;
			}
		}
		return false;
	},

	removeSubsets: function (nodes: ChildNode[]) {
		let { length } = nodes;
		while (length-- > 0) {
			const node = nodes[length];
			if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
				nodes.splice(length, 1);
				continue;
			}
			for (let { parentNode } = node; parentNode; parentNode = parentNode.parentNode) {
				if (nodes.includes(parentNode)) {
					nodes.splice(length, 1);
					break;
				}
			}
		}
		return nodes;
	},
};

export function prepareMatch(elem: ParentNode, selectors: string): (node: ParentNode) => boolean {
	const opt = {
		// xmlMode: !ignoreCase(elem),
		xmlMode: true,
		// context: elem,
		adapter,
	};
	if (selectors.indexOf(':scope') >= 0) {
		(opt as any).context = elem;
	}
	return compile(selectors, opt);
}

import { Element } from '../element.js';
