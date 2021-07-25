"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EndNode = exports.ParentNode = void 0;
var node_js_1 = require("./node.js");
var child_node_js_1 = require("./child-node.js");
var ParentNode = /** @class */ (function (_super) {
    __extends(ParentNode, _super);
    //// Tree
    function ParentNode() {
        var _this = _super.call(this) || this;
        _this[node_js_1.END] = _this[node_js_1.NEXT] = new EndNode(_this);
        return _this;
    }
    Object.defineProperty(ParentNode.prototype, "endNode", {
        get: function () {
            // End node or self
            return this[node_js_1.END];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParentNode.prototype, "followingSibling", {
        get: function () {
            var next = this[node_js_1.END][node_js_1.NEXT];
            return !next || next instanceof EndNode ? null : next;
        },
        enumerable: false,
        configurable: true
    });
    ParentNode.prototype.linkNext = function (next) {
        this[node_js_1.END][node_js_1.NEXT] = next;
        next[node_js_1.PREV] = this;
        return this;
    };
    Object.defineProperty(ParentNode.prototype, "firstChild", {
        // get followingNode() {
        // 	const end = this.getEnd(node);
        // 	if (end) {
        // 		const next = end[NEXT];
        // 		return next && (next instanceof EndNode ? null : next);
        // 	}
        // }
        //// DOM
        get: function () {
            // Tag -> Attr* -> ChildNode* -> END
            var _a = this, _b = node_js_1.NEXT, next = _a[_b], _c = node_js_1.END, end = _a[_c];
            do {
                if (next instanceof child_node_js_1.ChildNode) {
                    return next;
                }
            } while (next && (next = next[node_js_1.NEXT]) !== end);
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParentNode.prototype, "firstElementChild", {
        get: function () {
            // let { [NEXT]: next, [END]: end } = this;
            // do {
            // 	if (next instanceof ParentNode && next.nodeType === 1) {
            // 		return next;
            // 	}
            // } while (next && (next = next[NEXT]) !== end);
            // return null;
            var cur = this.firstChild;
            for (; cur instanceof child_node_js_1.ChildNode; cur = cur.followingSibling) {
                if (cur instanceof ParentNode && cur.nodeType === 1) {
                    return cur;
                }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParentNode.prototype, "lastChild", {
        get: function () {
            var prev = this[node_js_1.END][node_js_1.PREV];
            return prev && prev instanceof child_node_js_1.ChildNode ? prev : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParentNode.prototype, "lastElementChild", {
        get: function () {
            var cur = this.lastChild;
            for (; cur instanceof child_node_js_1.ChildNode; cur = cur.precedingSibling) {
                if (cur instanceof ParentNode && cur.nodeType === 1) {
                    return cur;
                }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    ParentNode.prototype.insertBefore = function (node, before) {
        if (node === this)
            throw new Error("unable to append a node to itself");
        if (node === before) {
            before = node.nextSibling;
        }
        var next = before || this[node_js_1.END];
        if (node instanceof ParentNode) {
            if (node.nodeType === 11) {
                // DOCUMENT_FRAGMENT_NODE = 11;
                var firstChild = node.firstChild, lastChild = node.lastChild;
                // TODO: adopt
                if (firstChild && lastChild) {
                    var prev = next[node_js_1.PREV];
                    prev && firstChild.linkPrior(prev);
                    lastChild.linkNext(next);
                    // knownSegment(next[PREV], firstChild, lastChild, next);
                    // knownAdjacent(node, node[END]);
                    node.linkRight(node[node_js_1.END]);
                    for (var cur = firstChild; cur;) {
                        // children already connected side by side
                        cur.parentNode = this;
                        // moCallback(firstChild, null);
                        // if (firstChild.nodeType === ELEMENT_NODE)
                        // 	connectedCallback(firstChild);
                        cur = cur !== lastChild && cur.followingSibling;
                    }
                }
            }
            else {
                node.remove();
                node.parentNode = this;
                var prev = next[node_js_1.PREV];
                prev && node.linkPrior(prev);
                node.linkNext(next);
                // knownBoundaries(next[PREV], node, next);
                // moCallback(node, null);
                // connectedCallback(node);
            }
        }
        else if (node instanceof child_node_js_1.ChildNode) {
            node.remove();
            node.parentNode = this;
            var prev = next[node_js_1.PREV];
            prev && node.linkPrior(prev);
            node.linkNext(next);
            // moCallback(node, null);
        }
        return node;
    };
    ParentNode.prototype.appendChild = function (node) {
        return this.insertBefore(node);
    };
    return ParentNode;
}(child_node_js_1.ChildNode));
exports.ParentNode = ParentNode;
// type RemoveKindField<Type> = {
//     [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
// };
// type Mapper<T extends SimplePOJO> = Omit<{
//     [K in keyof T]: {
//       name: K;
//       type: T[K];
//     };
// }, 'last_name'>;
var EndNode = /** @class */ (function (_super) {
    __extends(EndNode, _super);
    function EndNode(parent) {
        var _this = _super.call(this) || this;
        _this[node_js_1.START] = parent;
        _this[node_js_1.PREV] = parent;
        return _this;
    }
    EndNode.prototype.linkPrior = function (prev) {
        this[node_js_1.START][node_js_1.PREV] = prev;
        prev[node_js_1.NEXT] = this;
        return this;
    };
    return EndNode;
}(node_js_1.Node));
exports.EndNode = EndNode;
