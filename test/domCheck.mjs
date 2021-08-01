"uses strict";

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
    } = parent;
    const elements = Array.from(parent.children);
    const name = `[${nodeType}:${nodeName}]`;

    t.strictSame(
        children.length,
        childElementCount,
        `children.length vs childElementCount ${name}`
    );

    t.ok(
        parent.hasChildNodes()
            ? childNodes.length > 0
            : childNodes.length === 0,
        `hasChildNodes() vs childElementCount ${name}`
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
    for (node = parentNode; node; node = node.parentNode) {
        t.strictSame(node.contains(parent), true, `contains ${name}`);
        t.strictSame(parent.contains(node), false, `not contains ${name}`);
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
                nodeType === 9 ? null : parent,
                extra
            );
            t.strictSame(node.nextSibling, childNodes[i + 1] || null);
            t.strictSame(node.previousSibling, childNodes[i - 1] || null);
        } else {
            t.notOk(childNodes[i]);
        }
        if (node === lastChild) {
            break;
        } else {
            node = node.nextSibling;
        }
    }
    node = lastChild;
    for (i = childNodes.length; --i; ) {
        if (node) {
            extra = [parent, childNodes[i]];
            t.strictSame(node, childNodes[i]);
            t.strictSame(childNodes[i].parentNode, parent, extra);
            t.strictSame(
                childNodes[i].ownerDocument,
                nodeType === 9 ? parent : ownerDocument,
                extra
            );
            t.strictSame(
                childNodes[i].parentElement,
                nodeType === 9 ? null : parent,
                extra
            );
            t.strictSame(node.nextSibling, childNodes[i + 1] || null);
            t.strictSame(node.previousSibling, childNodes[i - 1] || null);
        } else {
            t.notOk(childNodes[i]);
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
        if (node) {
            extra = [parent, node];
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
            t.ok(children.item(i)==null, children.item(i));
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
            t.ok(children.item(i)==null, children.item(i));
        }
        if (node === firstElementChild) {
            break;
        } else {
            node = node.previousElementSibling;
        }
    }
}
