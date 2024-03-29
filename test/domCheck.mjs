"uses strict";

export function checkNode(t, node) {
    switch (node.nodeType) {
        case 1:
            t.strictSame(node.nodeName, node.tagName);
            checkParentNode(t, node);
            break;
        case 2: //             ATTRIBUTE_NODE (2);
            t.strictSame(node.nodeName, node.name);
            t.strictSame(node.textContent, node.nodeValue);
            t.strictSame(node.value, node.textContent);
            t.strictSame(node.specified, true);
            const { namespaceURI, prefix, localName, name } = node;
            if (namespaceURI) {
                t.strictNotSame(namespaceURI, "");
                t.ok(prefix && prefix != "");
            }
            t.ok(localName && localName != "");
            t.ok(name && name != "");
            break;
        case 3:
            t.strictSame(node.nodeName, "#text");
            t.strictSame(node.nodeValue, node.data);
            break;
        case 4:
            t.strictSame(node.nodeName, "#cdata-section");
            t.strictSame(node.nodeValue, node.data);
            break;
        case 7: // PROCESSING_INSTRUCTION_NODE
            t.ok(node.nodeName);
            t.strictSame(node.nodeValue, null);
            break;
        case 8:
            t.strictSame(node.nodeName, "#comment");
            t.strictSame(node.nodeValue, node.data);
            break;
        case 9:
            t.strictSame(node.nodeName, "#document");
            t.strictSame(node.nodeValue, null);
            checkParentNode(t, node);
            break;
        case 10: // DOCUMENT_TYPE_NODE
            t.strictSame(node.nodeName, node.name);
            t.strictSame(node.textContent, null);
            t.strictSame(node.nodeValue, null);
            break;
        case 11:
            t.strictSame(node.nodeName, "#document-fragment");
            t.strictSame(node.nodeValue, null);
            checkParentNode(t, node);
            break;
        case -1:
            t.strictSame(node.nodeName, "#end");
            t.strictSame(node.startNode, node.parentNode);
            t.strictSame(node, node.endNode);
            t.strictSame(node.nodeValue, null);
            break;
        default:
            throw new Error(`Unexpected node type ${node.nodeType}`);
    }

    if (node.startNode) {
        switch (node.nodeType) {
            case 1:
            case 9:
            case 11:
                t.strictSame(node, node.startNode);
                t.strictSame(node, node.endNode.parentNode);
                checkNode(t, node.endNode);
                break;
            case -1:
                break;
            default:
                t.strictSame(node, node.startNode);
                t.strictSame(node, node.endNode);
        }
    }
}

