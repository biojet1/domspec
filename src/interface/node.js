"use strict";
// import { IParent, INode, PREV, NEXT, END } from "../tree.js";
exports.__esModule = true;
exports.setAdjacent = exports.Node = exports.END = exports.START = exports.PREV = exports.NEXT = void 0;
exports.NEXT = Symbol("next");
exports.PREV = Symbol("prev");
exports.START = Symbol("start");
exports.END = Symbol("end");
var Node = /** @class */ (function () {
    function Node() {
    }
    Object.defineProperty(Node.prototype, "endNode", {
        //// Tree
        get: function () {
            // End node or self
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "startNode", {
        get: function () {
            // Always this
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.linkNext = function (next) {
        this[exports.NEXT] = next;
        next[exports.PREV] = this;
        return this;
    };
    Node.prototype.linkRight = function (next) {
        this[exports.NEXT] = next;
        next[exports.PREV] = this;
        return this;
    };
    Node.prototype.insertRight = function (next) {
        next.linkLeft(this);
        var prev = this[exports.PREV];
        prev && next.linkRight(this);
        return this;
    };
    Node.prototype.linkPrior = function (prev) {
        this[exports.PREV] = prev;
        prev[exports.NEXT] = this;
        return this;
    };
    Node.prototype.linkLeft = function (prev) {
        this[exports.PREV] = prev;
        prev[exports.NEXT] = this;
        return this;
    };
    Object.defineProperty(Node.prototype, "followingSibling", {
        // linkBetween(prev?: Node, next?: Node) {
        // 	prev && this.linkPrior(prev);
        // 	next && this.linkNext(prev);
        // }
        get: function () {
            var next = this[exports.NEXT];
            return !next || next instanceof parent_node_js_1.EndNode ? null : next;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "precedingSibling", {
        get: function () {
            var _a = this, _b = exports.PREV, prev = _a[_b];
            if (prev) {
                if (prev instanceof parent_node_js_1.EndNode) {
                    if (!(this instanceof child_node_js_1.ChildNode)) {
                        throw new Error("Unexpected previous Node " + prev);
                    }
                    return prev[exports.START];
                }
                else if (prev instanceof child_node_js_1.ChildNode) {
                    if (this instanceof Attr) {
                        throw new Error("Unexpected previous Node " + prev);
                    }
                    return prev;
                    // } else if (prev instanceof ParentNode) {
                    // throw new Error(`Unexpected previous Node ${prev}`);
                }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.remove = function () {
        var _a = this, _b = exports.PREV, prev = _a[_b], _c = exports.NEXT, next = _a.endNode[_c], parentNode = _a.parentNode, nodeType = _a.nodeType;
        // remove(prev, this, next);
        prev && next && prev.linkRight(next);
        if (prev || next) {
            delete this[exports.PREV];
            delete this.endNode[exports.NEXT];
        }
        if (parentNode) {
            delete this.parentNode;
            // moCallback(this, parentNode);
            // if (nodeType === ELEMENT_NODE) disconnectedCallback(this);
        }
    };
    Object.defineProperty(Node.prototype, "nodeType", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.lookupNamespaceURI = function (prefix) {
        return null;
    };
    /// DOM constants
    Node.ELEMENT_NODE = 1;
    Node.ATTRIBUTE_NODE = 2;
    Node.TEXT_NODE = 3;
    Node.CDATA_SECTION_NODE = 4;
    Node.ENTITY_REFERENCE_NODE = 5;
    Node.ENTITY_NODE = 6;
    Node.PROCESSING_INSTRUCTION_NODE = 7;
    Node.COMMENT_NODE = 8;
    Node.DOCUMENT_NODE = 9;
    Node.DOCUMENT_TYPE_NODE = 10;
    Node.DOCUMENT_FRAGMENT_NODE = 11;
    Node.NOTATION_NODE = 12;
    return Node;
}());
exports.Node = Node;
// Node <- ChildNode <- ParentNode
// Node <- EndNode
var setAdjacent = function (prev, next) {
    if (prev)
        prev[exports.NEXT] = next;
    if (next)
        next[exports.PREV] = prev;
};
exports.setAdjacent = setAdjacent;
// export const getEnd = node => node.nodeType === ELEMENT_NODE ? node[END] : node;
// export const remove = (prev?: Node, current: Node, next: Node) => {
// 	const { parentNode, nodeType } = current;
// 	if (prev || next) {
// 		prev && next && setAdjacent(prev, next);
// 		delete current[PREV];
// 		delete current.endNode[NEXT];
// 	}
// 	if (parentNode) {
// 		delete current.parentNode;
// 		// moCallback(current, parentNode);
// 		// if (nodeType === ELEMENT_NODE) disconnectedCallback(current);
// 	}
// };
// export const knownAdjacent = (prev: Node, next: Node) => {
// 	prev[NEXT] = next; // prev->next
// 	next[PREV] = prev; // prev<-next
// };
// Put current between prev and next
// export const knownBoundaries = (prev?: Node, current: Node, next: Node) => {
// 	// prev<-->current/END<-->next
// 	prev && knownAdjacent(prev, current);
// 	knownAdjacent(current.endNode, next);
// };
// export const knownSegment = (
// 	prev?: Node,
// 	start: Node,
// 	end: Node,
// 	next: Node
// ) => {
// 	prev && knownAdjacent(prev, start); // prev<-->start
// 	knownAdjacent(end.endNode, next); // end<-->next
// };
// export const knownSiblings = (prev?: Node, current?: Node, next?: Node) => {
// 	prev && knownAdjacent(prev, current);
// 	next && knownAdjacent(current, next);
// };
// export const putBetween = (current: Node, prev?: Node, next?: Node) => {
// 	prev && knownAdjacent(prev, current);
// 	next && knownAdjacent(current, next);
// };
var child_node_js_1 = require("./child-node.js");
var parent_node_js_1 = require("./parent-node.js");
// Tag, Attr, Child, End
// <Tag><Child><End><Tag><End><Tag><Attr><End><Child><Tag><Attr><Child><End>
// <Tag><Child>
// <Tag><End>
// <Tag><Attr>
// <Tag><Tag>
// <Child><Tag>
// <Child><Attr> X
// <Child><End>
// <Child><Child>
// <Attr><Tag>
// <Attr><Attr>
// <Attr><End>
// <Attr><Child>
// <End><Tag>
// <End><Attr> X
// <End><End> X
// <End><Child>
