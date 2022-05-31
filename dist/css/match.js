import { NEXT, END } from '../node.js';
import { ParentNode } from '../parent-node.js';
import { compile } from 'css-select';
function* iterAll(test, nodes) {
    for (const node of nodes) {
        if (node.nodeType === 1) {
            if (test(node)) {
                yield node;
            }
            else {
                let { [NEXT]: next, [END]: end } = node;
                for (; next && next !== end; next = next[NEXT]) {
                    if (next.nodeType === 1 && test(next)) {
                        yield next;
                    }
                }
            }
        }
    }
}
const adapter = {
    isTag: function (node) {
        return node.nodeType === 1;
    },
    getName: function (elem) {
        return elem.localName.toLowerCase();
    },
    hasAttrib: function (elem, name) {
        return elem.hasAttribute(name);
    },
    getText: function (node) {
        switch (node.nodeType) {
            case 3:
                return node.nodeValue || '';
            case 1:
                return node.textContent || '';
        }
        return '';
    },
    getAttributeValue: function (elem, name) {
        return elem.getAttribute(name) || undefined;
    },
    getParent: function (elem) {
        const { parentNode } = elem;
        return parentNode && 1 === parentNode.nodeType ? parentNode : null;
    },
    getChildren: function (node) {
        return node instanceof ParentNode ? Array.from(node.childNodes) : [];
    },
    getSiblings: function (elem) {
        const { parentNode } = elem;
        return parentNode ? Array.from(parentNode.childNodes) : [elem];
    },
    findOne: function (test, nodes) {
        for (const node of iterAll(test, nodes)) {
            return node;
        }
        return null;
    },
    findAll: function (test, nodes) {
        return Array.from(iterAll(test, nodes));
    },
    existsOne: function (test, elements) {
        for (const node of iterAll(test, elements)) {
            if (node) {
                return true;
            }
        }
        return false;
    },
    removeSubsets: function (nodes) {
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
export function prepareMatch(elem, selectors) {
    const opt = {
        xmlMode: true,
        adapter,
    };
    if (selectors.indexOf(':scope') >= 0) {
        opt.context = elem;
    }
    return compile(selectors, opt);
}
//# sourceMappingURL=match.js.map