export function checkParentNode(t, parent) {
    const {
        children,
        childElementCount,
        childNodes,
        nodeType,
        nodeName,
        parentNode,
        lastChild,
        firstChild,
        firstElementChild,
        lastElementChild,
        ownerDocument,
        attributes,
        parentElement,
    } = parent;
    const elements = Array.from(parent.children);
    const name = `[${nodeType}:${nodeName}]`;

    t.strictSame(
        children.length,
        childElementCount,
        `children.length vs childElementCount ${name}`
    );
    t.strictNotSame(parent, parentNode, "this != parentNode", parentNode);
    if (parentElement) {
        t.strictSame(
            parentElement,
            parentNode,
            "parentElement == parentNode",
            parentElement
        );
    }

    t.ok(
        parent.hasChildNodes()
            ? childNodes.length > 0
            : childNodes.length === 0,
        `hasChildNodes() vs childElementCount ${name} ${childNodes.length} ${parent.hasChildNodes()}`
    );

    if (lastChild) {
        t.notOk(lastChild.nextSibling);
        t.ok(firstChild);
    } else {
        t.ok(parent.hasChildNodes() === false && childElementCount == 0);
    }
    if (firstChild) {
        t.notOk(firstChild.previousSibling);
        t.ok(lastChild);
        t.strictSame(firstChild, childNodes[0]);
    } else {
        t.ok(parent.hasChildNodes() === false && childElementCount == 0);
    }
    if (firstChild && firstChild === lastChild) {
        t.ok(parent.hasChildNodes() === true && childElementCount == 1);
    }
    t.ok((firstChild && lastChild) || (!firstChild && !lastChild));

    if (lastElementChild) {
        t.notOk(lastElementChild.nextElementSibling);
    } else {
        t.strictSame(childElementCount, 0);
    }

    if (firstElementChild) {
        t.notOk(firstElementChild.previousElementSibling);
    }
    t.ok(
        (firstElementChild && lastElementChild) ||
            (!firstElementChild && !lastElementChild)
    );

    let node;
    const root = parent.getRootNode();
    for (node = parentNode; node; node = node.parentNode) {
        t.strictSame(node.contains(parent), true, `contains ${name}`);
        t.strictSame(parent.contains(node), false, `not contains ${name}`);
        // t.strictSame(root.contains(node), true, `root contains ${name}`);
    }

    let i = 0;
    let extra;

    node = firstChild;
    for (i = 0; ; ++i) {
        if (node) {
            extra = [parent, node];
            t.strictSame(node, childNodes[i]);
            t.strictSame(node.parentNode, parent, extra);
            t.strictSame(
                node.ownerDocument,
                nodeType === 9 ? parent : ownerDocument,
                extra
            );

            t.strictSame(
                node.parentElement,
                nodeType === 9 || nodeType === 11 ? null : parent,
                extra
            );
            t.strictSame(node.nextSibling, childNodes[i + 1] || null);
            t.strictSame(node.previousSibling, childNodes[i - 1] || null);
        } else {
            t.strictSame(childNodes.length, 0);
            t.notOk(lastChild);
            break;
        }
        if (node === lastChild) {
            break;
        } else {
            node = node.nextSibling;
        }
    }
    node = lastChild;
    for (i = childNodes.length; i-- > 0; ) {
        if (node) {
            extra = [parent, childNodes[i]];
            t.strictSame(node, childNodes[i]);
            t.strictSame(
                childNodes[i] && childNodes[i].parentNode,
                parent,
                extra
            );
            t.strictSame(
                childNodes[i].ownerDocument,
                nodeType === 9 ? parent : ownerDocument,
                extra
            );
            t.strictSame(
                childNodes[i].parentElement,
                nodeType === 9 || nodeType === 11 ? null : parent,
                extra
            );
            t.strictSame(node.nextSibling, childNodes[i + 1] || null);
            t.strictSame(node.previousSibling, childNodes[i - 1] || null);
        } else {
            t.strictSame(childNodes.length, 0);
            t.notOk(firstChild);
            break;
        }
        if (node === firstChild) {
            break;
        } else {
            node = node.previousSibling;
        }
    }
    t.ok(childNodes.length >= children.length);
    node = firstElementChild;
    for (i = 0; ; ++i) {
        extra = [parent, node];
        if (node) {
            t.strictSame(node, children.item(i));
            t.ok(Array.prototype.indexOf.call(childNodes, node, i) >= i, extra);
            t.strictSame(
                node.nextElementSibling,
                children[i + 1] || null,
                extra
            );
            t.strictSame(
                node.previousElementSibling,
                children[i - 1] || null,
                extra
            );
        } else {
            t.strictSame(children.length, 0, extra);
            t.strictSame(lastElementChild, null, extra);
            break;
        }
        if (node === lastElementChild) {
            break;
        } else {
            node = node.nextElementSibling;
        }
    }

    node = lastElementChild;
    for (i = children.length; --i; ) {
        if (node) {
            extra = [parent, children[i]];
            t.strictSame(node, children.item(i));
            t.ok(Array.prototype.indexOf.call(childNodes, node, i) >= i, extra);
            t.strictSame(
                node.nextElementSibling,
                children[i + 1] || null,
                extra
            );
            t.strictSame(
                node.previousElementSibling,
                children[i - 1] || null,
                extra
            );
        } else {
            t.strictSame(children.length, 0, extra);
            t.strictSame(firstElementChild, null, extra);
            break;
        }
        if (node === firstElementChild) {
            break;
        } else {
            node = node.previousElementSibling;
        }
    }
    if (1 === nodeType) {
        let n = attributes.length;
        while (n-- > 0) {
            const attr = attributes.item(n);
            t.strictSame(parent.hasAttribute(attr.name), true);
            t.strictSame(parent.hasAttribute(attr.name), true);
        }
    }

    childNodes.forEach((node) => checkNode(t, node));
}
