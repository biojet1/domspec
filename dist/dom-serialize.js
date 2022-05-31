export class XMLSerializer {
    serializeToString(node) {
        const { endNode, startNode, nodeType } = node;
        switch (nodeType) {
            default:
                return Array.from(enumXMLDump(startNode, endNode)).join('');
            case 9:
                return Array.from(enumXMLDump(startNode[NEXT] || startNode, endNode[PREV] || endNode)).join('');
        }
    }
}
export function* enumXMLDump(start, end) {
    let isOpened = false;
    let cur = start;
    const { ownerDocument } = start;
    let voidElements = ownerDocument &&
        ownerDocument.isHTML &&
        /^(?:\w+:)?(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
    do {
        switch (cur.nodeType) {
            case 2:
                {
                    const v = cur.valueOf();
                    if (v != null) {
                        const { name } = cur;
                        if (name)
                            yield ` ${name}="${v.replace(/[<>&"\xA0\t\n\r]/g, rep)}"`;
                    }
                }
                break;
            case 3:
            case 4:
            case 7:
            case 8:
            case 10:
                if (isOpened) {
                    yield '>';
                    isOpened = false;
                }
                yield cur.toString();
                break;
            case -1:
                const { [PREV]: prev, parentNode: start } = cur;
                switch (start.nodeType) {
                    default:
                        throw new Error(`Unexpected nodeType ${start.nodeType}`);
                    case 11:
                    case 1:
                    case 9: {
                        if (prev === start || prev instanceof Attr) {
                            if (!voidElements || voidElements.test(start.qualifiedName)) {
                                yield `/>`;
                            }
                            else {
                                yield `></${start.qualifiedName}>`;
                            }
                        }
                        else if (isOpened) {
                            yield `></${start.qualifiedName}>`;
                        }
                        else {
                            yield `</${start.qualifiedName}>`;
                        }
                        isOpened = false;
                    }
                }
                break;
            case 11:
            case 1:
            case 9:
                if (isOpened) {
                    yield `><${cur.qualifiedName}`;
                }
                else {
                    yield `<${cur.qualifiedName}`;
                }
                isOpened = true;
                break;
            default:
                throw new Error(`Unexpected nodeType ${cur.nodeType}`);
        }
    } while (cur !== end && (cur = cur[NEXT]));
}
export function* enumFlatDOM(node) {
    const { endNode: end } = node;
    let cur = node;
    do {
        if (cur instanceof Attr) {
            const { nodeType, name, value } = cur;
            yield nodeType;
            yield name;
            yield value;
        }
        else if (cur instanceof ParentNode) {
            const { nodeType, nodeName } = cur;
            yield nodeType;
            yield nodeName;
        }
        else if (cur instanceof EndNode) {
            yield -1;
        }
        else if (cur instanceof ChildNode) {
            const { nodeType, nodeValue } = cur;
            yield nodeType;
            yield nodeValue;
        }
        else {
            throw new Error(`Invalid node ${cur}`);
        }
    } while (cur !== end && (cur = cur[NEXT]));
}
const rep = function (m) {
    switch (m) {
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        case '>':
            return '&gt;';
        case '"':
            return '&quot;';
    }
    return `&#${m.charCodeAt(0)};`;
};
import { NEXT, PREV } from './node.js';
import { ChildNode } from './child-node.js';
import { ParentNode, EndNode } from './parent-node.js';
import { Attr } from './attr.js';
//# sourceMappingURL=dom-serialize.js.map